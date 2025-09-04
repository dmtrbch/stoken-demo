// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Stellar Soroban Contracts ^0.4.1
use crate::constants::*;
use crate::errors::{
    STokenAllowlistMintError, STokenCooldownChangeError, STokenCoreError,
    STokenEmergencyWithdrawalError, STokenFeeChangeError, STokenOracleError, STokenRoleChangeError,
    STokenSwapError, STokenWhitelistChangeError, STokenWithdrawalRequestError,
};
use crate::keys::{
    PendingCooldowns, PendingFees, PendingLimits, PendingPrice, PendingRoles, PendingWhitelist,
    VaultInitConfig, WithdrawalRequest, WithdrawalRequestStatus,
};
use crate::storage::{
    extend_contract_ttl, extend_persistence_all_ttl, has_authority, read_accountant,
    read_allowlist_mint, read_asset_manager, read_config_cooldown_secs, read_deposit_fee_bps,
    read_downside_cap_bps, read_emergency_withdraw_timelock_end,
    read_emergency_withdraw_token_mint, read_emergency_withdrawal_amount,
    read_emergency_withdrawal_cooldown, read_fee_change_cooldown_secs, read_is_whitelisted,
    read_last_mgmt_fee_ts, read_last_price_update_timestamp, read_management_fee_bps_per_year,
    read_manager, read_max_deviation_bps, read_max_shares_per_user, read_max_total_idle,
    read_max_total_shares, read_min_shares_to_mint, read_next_withdrawal_id, read_oracle,
    read_paused, read_pending_cooldowns, read_pending_fees, read_pending_limits,
    read_pending_price, read_pending_roles, read_pending_whitelist, read_price,
    read_price_acceptance_cooldown_secs, read_price_update_cooldown_secs, read_processor,
    read_role_change_cooldown_secs, read_shares_in_custody, read_system_penalty_bps,
    read_total_idle, read_total_shares, read_total_withdrawals_pending, read_whitelist_enabled,
    read_withdraw_fee_bps, read_withdraw_request, read_withdrawal_ttl_secs, write_accountant,
    write_allowlist_mint, write_asset_manager, write_authority, write_config_cooldown_secs,
    write_created_at, write_deposit_fee_bps, write_downside_cap_bps, write_early_cancel_fee_bps,
    write_emergency_withdraw_timelock_end, write_emergency_withdraw_token_mint,
    write_emergency_withdrawal_amount, write_emergency_withdrawal_cooldown,
    write_fee_change_cooldown_secs, write_is_whitelisted, write_last_mgmt_fee_ts,
    write_last_price_update_timestamp, write_management_fee_bps_per_year, write_manager,
    write_max_deviation_bps, write_max_shares_per_user, write_max_total_idle,
    write_max_total_shares, write_min_shares_to_mint, write_next_withdrawal_id, write_oracle,
    write_paused, write_pending_cooldowns, write_pending_fees, write_pending_limits,
    write_pending_price, write_pending_roles, write_pending_whitelist, write_price,
    write_price_acceptance_cooldown_secs, write_price_update_cooldown_secs, write_processor,
    write_role_change_cooldown_secs, write_shares_in_custody, write_system_penalty_bps,
    write_total_idle, write_total_shares, write_total_withdrawals_pending, write_whitelist_enabled,
    write_withdraw_fee_bps, write_withdraw_request, write_withdrawal_ttl_secs, BUMP_THRESHOLD,
    EXTEND_TO_DAYS,
};
use crate::utils::{
    amount_to_shares_with_decimals, apply_basis_points, apply_fee, calculate_management_fee,
    calculate_price_deviation, calculate_split_fee_tokens, check_max_shares_per_user,
    check_max_total_idle_for_deposit, check_max_total_shares, mul_div_u64_to_u64,
    shares_to_amount_with_decimals, validate_fees, validate_new_limits,
};
use soroban_sdk::{
    contract, contractclient, contractimpl, token::Client, Address, Env, String, Symbol,
};
use stellar_macros::default_impl;
use stellar_tokens::fungible::{
    vault::{FungibleVault, Vault},
    Base, FungibleToken,
};

#[contractclient(name = "VaultInterfaceClient")]
pub trait VaultInteface {
    fn mint_core(
        env: Env,
        mint: Address,
        to: Address,
        amount: u64,
    ) -> Result<(), STokenAllowlistMintError>;
    fn write_vault_total_shares(
        env: Env,
        mint: Address,
        shares: u64,
    ) -> Result<(), STokenAllowlistMintError>;
    fn total_shares(env: Env) -> u64;
    fn query_asset(env: Env) -> Address;
    fn is_paused(env: Env) -> bool;
    fn price(env: Env) -> u64;
    fn asset_manager(env: Env) -> Address;
    fn accountant(env: Env) -> Address;
    fn decimals(env: Env) -> u32;
    fn whitelist_enabled(env: Env) -> bool;
    fn is_whitelisted(env: Env, caller: &Address) -> bool;
    fn min_shares_to_mint(env: Env) -> u64;
    fn balance(env: Env, caller: &Address) -> i128;
}

#[contract]
pub struct SToken;

#[contractimpl]
impl SToken {
    pub fn initialize(env: Env, config: VaultInitConfig) -> Result<(), STokenCoreError> {
        // check admin permissions
        config.authority.require_auth();

        if has_authority(&env) {
            panic!("Vault already initialized");
        }

        // Validate configuration parameters
        validate_fees(
            config.deposit_fee_bps,
            config.withdraw_fee_bps,
            config.management_fee_bps_per_year,
        )
        .map_err(|_| STokenCoreError::InitializationFailed)?;

        // Validate limit parameters
        validate_new_limits(
            config.max_total_shares,
            config.max_shares_per_user,
            config.max_total_idle,
            config.min_shares_to_mint,
        )
        .map_err(|_| STokenCoreError::InitializationFailed)?;

        let timestamp = env.ledger().timestamp();

        // Set initial price with validation
        let initial_price = config.initial_price.unwrap_or(PRICE_PRECISION);
        if initial_price == 0 {
            return Err(STokenCoreError::InvalidPrice);
        }

        // underlying_mint
        Vault::set_asset(&env, config.underlying_mint.clone());

        // Initialize the state.
        write_authority(&env, &config.authority);
        write_oracle(&env, &config.oracle);
        write_manager(&env, &config.manager);
        write_processor(&env, &config.processor);
        write_accountant(&env, &config.accountant);

        write_asset_manager(&env, &config.asset_manager);

        write_deposit_fee_bps(&env, &config.deposit_fee_bps);
        write_withdraw_fee_bps(&env, &config.withdraw_fee_bps);
        write_management_fee_bps_per_year(&env, &config.management_fee_bps_per_year);

        write_last_mgmt_fee_ts(&env, &timestamp);

        write_price(&env, &initial_price);

        write_total_shares(&env, &0);
        write_total_idle(&env, &0);
        write_total_withdrawals_pending(&env, &0);
        write_shares_in_custody(&env, &0);
        write_created_at(&env, &timestamp);

        // Initialize limits - default to no limits (max values)
        write_max_total_shares(&env, &config.max_total_shares.unwrap_or(u64::MAX));
        write_max_shares_per_user(&env, &config.max_shares_per_user.unwrap_or(u64::MAX));
        write_max_total_idle(&env, &config.max_total_idle.unwrap_or(u64::MAX));
        write_min_shares_to_mint(&env, &config.min_shares_to_mint.unwrap_or(0));

        // Initialize price flow settings
        write_pending_price(&env, None);
        write_max_deviation_bps(&env, &config.max_deviation_bps.unwrap_or(500)); // 5% default
        write_last_price_update_timestamp(&env, &0);
        write_price_update_cooldown_secs(&env, &config.price_update_cooldown_secs.unwrap_or(300)); // 5 minutes default
        write_price_acceptance_cooldown_secs(
            &env,
            &config.price_acceptance_cooldown_secs.unwrap_or(300),
        ); // 5 minutes default

        // Initialize withdrawal ID counter
        write_next_withdrawal_id(&env, &0);

        // Initialize withdrawal lifecycle parameters
        write_downside_cap_bps(
            &env,
            &config
                .downside_cap_bps
                .unwrap_or(crate::constants::DEFAULT_DOWNSIDE_CAP_BPS),
        );
        write_withdrawal_ttl_secs(
            &env,
            &config
                .withdrawal_ttl_secs
                .unwrap_or(crate::constants::DEFAULT_WITHDRAWAL_TTL_SECS),
        );
        write_early_cancel_fee_bps(
            &env,
            &config
                .early_cancel_fee_bps
                .unwrap_or(crate::constants::DEFAULT_EARLY_CANCEL_FEE_BPS),
        );
        write_system_penalty_bps(
            &env,
            &config
                .system_penalty_bps
                .unwrap_or(crate::constants::DEFAULT_SYSTEM_PENALTY_BPS),
        );

        // Initialize pause state
        write_paused(&env, &false);

        // Initialize emergency withdrawal timelock and request storage
        write_emergency_withdraw_timelock_end(&env, &0);
        write_emergency_withdrawal_cooldown(
            &env,
            &config.emergency_withdrawal_cooldown.unwrap_or(86400),
        ); // 24 hours default
        write_emergency_withdraw_token_mint(&env, None);
        write_emergency_withdrawal_amount(&env, &0);

        // Initialize role change cooldown
        write_role_change_cooldown_secs(&env, &config.role_change_cooldown_secs.unwrap_or(172800)); // 48 hours default

        // Initialize config change cooldowns
        write_pending_limits(&env, None);
        write_pending_whitelist(&env, None);
        write_pending_cooldowns(&env, None);
        write_config_cooldown_secs(&env, &config.config_cooldown_secs.unwrap_or(86400)); // 24 hours default

        // Initialize pending roles
        write_pending_roles(&env, None);

        // Initialize fee change cooldown
        write_fee_change_cooldown_secs(&env, &config.fee_change_cooldown_secs.unwrap_or(86400)); // 24 hours default

        // Initialize pending fees
        write_pending_fees(&env, None);

        // Initialize whitelist enabled flag
        write_whitelist_enabled(&env, &config.whitelist_enabled.unwrap_or(false));

        // Extend TTL
        extend_contract_ttl(&env, BUMP_THRESHOLD, EXTEND_TO_DAYS);
        extend_persistence_all_ttl(&env, BUMP_THRESHOLD, EXTEND_TO_DAYS);

        // shares_mint
        Base::set_metadata(
            &env,
            7,
            String::from_str(&env, "SToken"),
            String::from_str(&env, "STK"),
        );

        let vault_address = env.current_contract_address();

        // Emit initialization event
        let topics = (
            Symbol::new(&env, "stoken_vault_initialized"),
            vault_address, // this is shares_mint
            config.underlying_mint,
            config.oracle,
            config.manager,
            config.processor,
            config.accountant,
        );

        env.events().publish(
            topics,
            (
                config.deposit_fee_bps,
                config.withdraw_fee_bps,
                config.management_fee_bps_per_year,
            ),
        );

        Ok(())
    }

    pub fn mint_core(
        env: Env,
        mint: Address,
        to: Address,
        amount: u64,
    ) -> Result<(), STokenAllowlistMintError> {
        let allowlist_mint = read_allowlist_mint(&env, &mint);
        if !allowlist_mint {
            return Err(STokenAllowlistMintError::NotInAllowlist);
        }

        // Vault not paused
        let paused = read_paused(&env);
        if paused {
            return Err(STokenAllowlistMintError::VaultPaused);
        }

        Base::mint(&env, &to, amount as i128);

        let topics = (
            Symbol::new(&env, "stoken_allowlist_mint_minted"),
            env.current_contract_address(),
            mint,
        );
        env.events().publish(topics, amount);

        Ok(())
    }

    /// Propose vault role changes
    pub fn propose_roles(
        env: Env,
        new_manager: Option<Address>,
        new_processor: Option<Address>,
        new_accountant: Option<Address>,
        new_oracle: Option<Address>,
        new_asset_manager: Option<Address>,
    ) -> Result<(), STokenRoleChangeError> {
        // Validate that new addresses are vaild and at least one role is being changed
        if new_manager.is_none()
            && new_processor.is_none()
            && new_accountant.is_none()
            && new_oracle.is_none()
            && new_asset_manager.is_none()
        {
            return Err(STokenRoleChangeError::InvalidRole);
        }

        // Validate manager authority
        let manager = read_manager(&env);
        let pending_roles = read_pending_roles(&env);

        manager.require_auth();

        // Ensure no pending roles change exists
        if pending_roles.is_some() {
            return Err(STokenRoleChangeError::RoleChangeTimelockActive);
        }

        // Create pending roles change and start the timelock
        write_pending_roles(
            &env,
            Some(PendingRoles {
                new_manager: new_manager.clone(),
                new_processor: new_processor.clone(),
                new_accountant: new_accountant.clone(),
                new_oracle: new_oracle.clone(),
                new_asset_manager: new_asset_manager.clone(),
                timestamp: env.ledger().timestamp(),
            }),
        );

        let vault_address = env.current_contract_address();
        let effective_time = env.ledger().timestamp() + read_role_change_cooldown_secs(&env);

        // Emit pending roles change event
        let topics = (
            Symbol::new(&env, "stoken_roles_change_pending"),
            vault_address,
            manager,
            new_manager,
            new_processor,
            new_accountant,
            new_oracle,
            new_asset_manager,
        );

        env.events()
            .publish(topics, (effective_time, env.ledger().timestamp()));

        Ok(())
    }

    /// Accept pending role changes after cooldown
    pub fn accept_roles(env: Env) -> Result<(), STokenRoleChangeError> {
        // Validate manager authority
        let manager = read_manager(&env);
        let pending_roles = read_pending_roles(&env).unwrap();

        manager.require_auth();

        // Ensure there is a pending roles change
        if pending_roles.timestamp == 0 {
            return Err(STokenRoleChangeError::NoPendingRolesChange);
        }

        let timestamp = env.ledger().timestamp();

        // Check if the cooldown period has expired
        let cooldown_expired =
            timestamp >= pending_roles.timestamp + read_role_change_cooldown_secs(&env);

        if !cooldown_expired {
            return Err(STokenRoleChangeError::RoleChangeTimelockActive);
        }

        // Store old values for event
        let old_manager = read_manager(&env);
        let old_processor = read_processor(&env);
        let old_accountant = read_accountant(&env);
        let old_oracle = read_oracle(&env);
        let old_asset_manager = read_asset_manager(&env);

        // Apply pending role changes
        if let Some(manager) = pending_roles.new_manager {
            write_manager(&env, &manager);
        }
        if let Some(processor) = pending_roles.new_processor {
            write_processor(&env, &processor);
        }
        if let Some(accountant) = pending_roles.new_accountant {
            write_accountant(&env, &accountant);
        }
        if let Some(oracle) = pending_roles.new_oracle {
            write_oracle(&env, &oracle);
        }
        if let Some(asset_manager) = pending_roles.new_asset_manager {
            write_asset_manager(&env, &asset_manager);
        }

        // Clear pending roles change
        write_pending_roles(&env, None);

        let vault_address = env.current_contract_address();

        // Emit role change event
        let topics = (
            Symbol::new(&env, "stoken_roles_updated"),
            vault_address,
            old_manager.clone(),
            read_manager(&env),
            old_processor,
            read_processor(&env),
            old_accountant,
            read_accountant(&env),
            old_oracle,
            read_oracle(&env),
            old_asset_manager,
            read_asset_manager(&env),
        );

        env.events().publish(topics, (old_manager, timestamp));

        Ok(())
    }

    /// Propose fee parameter changes (starts cooldown period)
    pub fn propose_fees(
        env: Env,
        deposit_fee_bps: u32,
        withdraw_fee_bps: u32,
        management_fee_bps_per_year: u32,
    ) -> Result<(), STokenFeeChangeError> {
        // Validate proposed fees
        validate_fees(
            deposit_fee_bps,
            withdraw_fee_bps,
            management_fee_bps_per_year,
        )
        .map_err(|_| STokenFeeChangeError::InvalidFee)?;

        // Validate manager authority
        let manager = read_manager(&env);
        manager.require_auth();

        // Ensure no pending fee change exists
        let pending_fees = read_pending_fees(&env);
        if pending_fees.is_some() {
            return Err(STokenFeeChangeError::FeeChangeTimelockActive);
        }

        // Ensure at least one fee is different from current values
        if deposit_fee_bps == read_deposit_fee_bps(&env)
            && withdraw_fee_bps == read_withdraw_fee_bps(&env)
            && management_fee_bps_per_year == read_management_fee_bps_per_year(&env)
        {
            return Err(STokenFeeChangeError::NoFeeChanges);
        }

        let timestamp = env.ledger().timestamp();

        // Create pending fee change and start the timelock
        write_pending_fees(
            &env,
            Some(PendingFees {
                new_deposit_fee_bps: deposit_fee_bps,
                new_withdraw_fee_bps: withdraw_fee_bps,
                new_management_fee_bps_peryear: management_fee_bps_per_year,
                timestamp: timestamp,
            }),
        );

        // Emit pending fee change event
        let effective_time = timestamp + read_fee_change_cooldown_secs(&env);
        let vault_address = env.current_contract_address();

        let topics = (
            Symbol::new(&env, "stoken_fees_change_pending"),
            vault_address,
            manager,
        );

        env.events().publish(
            topics,
            (
                deposit_fee_bps,
                withdraw_fee_bps,
                management_fee_bps_per_year,
                read_deposit_fee_bps(&env),
                read_withdraw_fee_bps(&env),
                read_management_fee_bps_per_year(&env),
                effective_time,
                timestamp,
            ),
        );

        Ok(())
    }

    /// Accept pending fee changes after cooldown
    pub fn accept_fees(env: Env) -> Result<(), STokenFeeChangeError> {
        // Validate manager authority
        let manager = read_manager(&env);
        manager.require_auth();

        // Ensure there is a pending fee change
        let pending_fees = read_pending_fees(&env).unwrap();
        if pending_fees.timestamp == 0 {
            return Err(STokenFeeChangeError::NoPendingFeesChange);
        }

        let timestamp = env.ledger().timestamp();

        // Check if the cooldown period has expired
        let cooldown_expired =
            timestamp >= pending_fees.timestamp + read_fee_change_cooldown_secs(&env);

        if !cooldown_expired {
            return Err(STokenFeeChangeError::FeeChangeTimelockActive);
        }

        // Store old values for event
        let old_deposit_fee_bps = read_deposit_fee_bps(&env);
        let old_withdraw_fee_bps = read_withdraw_fee_bps(&env);
        let old_management_fee_bps_per_year = read_management_fee_bps_per_year(&env);

        // Apply pending fee changes
        write_deposit_fee_bps(&env, &pending_fees.new_deposit_fee_bps);
        write_withdraw_fee_bps(&env, &pending_fees.new_withdraw_fee_bps);
        write_management_fee_bps_per_year(&env, &pending_fees.new_management_fee_bps_peryear);

        // Clear pending fee change
        write_pending_fees(&env, None);

        let vault_address = env.current_contract_address();

        // Emit fee change event
        let topics = (
            Symbol::new(&env, "stoken_fees_updated"),
            vault_address,
            manager,
        );

        env.events().publish(
            topics,
            (
                old_deposit_fee_bps,
                read_deposit_fee_bps(&env),
                old_withdraw_fee_bps,
                read_withdraw_fee_bps(&env),
                old_management_fee_bps_per_year,
                read_management_fee_bps_per_year(&env),
                timestamp,
            ),
        );

        Ok(())
    }

    /// Propose limits parameter changes (starts cooldown period)
    pub fn propose_limits(
        env: Env,
        new_max_total_shares: Option<u64>,
        new_max_shares_per_user: Option<u64>,
        new_max_total_idle: Option<u64>,
        new_max_deviation_bps: Option<u32>,
        new_min_shares_to_mint: Option<u64>,
    ) -> Result<(), STokenCoreError> {
        // Validate manager authority
        let manager = read_manager(&env);
        manager.require_auth();

        // Validate proposed limits against maximums
        validate_new_limits(
            new_max_total_shares,
            new_max_shares_per_user,
            new_max_total_idle,
            new_min_shares_to_mint,
        )
        .map_err(|_| STokenCoreError::InvalidLimit)?;

        // Validate that user limit doesn't exceed total limit (considering current values)
        let effective_total_shares = new_max_total_shares.unwrap_or(read_max_total_shares(&env));
        let effective_shares_per_user =
            new_max_shares_per_user.unwrap_or(read_max_shares_per_user(&env));

        if effective_shares_per_user > effective_total_shares {
            return Err(STokenCoreError::InvalidLimit);
        }

        // Validate deviation if provided
        if let Some(deviation) = new_max_deviation_bps {
            if deviation > BPS_PRECISION {
                // Max 100%
                return Err(STokenCoreError::InvalidFee);
            }
        }

        // Ensure no pending limits change exists
        let pending_limits = read_pending_limits(&env);
        if pending_limits.is_some() {
            return Err(STokenCoreError::LimitsChangeTimelockActive);
        }

        // Ensure at least one limit is different from current values
        // is this valid check TODO
        if new_max_total_shares == Some(read_max_total_shares(&env))
            && new_max_shares_per_user == Some(read_max_shares_per_user(&env))
            && new_max_total_idle == Some(read_max_total_idle(&env))
            && new_max_deviation_bps == Some(read_max_deviation_bps(&env))
        {
            return Err(STokenCoreError::NoLimitsChanges);
        }

        let timestamp = env.ledger().timestamp();

        // Create pending limits change and start the timelock
        write_pending_limits(
            &env,
            Some(PendingLimits {
                new_max_total_shares,
                new_max_shares_per_user,
                new_max_total_idle,
                new_max_deviation_bps,
                new_min_shares_to_mint,
                timestamp: timestamp,
            }),
        );

        // Emit pending limits change event
        let effective_time = timestamp + read_config_cooldown_secs(&env);
        let vault_address = env.current_contract_address();

        let topics = (
            Symbol::new(&env, "stoken_limits_change_pending"),
            vault_address,
            manager,
        );

        env.events().publish(
            topics,
            (
                new_max_total_shares,
                new_max_shares_per_user,
                new_max_total_idle,
                new_max_deviation_bps,
                read_max_total_shares(&env),
                read_max_shares_per_user(&env),
                read_max_total_idle(&env),
                read_max_deviation_bps(&env),
                effective_time,
                timestamp,
            ),
        );

        Ok(())
    }

    /// Accept pending limits changes after cooldown
    pub fn accept_limits(env: Env) -> Result<(), STokenCoreError> {
        // Validate manager authority
        let manager = read_manager(&env);
        manager.require_auth();

        // Ensure there is a pending limits change
        let pending_limits = read_pending_limits(&env).unwrap();
        if pending_limits.timestamp == 0 {
            return Err(STokenCoreError::NoPendingLimitsChange);
        }

        let timestamp = env.ledger().timestamp();

        // Check if the cooldown period has expired
        let cooldown_expired =
            timestamp >= pending_limits.timestamp + read_config_cooldown_secs(&env);

        if !cooldown_expired {
            return Err(STokenCoreError::LimitsChangeTimelockActive);
        }

        // Store old values for event
        let old_max_total_shares = read_max_total_shares(&env);
        let old_max_shares_per_user = read_max_shares_per_user(&env);
        let old_max_total_idle = read_max_total_idle(&env);
        let old_max_deviation_bps = read_max_deviation_bps(&env);
        let old_min_shares_to_mint = read_min_shares_to_mint(&env);

        // Apply pending limits changes
        if let Some(max_total_shares) = pending_limits.new_max_total_shares {
            write_max_total_shares(&env, &max_total_shares);
        }
        if let Some(max_shares_per_user) = pending_limits.new_max_shares_per_user {
            write_max_shares_per_user(&env, &max_shares_per_user);
        }
        if let Some(max_total_idle) = pending_limits.new_max_total_idle {
            write_max_total_idle(&env, &max_total_idle);
        }
        if let Some(max_deviation_bps) = pending_limits.new_max_deviation_bps {
            write_max_deviation_bps(&env, &max_deviation_bps);
        }
        if let Some(min_shares_to_mint) = pending_limits.new_min_shares_to_mint {
            write_min_shares_to_mint(&env, &min_shares_to_mint);
        }

        // Clear pending limits change
        write_pending_limits(&env, None);

        let vault_address = env.current_contract_address();

        // Emit limits updated event
        let topics = (
            Symbol::new(&env, "stoken_limits_updated"),
            vault_address,
            manager,
        );

        env.events().publish(
            topics,
            (
                old_max_total_shares,
                read_max_total_shares(&env),
                old_max_shares_per_user,
                read_max_shares_per_user(&env),
                old_max_total_idle,
                read_max_total_idle(&env),
                old_max_deviation_bps,
                read_max_deviation_bps(&env),
                old_min_shares_to_mint,
                read_min_shares_to_mint(&env),
                timestamp,
            ),
        );

        Ok(())
    }

    /// Update S-Token price (with secure price flow for v2)
    pub fn update_price(env: Env, new_price: u64) -> Result<(), STokenOracleError> {
        // Validate price
        if new_price == 0 {
            return Err(STokenOracleError::InvalidPrice);
        }

        // Validate oracle authority
        let oracle = read_oracle(&env);
        oracle.require_auth();

        let timestamp = env.ledger().timestamp();

        // Check if enough time has passed since last update
        let time_since_last_update = timestamp - read_last_price_update_timestamp(&env);
        if time_since_last_update < read_price_update_cooldown_secs(&env) {
            return Err(STokenOracleError::PriceUpdateTooFrequent);
        }

        let old_price = read_price(&env);

        // Calculate deviation if thresholds are configured
        if read_max_deviation_bps(&env) > 0 && read_price_acceptance_cooldown_secs(&env) > 0 {
            let max_deviation_bps = read_max_deviation_bps(&env);
            let deviation_bps = calculate_price_deviation(old_price, new_price)
                .map_err(|_| STokenOracleError::InvalidOracleData)?;

            // If deviation is within threshold, check deviation cooldown
            if deviation_bps <= max_deviation_bps {
                // Auto-apply immediately
                write_price(&env, &new_price);
                write_last_price_update_timestamp(&env, &timestamp);

                // Clear any existing pending price
                write_pending_price(&env, None);

                // Emit price update event
                let topics = (
                    Symbol::new(&env, "stoken_price_updated"),
                    env.current_contract_address(),
                    oracle,
                );

                env.events()
                    .publish(topics, (old_price, new_price, timestamp));
            } else {
                // Deviation exceeds threshold - store as pending price
                write_pending_price(
                    &env,
                    Some(PendingPrice {
                        value: new_price,
                        timestamp: timestamp, // is this correct?
                    }),
                );

                // Emit pending price event
                let topics = (
                    Symbol::new(&env, "stoken_price_deviation_exceeds_limit"),
                    env.current_contract_address(),
                    oracle,
                );

                env.events()
                    .publish(topics, (old_price, new_price, deviation_bps, timestamp));
            }
        } else {
            // No deviation checking configured - apply price immediately (legacy behavior)
            write_price(&env, &new_price);
            write_last_price_update_timestamp(&env, &timestamp);

            // Clear any existing pending price
            write_pending_price(&env, None);

            // Emit price update event
            let topics = (
                Symbol::new(&env, "stoken_price_updated"),
                env.current_contract_address(),
                oracle,
            );

            env.events()
                .publish(topics, (old_price, new_price, timestamp));
        }

        Ok(())
    }

    /// Deposit underlying tokens to receive S-Tokens
    pub fn deposit_core(
        env: Env,
        amount: u64,
        caller: Address,
        min_shares: Option<u64>,
        beneficiary: Option<Address>,
    ) -> Result<(), STokenCoreError> {
        // Basic validation
        if amount == 0 {
            return Err(STokenCoreError::InvalidAmount);
        }

        caller.require_auth();

        let paused = read_paused(&env);
        if paused {
            return Err(STokenCoreError::VaultPaused);
        }

        // Whitelist check (if enabled) - check if user whitelist PDA exists via remaining accounts
        let whitelist_enabled = read_whitelist_enabled(&env);
        if whitelist_enabled {
            let is_whitelisted = read_is_whitelisted(&env, &caller);
            if !is_whitelisted {
                return Err(STokenCoreError::UserNotWhitelisted);
            }
        }

        // Determine beneficiary
        let beneficiary = beneficiary.unwrap_or(caller.clone());

        let total_idle = read_total_idle(&env);
        let max_total_idle = read_max_total_idle(&env);

        // Get current shares of beneficiary
        let recipient_current_shares = Vault::balance(&env, &beneficiary);

        let asset = Vault::query_asset(&env);
        let underlying_mint = Client::new(&env, &asset);
        let underlying_mint_decimals = underlying_mint.decimals();
        let shares_mint_decimals = Vault::decimals(&env);

        // Check limits
        check_max_total_idle_for_deposit(total_idle, amount, max_total_idle)?;

        // Calculate shares
        let total_shares = amount_to_shares_with_decimals(
            amount,
            read_price(&env),
            underlying_mint_decimals,
            shares_mint_decimals,
        )?;

        let (user_shares, fee_shares) = apply_fee(total_shares, read_deposit_fee_bps(&env))?;

        let total_new_shares = user_shares + fee_shares;

        // Validate limits
        check_max_total_shares(
            read_total_shares(&env),
            total_new_shares,
            read_max_total_shares(&env),
        )?;
        check_max_shares_per_user(
            recipient_current_shares as u64,
            user_shares,
            read_max_shares_per_user(&env),
        )?;

        // Validate minimum shares requirement after deposit
        if read_min_shares_to_mint(&env) > 0 {
            let final_shares = (recipient_current_shares as u64)
                .checked_add(user_shares)
                .ok_or(STokenCoreError::MathOverflow)?;
            if final_shares > 0 {
                if final_shares < read_min_shares_to_mint(&env) {
                    return Err(STokenCoreError::MinimumSharesNotMet);
                }
            }
        }

        if let Some(min) = min_shares {
            if user_shares < min {
                return Err(STokenCoreError::SlippageNotMet);
            }
        }

        // Execute transfer
        underlying_mint.transfer(&caller, &env.current_contract_address(), &(amount as i128));

        // Update vault state
        {
            write_total_idle(
                &env,
                &total_idle
                    .checked_add(amount)
                    .ok_or(STokenCoreError::MathOverflow)?,
            );
            write_total_shares(
                &env,
                &read_total_shares(&env)
                    .checked_add(total_new_shares)
                    .ok_or(STokenCoreError::MathOverflow)?,
            );
        }

        // Mint tokens
        if user_shares > 0 {
            Base::mint(&env, &beneficiary, user_shares as i128);
        }

        if fee_shares > 0 {
            let accountant = read_accountant(&env);
            Base::mint(&env, &accountant, fee_shares as i128);
        }

        // Emit deposit event
        let topics = (
            Symbol::new(&env, "stoken_deposit"),
            env.current_contract_address(),
            caller,
            beneficiary,
        );
        env.events().publish(
            topics,
            (
                amount,
                user_shares,
                fee_shares,
                read_price(&env),
                env.ledger().timestamp(),
            ),
        );

        Ok(())
    }
    /// Request withdrawal of S-Tokens
    pub fn withdraw_request(
        env: Env,
        caller: Address,
        shares: u64,
        min_amount_out: u64,
    ) -> Result<(), STokenCoreError> {
        // Validate shares amount
        if shares == 0 {
            return Err(STokenCoreError::InvalidAmount);
        }

        caller.require_auth();

        // Check user account balance - basic validation only
        let user_shares = Vault::balance(&env, &caller);
        if shares > user_shares as u64 {
            return Err(STokenCoreError::InsufficientShares);
        }

        // Check minimum balance requirement after withdrawal
        let remaining_shares = (user_shares as u64)
            .checked_sub(shares)
            .ok_or(STokenCoreError::MathOverflow)?;

        if read_min_shares_to_mint(&env) > 0 {
            if shares < read_min_shares_to_mint(&env) {
                return Err(STokenCoreError::WithdrawalAmountTooLow);
            }
            if remaining_shares > 0 {
                if remaining_shares < read_min_shares_to_mint(&env) {
                    return Err(STokenCoreError::MinimumSharesNotMet);
                }
            }
        }

        // Check that vault is not paused
        let paused = read_paused(&env);
        if paused {
            return Err(STokenCoreError::VaultPaused);
        }

        // Check whitelist authorization if enabled
        let whitelist_enabled = read_whitelist_enabled(&env);
        if whitelist_enabled {
            let is_whitelisted = read_is_whitelisted(&env, &caller);
            if !is_whitelisted {
                return Err(STokenCoreError::UserNotWhitelisted);
            }
        }

        // Get values we need
        let current_price = read_price(&env);
        let withdraw_fee_bps = read_withdraw_fee_bps(&env);

        // Apply withdrawal fee to shares
        let (shares_after_fee, fee_shares) = apply_fee(shares, withdraw_fee_bps)?;

        // Calculate amount due with decimal awareness (based on shares after fee)
        let underlying_asset = Vault::query_asset(&env);
        let underlying_mint = Client::new(&env, &underlying_asset);
        let underlying_mint_decimals = underlying_mint.decimals();

        let amount_due = amount_to_shares_with_decimals(
            shares_after_fee,
            current_price,
            underlying_mint_decimals,
            Vault::decimals(&env),
        )?;

        // New withdrawal lifecycle validation: min_amount_out cannot exceed theoretical amount
        if min_amount_out > amount_due {
            return Err(STokenCoreError::InvalidWithdrawalMinimum);
        }

        // System protection: prevent users from setting min_amount_out too close to current value
        // This ensures requests remain fulfillable even with normal price movements
        if min_amount_out > 0 {
            // Calculate maximum allowed minimum based on vault's downside cap
            // User must accept at least the same slippage tolerance as the system
            let percentage_bps = 10000u32.saturating_sub(read_downside_cap_bps(&env)); // 100% - downside cap
            let max_allowed_min = apply_basis_points(amount_due, percentage_bps)?;

            if min_amount_out > max_allowed_min {
                return Err(STokenCoreError::MinimumTooHigh);
            }
        }
        // min_amount_out of 0 is valid (means "accept any amount")

        // Get next withdrawal ID and increment counter
        let withdrawal_id = read_next_withdrawal_id(&env);

        // Create withdrawal request
        write_withdraw_request(
            &env,
            &withdrawal_id,
            &WithdrawalRequest {
                user: caller.clone(),
                shares,
                amount_due,
                min_amount_out,
                fee_shares,
                price_at_request: current_price,
                created_at: env.ledger().timestamp(),
                status: WithdrawalRequestStatus::PENDING,
                processed_at: None,
            },
        );

        let vault_address = env.current_contract_address();

        // Transfer original shares to vault custody in one transaction (don't burn yet - preserve share price)
        if shares > 0 {
            underlying_mint.transfer(&caller, &vault_address, &(shares as i128));
        }

        // Update vault state - don't update total_shares yet since we haven't burned them
        write_total_withdrawals_pending(
            &env,
            &read_total_withdrawals_pending(&env)
                .checked_add(amount_due)
                .ok_or(STokenCoreError::MathOverflow)?,
        );
        write_next_withdrawal_id(
            &env,
            &withdrawal_id
                .checked_add(1)
                .ok_or(STokenCoreError::MathOverflow)?,
        );
        // Update shares in custody counter
        write_shares_in_custody(
            &env,
            &read_shares_in_custody(&env)
                .checked_add(shares)
                .ok_or(STokenCoreError::MathOverflow)?,
        );

        // Emit withdrawal request event
        let topics = (
            Symbol::new(&env, "stoken_withdrawal_request"),
            vault_address,
            caller,
            withdrawal_id,
        );
        env.events().publish(
            topics,
            (
                shares_after_fee,
                fee_shares,
                amount_due,
                min_amount_out,
                current_price,
                env.ledger().timestamp(),
            ),
        );

        Ok(())
    }

    /// Update minimum acceptable payout for a pending withdrawal request
    pub fn update_withdrawal_minimum(
        env: Env,
        caller: Address,
        request_id: u64,
        new_minimum: u64,
    ) -> Result<(), STokenWithdrawalRequestError> {
        caller.require_auth();

        // Check that vault is not paused
        if read_paused(&env) {
            return Err(STokenWithdrawalRequestError::VaultPaused);
        }

        let withdrawal_request_op = read_withdraw_request(&env, &request_id);

        if withdrawal_request_op.is_none() {
            return Err(STokenWithdrawalRequestError::InvalidWithdrawalRequest);
        }

        let mut withdrawal_request = withdrawal_request_op.unwrap();

        // Ensure request is in pending state (additional validation)
        if withdrawal_request.status != WithdrawalRequestStatus::PENDING {
            return Err(STokenWithdrawalRequestError::InvalidWithdrawalRequestStatus);
        }

        if caller != withdrawal_request.user {
            return Err(STokenWithdrawalRequestError::InvalidUserAccount);
        }

        // Validate that the new minimum is not higher than the current minimum
        if new_minimum > withdrawal_request.min_amount_out {
            return Err(STokenWithdrawalRequestError::MinimumCannotIncrease);
        }

        let old_minimum = withdrawal_request.min_amount_out;

        withdrawal_request.min_amount_out = new_minimum;

        write_withdraw_request(&env, &request_id, &withdrawal_request);

        // Emit update event
        let topics = (
            Symbol::new(&env, "stoken_withdrawal_minimum_updated"),
            env.current_contract_address(),
            caller,
            request_id,
        );
        env.events()
            .publish(topics, (old_minimum, new_minimum, env.ledger().timestamp()));

        Ok(())
    }

    /// Process queued deposits (processor only)
    pub fn process_deposits(env: Env, amount: u64) -> Result<(), STokenCoreError> {
        // Validate amount
        if amount == 0 {
            return Err(STokenCoreError::InvalidAmount);
        }

        // Validate processor authority
        let processor = read_processor(&env);
        let asset_manager = read_asset_manager(&env);
        processor.require_auth();

        let total_idle = read_total_idle(&env);

        if amount > total_idle {
            return Err(STokenCoreError::InsufficientBalance);
        }

        // Capture balance before transfer
        let vault_balance_before = total_idle;

        let vault_address = env.current_contract_address();

        // Transfer underlying tokens from vault to asset manager
        Vault::transfer(&env, &vault_address, &asset_manager, amount as i128);

        // Update vault state - reduce idle funds as they are sent to asset manager
        write_total_idle(
            &env,
            &total_idle
                .checked_sub(amount)
                .ok_or(STokenCoreError::MathOverflow)?,
        );

        // Capture balance after transfer
        let vault_balance_after = read_total_idle(&env);

        // Emit deposit processed event
        let topics = (
            Symbol::new(&env, "stoken_deposits_processed"),
            vault_address,
            processor,
            asset_manager,
        );

        env.events().publish(
            topics,
            (
                amount,
                vault_balance_before,
                vault_balance_after,
                env.ledger().timestamp(),
            ),
        );

        Ok(())
    }

    /// Return funds from asset manager to vault
    pub fn return_funds(env: Env, amount: u64) -> Result<(), STokenCoreError> {
        // Validate amount
        if amount == 0 {
            return Err(STokenCoreError::InvalidAmount);
        }

        // Validate asset manager authority
        let asset_manager = read_asset_manager(&env);
        asset_manager.require_auth();

        let total_idle = read_total_idle(&env);

        let vault_address = env.current_contract_address();

        // Transfer underlying tokens from asset manager back to vault
        Vault::transfer(&env, &asset_manager, &vault_address, amount as i128);

        // Increase idle funds as they are returned from asset manager
        // Note: This operation does NOT check max_total_idle limit, as asset manager
        // fund returns should always be allowed regardless of idle fund limits
        write_total_idle(
            &env,
            &total_idle
                .checked_add(amount)
                .ok_or(STokenCoreError::MathOverflow)?,
        );

        // Emit return funds event
        let topics = (Symbol::new(&env, "stoken_funds_returned"), vault_address);

        env.events()
            .publish(topics, (amount, asset_manager, env.ledger().timestamp()));

        Ok(())
    }

    /// Fulfill a withdrawal request by request ID
    pub fn fulfill_withdrawal(
        env: Env,
        user: Address,
        request_id: u64,
    ) -> Result<(), STokenWithdrawalRequestError> {
        let processor = read_processor(&env);

        // Validate processor authority
        processor.require_auth();

        let withdrawal_request_op = read_withdraw_request(&env, &request_id);

        if withdrawal_request_op.is_none() {
            return Err(STokenWithdrawalRequestError::InvalidWithdrawalRequest);
        }

        let mut withdrawal_request = withdrawal_request_op.unwrap();

        // Ensure request is in pending state (additional validation)
        if withdrawal_request.status != WithdrawalRequestStatus::PENDING {
            return Err(STokenWithdrawalRequestError::InvalidWithdrawalRequestStatus);
        }

        if user != withdrawal_request.user {
            return Err(STokenWithdrawalRequestError::InvalidUserAccount);
        }

        // Check that vault is not paused
        if read_paused(&env) {
            return Err(STokenWithdrawalRequestError::VaultPaused);
        }

        let vault_address = env.current_contract_address();
        let underlying_asset_address = Vault::query_asset(&env);
        let underlying_asset = Client::new(&env, &underlying_asset_address);
        let vault_balance = underlying_asset.balance(&vault_address) as u64;

        // Get current values for payout algorithm
        let current_price = read_price(&env);
        let price_at_request = withdrawal_request.price_at_request;
        let shares_to_burn = withdrawal_request.shares;
        let min_out = withdrawal_request.min_amount_out;

        // Step 1: Compute theoretical_out = shares_to_burn × current_price (decimal-aware)
        let theoretical_out = shares_to_amount_with_decimals(
            shares_to_burn,
            current_price,
            underlying_asset.decimals(),
            Vault::decimals(&env),
        )
        .map_err(|_| STokenWithdrawalRequestError::MathOverflow)?;

        // Step 2: Determine amount to pay based on new logic
        let amount_to_pay = if theoretical_out < min_out {
            // Price fell below min_out threshold: pay stored minimum
            min_out
        } else if current_price > price_at_request {
            // Price rose above request price: pay based on price at request (cap gains)
            withdrawal_request.amount_due
        } else {
            // Price is between min_out and request price: pay theoretical amount
            theoretical_out
        };

        // Ensure we never pay more than available liquidity
        if amount_to_pay > vault_balance {
            return Err(STokenWithdrawalRequestError::InsufficientVaultFunds);
        }
        if amount_to_pay > read_total_idle(&env) {
            return Err(STokenWithdrawalRequestError::InsufficientBalance);
        }

        // Update withdrawal request state before processing
        withdrawal_request.status = WithdrawalRequestStatus::FULFILLED;
        withdrawal_request.processed_at = Some(env.ledger().timestamp());

        // Transfer calculated amount to user
        underlying_asset.transfer(
            &vault_address,
            &withdrawal_request.user,
            &(amount_to_pay as i128),
        );

        // Update vault state
        write_total_withdrawals_pending(
            &env,
            &read_total_withdrawals_pending(&env)
                .checked_sub(withdrawal_request.amount_due)
                .ok_or(STokenWithdrawalRequestError::MathOverflow)?,
        );

        // Update shares in custody - decrement by the total shares that were in custody
        let total_shares_in_custody = withdrawal_request.shares + withdrawal_request.fee_shares;
        write_shares_in_custody(
            &env,
            &read_shares_in_custody(&env)
                .checked_sub(total_shares_in_custody)
                .ok_or(STokenWithdrawalRequestError::MathOverflow)?,
        );

        // Reduce idle funds as they are sent to user
        write_total_idle(
            &env,
            &read_total_idle(&env)
                .checked_sub(amount_to_pay)
                .ok_or(STokenWithdrawalRequestError::MathOverflow)?,
        );

        // Transfer fee shares from vault custody to accountant
        if withdrawal_request.fee_shares > 0 {
            Vault::transfer(
                &env,
                &vault_address,
                &read_accountant(&env),
                withdrawal_request.fee_shares as i128,
            );
        }

        // Now burn the shares after fee from vault custody (preserve share price)
        if withdrawal_request.shares > 0 {
            Base::burn(&env, &vault_address, withdrawal_request.shares as i128);

            // Update total shares now that we've actually burned them
            write_total_shares(
                &env,
                &read_total_shares(&env)
                    .checked_sub(withdrawal_request.shares)
                    .ok_or(STokenWithdrawalRequestError::MathOverflow)?,
            );
        }

        // Update withdrawal request state
        write_withdraw_request(&env, &request_id, &withdrawal_request);

        // Emit withdrawal fulfilled event
        let topics = (
            Symbol::new(&env, "stoken_withdrawal_fulfilled"),
            vault_address,
            user,
            request_id,
        );

        env.events().publish(
            topics,
            (
                processor,
                amount_to_pay,
                withdrawal_request.shares,
                env.ledger().timestamp(),
            ),
        );

        Ok(())
    }

    /// Accrue management fee (anyone can call)
    pub fn accrue_management_fee(env: Env) -> Result<(), STokenCoreError> {
        let last_mgmt_fee_ts = read_last_mgmt_fee_ts(&env);
        let management_fee_bps_per_year = read_management_fee_bps_per_year(&env);
        let accountant = read_accountant(&env);
        let timestamp = env.ledger().timestamp();

        // Calculate time elapsed since last fee accrual
        let time_elapsed = timestamp
            .checked_sub(last_mgmt_fee_ts)
            .ok_or(STokenCoreError::InvalidTimestamp)?;

        // Ensure time has actually elapsed
        if time_elapsed <= 0 {
            return Ok(());
        }

        // Get current total supply
        let total_supply = Vault::total_supply(&env);

        // Calculate management fee shares to mint
        let fee_shares = calculate_management_fee(
            total_supply as u64,
            management_fee_bps_per_year,
            time_elapsed,
        )?;

        // Only proceed if there are fee shares to mint
        if fee_shares > 0 {
            // Mint fee shares to accountant
            Base::mint(&env, &accountant, fee_shares as i128);

            // Update vault total_shares to reflect newly minted fee shares
            write_total_shares(
                &env,
                &read_total_shares(&env)
                    .checked_add(fee_shares)
                    .ok_or(STokenCoreError::MathOverflow)?,
            );

            // Update last management fee timestamp
            write_last_mgmt_fee_ts(&env, &timestamp);

            let vault_address = env.current_contract_address();

            // Emit management fee accrued event
            let topics = (
                Symbol::new(&env, "stoken_management_fee_accrued"),
                vault_address,
            );

            env.events()
                .publish(topics, (accountant, fee_shares, time_elapsed, timestamp));
        } else {
            // Just update timestamp even if no fees
            write_last_mgmt_fee_ts(&env, &timestamp);
        }

        Ok(())
    }

    /// Accept a pending price update
    pub fn accept_price(
        env: Env,
        manager_auth: Option<Address>,
        processor_auth: Option<Address>,
        oracle_auth: Option<Address>,
    ) -> Result<(), STokenCoreError> {
        let manager = read_manager(&env);
        let processor = read_processor(&env);
        let oracle = read_oracle(&env);

        let mut is_manager = false;
        let accepted_by;

        // TODO: make this multi auth using OZ access control
        if let Some(manager_auth) = manager_auth {
            if manager_auth == manager {
                manager.require_auth();
                is_manager = true;
                accepted_by = manager_auth;
            } else {
                return Err(STokenCoreError::Unauthorized);
            }
        } else if let Some(processor_auth) = processor_auth {
            if processor_auth == processor {
                processor.require_auth();
                accepted_by = processor_auth;
            } else {
                return Err(STokenCoreError::Unauthorized);
            }
        } else if let Some(oracle_auth) = oracle_auth {
            if oracle_auth == oracle {
                oracle.require_auth();
                accepted_by = oracle_auth;
            } else {
                return Err(STokenCoreError::Unauthorized);
            }
        } else {
            return Err(STokenCoreError::Unauthorized);
        }

        let timestamp = env.ledger().timestamp();
        let pending_price_value = read_pending_price(&env)
            .map(|p| p.value)
            .ok_or(STokenCoreError::InvalidPrice)?;
        let pending_price_timestamp = read_pending_price(&env)
            .map(|p| p.timestamp)
            .ok_or(STokenCoreError::InvalidTimestamp)?;
        let price_acceptance_cooldown_secs = read_price_acceptance_cooldown_secs(&env);
        let price = read_price(&env);

        // Check if enough time has passed for general acceptance
        let cooldown_expired =
            timestamp >= pending_price_timestamp + price_acceptance_cooldown_secs;

        let can_manager_bypass = if is_manager {
            // Manager can only bypass cooldown for small deviations
            let deviation_bps = calculate_price_deviation(price, pending_price_value)?;
            deviation_bps <= MAX_MANAGER_BYPASS_DEVIATION_BPS
        } else {
            false
        };

        if !can_manager_bypass && !cooldown_expired {
            return Err(STokenCoreError::PriceCooldownNotExpired);
        }

        let old_price = price;
        let new_price = pending_price_value;

        // Apply the price
        write_price(&env, &new_price);
        // Update last price update timestamp on acceptance to enforce cooldown correctly
        write_last_price_update_timestamp(&env, &timestamp);

        // Clear any existing pending price
        write_pending_price(&env, None);

        // Emit price update event
        let topics = (
            Symbol::new(&env, "stoken_price_accepted"),
            env.current_contract_address(),
        );

        env.events()
            .publish(topics, (accepted_by, old_price, new_price, timestamp));

        Ok(())
    }

    /// Reject a pending price update (manager only)
    pub fn reject_price(env: Env) -> Result<(), STokenCoreError> {
        let manager = read_manager(&env);
        let pending_price_value = read_pending_price(&env)
            .map(|p| p.value)
            .ok_or(STokenCoreError::InvalidPrice)?;

        manager.require_auth();

        let rejected_price = pending_price_value;
        let current_price = read_price(&env);

        // Clear the pending price
        write_pending_price(&env, None);

        // Emit price update event
        let topics = (
            Symbol::new(&env, "stoken_price_rejected"),
            env.current_contract_address(),
        );

        env.events().publish(
            topics,
            (
                manager,
                rejected_price,
                current_price,
                env.ledger().timestamp(),
            ),
        );

        Ok(())
    }

    /// Cancel a withdrawal request
    pub fn cancel_withdrawal(
        env: Env,
        caller: Address,
        request_id: u64,
    ) -> Result<(), STokenWithdrawalRequestError> {
        caller.require_auth();

        // Check that vault is not paused
        if read_paused(&env) {
            return Err(STokenWithdrawalRequestError::VaultPaused);
        }

        let withdrawal_request_op = read_withdraw_request(&env, &request_id);

        if withdrawal_request_op.is_none() {
            return Err(STokenWithdrawalRequestError::InvalidWithdrawalRequest);
        }
        let mut withdrawal_request = withdrawal_request_op.unwrap();
        // Ensure request is in pending state (additional validation)
        if withdrawal_request.status != WithdrawalRequestStatus::PENDING {
            return Err(STokenWithdrawalRequestError::InvalidWithdrawalRequestStatus);
        }

        let timestamp = env.ledger().timestamp();

        // Calculate if TTL has expired
        let ttl_expired =
            timestamp >= withdrawal_request.created_at + read_withdrawal_ttl_secs(&env);

        // Validate cancellation permissions based on TTL and caller
        let processor = read_processor(&env);
        if caller == processor {
            // Bot can only cancel after TTL expires
            if !ttl_expired {
                return Err(STokenWithdrawalRequestError::TtlNotExpired);
            }
        } else if caller != withdrawal_request.user {
            return Err(STokenWithdrawalRequestError::InvalidUserAccount);
        }

        // Update withdrawal request state before processing
        withdrawal_request.status = WithdrawalRequestStatus::CANCELLED;
        withdrawal_request.processed_at = Some(timestamp);

        // Get shares after fee and fee shares from custody
        let shares_after_fee = withdrawal_request.shares;
        let fee_shares = withdrawal_request.fee_shares;
        let shares_to_transfer_to_user;
        let mut fee_shares_to_accountant = 0u64;
        let mut penalty_shares_to_mint = 0u64;
        let is_early_cancel;

        if !ttl_expired {
            // Early cancellation: fees go to accountant, user gets shares after fee back
            is_early_cancel = true;
            shares_to_transfer_to_user = shares_after_fee;
            fee_shares_to_accountant = fee_shares;
        } else {
            // TTL expired - either user or bot cancellation: user gets full refund including fees
            is_early_cancel = false;
            shares_to_transfer_to_user = shares_after_fee + fee_shares; // Return fees to user

            // Calculate system penalty as additional shares minted to user for the delay
            penalty_shares_to_mint =
                apply_basis_points(shares_after_fee, read_system_penalty_bps(&env))
                    .map_err(|_| STokenWithdrawalRequestError::MathOverflow)?;
        }

        if shares_to_transfer_to_user == 0 {
            return Err(STokenWithdrawalRequestError::InvalidWithdrawalRequest);
        }

        let vault_address = env.current_contract_address();

        // Transfer shares after fee back to user from vault custody
        Vault::transfer(
            &env,
            &vault_address,
            &withdrawal_request.user,
            shares_to_transfer_to_user as i128,
        );

        // Mint additional penalty shares for late cancellation (only if TTL expired)
        if penalty_shares_to_mint > 0 {
            Base::mint(
                &env,
                &withdrawal_request.user,
                penalty_shares_to_mint as i128,
            );
        }

        // Handle fee shares transfer from vault custody
        if fee_shares_to_accountant > 0 {
            // Transfer fees to accountant (early cancellation)
            Vault::transfer(
                &env,
                &vault_address,
                &read_accountant(&env),
                fee_shares_to_accountant as i128,
            );
        }

        // Update vault state
        write_total_withdrawals_pending(
            &env,
            &read_total_withdrawals_pending(&env)
                .checked_sub(withdrawal_request.amount_due)
                .ok_or(STokenWithdrawalRequestError::MathOverflow)?,
        );

        // Update shares in custody - decrement by the original shares amount that was in custody
        let total_shares_returned = withdrawal_request.shares + withdrawal_request.fee_shares;
        write_shares_in_custody(
            &env,
            &read_shares_in_custody(&env)
                .checked_sub(total_shares_returned)
                .ok_or(STokenWithdrawalRequestError::MathOverflow)?,
        );

        // Update total shares - only penalty shares are minted (affecting total supply)
        // The shares after fee were just transferred back from custody (no supply change)
        if penalty_shares_to_mint > 0 {
            write_total_shares(
                &env,
                &read_total_shares(&env)
                    .checked_add(penalty_shares_to_mint)
                    .ok_or(STokenWithdrawalRequestError::MathOverflow)?,
            );
        }

        // Update withdrawal request state
        write_withdraw_request(&env, &request_id, &withdrawal_request);

        // Emit enhanced event
        let topics = (
            Symbol::new(&env, "stoken_withdrawal_cancelled"),
            vault_address,
            caller,
            request_id,
        );
        env.events().publish(
            topics,
            (
                shares_to_transfer_to_user
                    .checked_add(penalty_shares_to_mint)
                    .unwrap_or(shares_to_transfer_to_user),
                fee_shares_to_accountant,
                is_early_cancel,
                penalty_shares_to_mint,
                timestamp,
            ),
        );

        Ok(())
    }

    /// Withdraw unexpected deposits immediately
    pub fn withdraw_unexpected_deposits(
        env: Env,
        token_mint: Address,
        amount: u64,
    ) -> Result<(), STokenCoreError> {
        if amount == 0 {
            return Err(STokenCoreError::InvalidAmount);
        }

        let manager = read_manager(&env);
        let total_idle = read_total_idle(&env);
        let shares_in_custody = read_shares_in_custody(&env);

        manager.require_auth();

        let vault_address = env.current_contract_address();
        let underlying_token = Vault::query_asset(&env);

        // Calculate available unexpected deposits based on token type
        let available_unexpected = if token_mint == underlying_token {
            // For underlying asset: vault balance - total_idle (if positive)
            let vault_balance = Client::new(&env, &underlying_token).balance(&vault_address) as u64;
            if vault_balance > total_idle {
                vault_balance
                    .checked_sub(total_idle)
                    .ok_or(STokenCoreError::MathOverflow)?
            } else {
                0
            }
        } else if token_mint == vault_address {
            // For shares: vault balance - shares_in_custody (if positive)
            let vault_balance = Vault::balance(&env, &vault_address) as u64;
            if vault_balance > shares_in_custody {
                vault_balance
                    .checked_sub(shares_in_custody)
                    .ok_or(STokenCoreError::MathOverflow)?
            } else {
                0
            }
        } else {
            // For other assets: full vault token balance is unexpected
            Client::new(&env, &token_mint).balance(&vault_address) as u64
        };

        if available_unexpected < amount {
            return Err(STokenCoreError::InsufficientBalance);
        }

        // Transfer unexpected deposits to manager
        Client::new(&env, &token_mint).transfer(&vault_address, &manager, &(amount as i128));

        // Emit event
        let topics = (
            Symbol::new(&env, "stoken_unexpected_deposits_withdrawn"),
            vault_address,
            token_mint,
        );
        env.events()
            .publish(topics, (manager, amount, env.ledger().timestamp()));

        Ok(())
    }

    /// Pause the vault (emergency mode)
    pub fn pause_vault(env: Env) -> Result<(), STokenEmergencyWithdrawalError> {
        let manager = read_manager(&env);
        manager.require_auth();

        if read_paused(&env) {
            return Err(STokenEmergencyWithdrawalError::VaultPaused);
        }

        write_paused(&env, &true);

        // Emit pause event
        let topics = (
            Symbol::new(&env, "stoken_vault_paused"),
            env.current_contract_address(),
        );
        env.events()
            .publish(topics, (manager, env.ledger().timestamp()));

        Ok(())
    }

    /// Unpause the vault
    pub fn unpause_vault(env: Env) -> Result<(), STokenEmergencyWithdrawalError> {
        let manager = read_manager(&env);
        manager.require_auth();

        if !read_paused(&env) {
            return Err(STokenEmergencyWithdrawalError::VaultNotPaused);
        }

        write_paused(&env, &false);
        // Reset emergency withdrawal timelock when unpausing
        write_emergency_withdraw_timelock_end(&env, &0);

        // Emit unpause event
        let topics = (
            Symbol::new(&env, "stoken_vault_unpaused"),
            env.current_contract_address(),
        );
        env.events()
            .publish(topics, (manager, env.ledger().timestamp()));

        Ok(())
    }

    /// Emergency withdrawal when vault is paused
    pub fn emergency_withdraw(
        env: Env,
        token_mint: Address, // The token mint to withdraw (can be any token)
        amount: u64,
    ) -> Result<(), STokenEmergencyWithdrawalError> {
        if amount == 0 {
            return Err(STokenEmergencyWithdrawalError::InvalidAmount);
        }

        let manager = read_manager(&env);
        let paused = read_paused(&env);
        let emergency_withdrawal_timelock_end = read_emergency_withdraw_timelock_end(&env);
        let emergency_withdrawal_cooldown_secs = read_emergency_withdrawal_cooldown(&env);

        manager.require_auth();

        let timestamp = env.ledger().timestamp();

        if !paused {
            return Err(STokenEmergencyWithdrawalError::VaultNotPaused);
        }

        // Check if this is the first emergency withdrawal request for this pause
        if emergency_withdrawal_timelock_end == 0 {
            // Store the emergency withdrawal request details
            write_emergency_withdraw_timelock_end(
                &env,
                &(timestamp + emergency_withdrawal_cooldown_secs),
            );
            write_emergency_withdraw_token_mint(&env, Some(token_mint.clone()));
            write_emergency_withdrawal_amount(&env, &amount);

            // Emit timelock activation event
            let topics = (
                Symbol::new(&env, "stoken_emergency_withdraw_timelock_activated"),
                env.current_contract_address(),
                manager,
                token_mint,
            );
            env.events().publish(
                topics,
                (
                    amount,
                    read_emergency_withdraw_timelock_end(&env),
                    read_emergency_withdrawal_cooldown(&env),
                    timestamp,
                ),
            );

            return Ok(()); // SUCCESS - timelock and request are now set
        }

        // Check if timelock has expired
        if timestamp < read_emergency_withdraw_timelock_end(&env) {
            return Err(STokenEmergencyWithdrawalError::EmergencyWithdrawalTimelockActive);
        }

        // Validate that this withdrawal matches the original request
        if read_emergency_withdraw_token_mint(&env) != Some(token_mint.clone()) {
            return Err(STokenEmergencyWithdrawalError::InvalidTokenAccountMint);
        }

        if read_emergency_withdrawal_amount(&env) != amount {
            return Err(STokenEmergencyWithdrawalError::InvalidAmount);
        }

        let vault_address = env.current_contract_address();

        let token = Client::new(&env, &token_mint);

        // Check vault has sufficient token balance
        let vault_balance = token.balance(&vault_address) as u64;
        if vault_balance < amount {
            return Err(STokenEmergencyWithdrawalError::InsufficientBalance);
        }

        // Transfer tokens from vault to manager
        token.transfer(&vault_address, &manager, &(amount as i128));

        // Clear the emergency withdrawal request after successful completion
        write_emergency_withdraw_token_mint(&env, None);
        write_emergency_withdrawal_amount(&env, &0);
        write_emergency_withdraw_timelock_end(&env, &0);

        // Emit withdrawal event
        let topics = (
            Symbol::new(&env, "stoken_emergency_withdraw"),
            vault_address,
            token_mint,
        );
        env.events().publish(topics, (manager, amount, timestamp));

        Ok(())
    }

    /// Add a user to the vault whitelist
    pub fn add_user_to_whitelist(env: Env, user_to_add: Address) -> Result<(), STokenCoreError> {
        let manager = read_manager(&env);
        let is_whitelisted = read_is_whitelisted(&env, &user_to_add);

        // Validate manager authority
        manager.require_auth();

        if !read_whitelist_enabled(&env) {
            return Err(STokenCoreError::WhitelistNotEnabled);
        }

        if is_whitelisted {
            return Err(STokenCoreError::UserAlreadyWhitelisted);
        }

        write_is_whitelisted(&env, &user_to_add, &true);

        // Emit whitelist event
        let topics = (
            Symbol::new(&env, "stoken_user_whitelisted"),
            env.current_contract_address(),
            user_to_add,
        );
        env.events()
            .publish(topics, (manager, env.ledger().timestamp()));

        Ok(())
    }

    /// Propose whitelist toggle (starts cooldown period)
    pub fn propose_whitelist(env: Env, enabled: bool) -> Result<(), STokenWhitelistChangeError> {
        let manager = read_manager(&env);

        // Validate manager authority
        manager.require_auth();

        // Ensure no pending whitelist change
        if read_pending_whitelist(&env).is_some() {
            return Err(STokenWhitelistChangeError::WhitelistChangeTimelockActive);
        }

        // Ensure the setting is different from current value
        if read_whitelist_enabled(&env) == enabled {
            return Err(STokenWhitelistChangeError::NoWhitelistChanges);
        }

        let timestamp = env.ledger().timestamp();

        // Create pending whitelist change and start the timelock
        write_pending_whitelist(
            &env,
            Some(PendingWhitelist {
                new_enabled: enabled,
                timestamp: timestamp,
            }),
        );

        let effective_time = timestamp + read_config_cooldown_secs(&env);

        // Emit pending whitelist change event
        let topics = (
            Symbol::new(&env, "stoken_whitelist_change_pending"),
            env.current_contract_address(),
            manager.clone(),
            enabled,
        );
        env.events().publish(topics, (effective_time, timestamp));

        Ok(())
    }

    /// Accept pending whitelist changes after cooldown
    pub fn accept_whitelist(env: Env) -> Result<(), STokenWhitelistChangeError> {
        let manager = read_manager(&env);

        // Validate manager authority
        manager.require_auth();

        // Ensure there is a pending whitelist change
        if read_pending_whitelist(&env).is_none() {
            return Err(STokenWhitelistChangeError::NoPendingWhitelistChange);
        }

        let pending = read_pending_whitelist(&env).unwrap();
        let timestamp = env.ledger().timestamp();

        // Check if the cooldown period has expired
        let cooldown_expired = timestamp >= pending.timestamp + read_config_cooldown_secs(&env);

        if !cooldown_expired {
            return Err(STokenWhitelistChangeError::WhitelistChangeTimelockActive);
        }

        // Apply pending whitelist change
        write_whitelist_enabled(&env, &pending.new_enabled);

        // Clear pending whitelist
        write_pending_whitelist(&env, None);

        // Emit whitelist change event
        let topics = (
            Symbol::new(&env, "stoken_whitelist_toggled"),
            env.current_contract_address(),
            manager,
            pending.new_enabled,
        );
        env.events().publish(topics, timestamp);

        Ok(())
    }

    /// Remove a user from the vault whitelist
    pub fn remove_user_from_whitelist(
        env: Env,
        user_to_remove: Address,
    ) -> Result<(), STokenCoreError> {
        let manager = read_manager(&env);
        let is_whitelisted = read_is_whitelisted(&env, &user_to_remove);

        // Validate manager authority
        manager.require_auth();

        if !read_whitelist_enabled(&env) {
            return Err(STokenCoreError::WhitelistNotEnabled);
        }

        if !is_whitelisted {
            return Err(STokenCoreError::UserNotWhitelisted);
        }

        write_is_whitelisted(&env, &user_to_remove, &false);

        // Emit remove from whitelist event
        let topics = (
            Symbol::new(&env, "stoken_user_removed_from_whitelist"),
            env.current_contract_address(),
            user_to_remove,
        );
        env.events()
            .publish(topics, (manager, env.ledger().timestamp()));

        Ok(())
    }

    /// Swap tokens between two s-token vaults with the same underlying token and asset manager
    pub fn swap_tokens(
        env: Env,
        caller: Address,
        destination_vault: Address,
        source_amount: u64,
        swap_fee_bps: u32,
        min_destination_amount: u64,
    ) -> Result<(), STokenSwapError> {
        caller.require_auth();

        let source_vault = env.current_contract_address();

        // Basic validation using references
        if source_vault == destination_vault {
            return Err(STokenSwapError::InvalidSwapSameVault);
        }

        if swap_fee_bps > MAX_FEE_BPS {
            return Err(STokenSwapError::InvalidSwapFee);
        }

        let desitnation_vault_client = VaultInterfaceClient::new(&env, &destination_vault);

        // Verify both vaults use the same underlying token
        let source_underlying_mint = Vault::query_asset(&env);
        let destination_underlying_mint = desitnation_vault_client.query_asset();

        if source_underlying_mint != destination_underlying_mint {
            return Err(STokenSwapError::UnderlyingMintMismatch);
        }

        // Check that neither vault is paused
        let source_paused = read_paused(&env);
        let destination_paused = desitnation_vault_client.is_paused();
        if source_paused || destination_paused {
            return Err(STokenSwapError::VaultPaused);
        }

        // Calculate values once for entire swap operation
        let source_price = read_price(&env);
        let dest_price = desitnation_vault_client.price();

        // Calculate underlying value and fee
        let underlying_value = mul_div_u64_to_u64(
            source_amount,
            source_price,
            crate::constants::PRICE_PRECISION,
        )
        .map_err(|_| STokenSwapError::MathOverflow)?;
        let fee_amount = apply_basis_points(underlying_value, swap_fee_bps)
            .map_err(|_| STokenSwapError::MathOverflow)?;
        let underlying_value_after_fee = underlying_value
            .checked_sub(fee_amount)
            .ok_or(STokenSwapError::MathOverflow)?;

        // Calculate destination amount
        let destination_amount_to_mint = mul_div_u64_to_u64(
            underlying_value_after_fee,
            crate::constants::PRICE_PRECISION,
            dest_price,
        )
        .map_err(|_| STokenSwapError::MathOverflow)?;

        // Calculate fee tokens split once for entire instruction
        let (source_fee_tokens, dest_fee_tokens) =
            calculate_split_fee_tokens(fee_amount, source_price, dest_price)
                .map_err(|_| STokenSwapError::MathOverflow)?;

        // Ensure both vaults have the same asset manager
        let source_asset_manager = read_asset_manager(&env);
        let destination_asset_manager = desitnation_vault_client.asset_manager();
        if source_asset_manager != destination_asset_manager {
            return Err(STokenSwapError::AssetManagerMismatch);
        }

        // Validate that source and destination vaults have the same decimal count
        let source_underlying_decimals = Vault::decimals(&env);
        let destination_underlying_decimals = desitnation_vault_client.decimals();
        if source_underlying_decimals != destination_underlying_decimals {
            return Err(STokenSwapError::TokenDecimalMismatch);
        }

        // Check whitelist requirements
        let source_whitelist_enabled = read_whitelist_enabled(&env);
        let destination_whitelist_enabled = desitnation_vault_client.whitelist_enabled();
        if source_whitelist_enabled {
            // Check if caller is whitelisted in source vault
            let is_whitelisted = read_is_whitelisted(&env, &caller);
            if !is_whitelisted {
                return Err(STokenSwapError::UserNotWhitelisted);
            }
        }
        if destination_whitelist_enabled {
            // Check if caller is whitelisted in destination vault
            let is_whitelisted = desitnation_vault_client.is_whitelisted(&caller);
            if !is_whitelisted {
                return Err(STokenSwapError::UserNotWhitelisted);
            }
        }

        // Validate slippage protection using pre-calculated destination amount
        if destination_amount_to_mint < min_destination_amount {
            return Err(STokenSwapError::SlippageNotMet);
        }

        // Validate minimum remaining balance requirement
        // Only check if vault has a minimum shares requirement
        let soruce_vault_min_shares_to_mint = read_min_shares_to_mint(&env);
        if soruce_vault_min_shares_to_mint > 0 {
            // Check user's current balance in source account
            let user_amount = Vault::balance(&env, &caller);

            let remaining_balance = (user_amount as u64)
                .checked_sub(source_amount)
                .ok_or(STokenSwapError::MathOverflow)?;

            // If user will have remaining balance, it must meet minimum requirement
            if remaining_balance > 0 {
                if remaining_balance < soruce_vault_min_shares_to_mint {
                    return Err(STokenSwapError::MinimumSharesNotMet);
                }
            }
        }

        // Validate minimum destination balance requirement
        // Only check if vault has a minimum shares requirement
        let destination_vault_min_shares_to_mint = desitnation_vault_client.min_shares_to_mint();
        if destination_vault_min_shares_to_mint > 0 {
            // Check user's current balance in destination account
            let user_amount = desitnation_vault_client.balance(&caller);

            let final_balance = (user_amount as u64)
                .checked_add(destination_amount_to_mint)
                .ok_or(STokenSwapError::MathOverflow)?;

            // If user will have final balance, it must meet minimum requirement
            if final_balance > 0 {
                if final_balance < destination_vault_min_shares_to_mint {
                    return Err(STokenSwapError::MinimumSharesNotMet);
                }
            }
        }

        // Execute swap operations
        // Burn source tokens
        Base::burn(&env, &caller, source_amount as i128);

        // Mint destination tokens
        desitnation_vault_client.mint_core(&source_vault, &caller, &destination_amount_to_mint);

        // Mint fee tokens to source accountant if applicable
        if source_fee_tokens > 0 {
            Base::mint(&env, &read_accountant(&env), source_fee_tokens as i128);
        }

        // Mint fee tokens to destination accountant if applicable
        if dest_fee_tokens > 0 {
            let dest_accountant = desitnation_vault_client.accountant();
            desitnation_vault_client.mint_core(&source_vault, &dest_accountant, &dest_fee_tokens);
        }

        // Total fee shares for event (maintaining backward compatibility)
        let total_fee_shares = source_fee_tokens
            .checked_add(dest_fee_tokens)
            .ok_or(STokenSwapError::MathOverflow)?;

        // Emit event
        let topics = (
            Symbol::new(&env, "stoken_swap"),
            source_vault.clone(),
            destination_vault,
            caller,
        );
        env.events().publish(
            topics,
            (
                source_amount,
                destination_amount_to_mint,
                source_price,
                dest_price,
                underlying_value_after_fee,
                swap_fee_bps,
                fee_amount,
                total_fee_shares,
                env.ledger().timestamp(),
            ),
        );

        // Update source vault total_shares: subtract burned tokens, add source fee tokens
        write_total_shares(
            &env,
            &read_total_shares(&env)
                .checked_sub(source_amount)
                .and_then(|v| v.checked_add(source_fee_tokens))
                .ok_or(STokenSwapError::MathOverflow)?,
        );

        // Update destination vault total_shares: add minted tokens and destination fee tokens
        let dest_total_shares = desitnation_vault_client.total_shares();
        let new_dest_total_shares = dest_total_shares
            .checked_add(destination_amount_to_mint)
            .and_then(|v| v.checked_add(dest_fee_tokens))
            .ok_or(STokenSwapError::MathOverflow)?;

        desitnation_vault_client.write_vault_total_shares(&source_vault, &new_dest_total_shares);

        Ok(())
    }

    /// Propose cooldown parameter changes (starts cooldown period)
    pub fn propose_cooldowns(
        env: Env,
        new_price_update_cooldown_secs: Option<u64>,
        new_price_acceptance_cooldown: Option<u64>,
        new_config_cooldown_secs: Option<u64>,
        new_emergency_withdraw_cldwn: Option<u64>,
        new_role_change_cooldown_secs: Option<u64>,
        new_fee_change_cooldown_secs: Option<u64>,
    ) -> Result<(), STokenCooldownChangeError> {
        let manager = read_manager(&env);

        // Validate manager authority
        manager.require_auth();

        // Validate that cooldown updates are allowed (no other pending changes)
        let can_update_cooldowns = if read_pending_fees(&env).is_none()
            && read_pending_limits(&env).is_none()
            && read_pending_whitelist(&env).is_none()
            && read_pending_roles(&env).is_none()
        {
            true
        } else {
            false
        };

        if !can_update_cooldowns {
            return Err(STokenCooldownChangeError::CooldownChangeTimelockActive);
        }

        // Ensure no pending cooldown change exists
        if read_pending_cooldowns(&env).is_some() {
            return Err(STokenCooldownChangeError::CooldownChangeTimelockActive);
        }

        // Validate cooldown values (minimum 1 second, maximum 1 year)
        if let Some(cooldown) = new_price_update_cooldown_secs {
            if cooldown < MIN_COOLDOWN_SECS || cooldown > MAX_COOLDOWN_SECS {
                return Err(STokenCooldownChangeError::InvalidCooldownDuration);
            }
        }
        if let Some(cooldown) = new_price_acceptance_cooldown {
            if cooldown < MIN_COOLDOWN_SECS || cooldown > MAX_COOLDOWN_SECS {
                return Err(STokenCooldownChangeError::InvalidCooldownDuration);
            }
        }
        if let Some(cooldown) = new_config_cooldown_secs {
            if cooldown < MIN_COOLDOWN_SECS || cooldown > MAX_COOLDOWN_SECS {
                return Err(STokenCooldownChangeError::InvalidCooldownDuration);
            }
        }
        if let Some(cooldown) = new_emergency_withdraw_cldwn {
            if cooldown < MIN_COOLDOWN_SECS || cooldown > MAX_COOLDOWN_SECS {
                return Err(STokenCooldownChangeError::InvalidCooldownDuration);
            }
        }
        if let Some(cooldown) = new_role_change_cooldown_secs {
            if cooldown < MIN_COOLDOWN_SECS || cooldown > MAX_COOLDOWN_SECS {
                return Err(STokenCooldownChangeError::InvalidCooldownDuration);
            }
        }
        if let Some(cooldown) = new_fee_change_cooldown_secs {
            if cooldown < MIN_COOLDOWN_SECS || cooldown > MAX_COOLDOWN_SECS {
                return Err(STokenCooldownChangeError::InvalidCooldownDuration);
            }
        }

        // Ensure at least one cooldown is different from current values
        if new_price_update_cooldown_secs == Some(read_price_update_cooldown_secs(&env))
            && new_price_acceptance_cooldown == Some(read_price_acceptance_cooldown_secs(&env))
            && new_config_cooldown_secs == Some(read_config_cooldown_secs(&env))
            && new_emergency_withdraw_cldwn == Some(read_emergency_withdrawal_cooldown(&env))
            && new_role_change_cooldown_secs == Some(read_role_change_cooldown_secs(&env))
            && new_fee_change_cooldown_secs == Some(read_fee_change_cooldown_secs(&env))
        {
            return Err(STokenCooldownChangeError::NoCooldownChanges);
        }

        let timestamp = env.ledger().timestamp();

        // Create pending cooldown changes and start the timelock
        write_pending_cooldowns(
            &env,
            Some(PendingCooldowns {
                new_price_update_cooldown_secs,
                new_price_acceptance_cldwn_s: new_price_acceptance_cooldown,
                new_config_cooldown_secs,
                new_emergency_withdraw_cldwn_s: new_emergency_withdraw_cldwn,
                new_role_change_cooldown_secs,
                new_fee_change_cooldown_secs,
                timestamp: timestamp,
            }),
        );

        let effective_time = timestamp + read_config_cooldown_secs(&env);

        // Emit pending cooldown changes event
        let topics = (
            Symbol::new(&env, "stoken_cooldowns_change_pending"),
            env.current_contract_address(),
        );
        env.events().publish(
            topics,
            (
                manager,
                new_price_update_cooldown_secs.unwrap(),
                new_price_acceptance_cooldown.unwrap(),
                new_config_cooldown_secs.unwrap(),
                new_emergency_withdraw_cldwn.unwrap(),
                new_role_change_cooldown_secs.unwrap(),
                new_fee_change_cooldown_secs.unwrap(),
                effective_time,
                timestamp,
            ),
        );

        Ok(())
    }

    /// Accept pending cooldown changes after cooldown
    pub fn accept_cooldowns(env: Env) -> Result<(), STokenCooldownChangeError> {
        let manager = read_manager(&env);

        // Validate manager authority
        manager.require_auth();

        let pending_cooldowns = read_pending_cooldowns(&env);

        // Ensure there is a pending cooldown change
        if pending_cooldowns.is_none() {
            return Err(STokenCooldownChangeError::NoPendingCooldownChange);
        }

        let pending = pending_cooldowns.unwrap();
        let timestamp = env.ledger().timestamp();

        // Check if the cooldown period has expired
        let cooldown_expired = timestamp >= pending.timestamp + read_config_cooldown_secs(&env);
        if !cooldown_expired {
            return Err(STokenCooldownChangeError::CooldownChangeTimelockActive);
        }

        // Apply pending cooldown changes
        if let Some(new_cooldown) = pending.new_price_update_cooldown_secs {
            write_price_update_cooldown_secs(&env, &new_cooldown);
        }
        if let Some(new_cooldown) = pending.new_price_acceptance_cldwn_s {
            write_price_acceptance_cooldown_secs(&env, &new_cooldown);
        }
        if let Some(new_cooldown) = pending.new_config_cooldown_secs {
            write_config_cooldown_secs(&env, &new_cooldown);
        }
        if let Some(new_cooldown) = pending.new_emergency_withdraw_cldwn_s {
            write_emergency_withdrawal_cooldown(&env, &new_cooldown);
        }
        if let Some(new_cooldown) = pending.new_role_change_cooldown_secs {
            write_role_change_cooldown_secs(&env, &new_cooldown);
        }
        if let Some(new_cooldown) = pending.new_fee_change_cooldown_secs {
            write_fee_change_cooldown_secs(&env, &new_cooldown);
        }

        // Clear pending cooldowns
        write_pending_cooldowns(&env, None);

        // Emit cooldowns updated event
        let topics = (
            Symbol::new(&env, "stoken_cooldowns_updated"),
            env.current_contract_address(),
        );
        env.events().publish(
            topics,
            (
                manager,
                read_price_update_cooldown_secs(&env),
                read_price_acceptance_cooldown_secs(&env),
                read_config_cooldown_secs(&env),
                read_emergency_withdrawal_cooldown(&env),
                read_role_change_cooldown_secs(&env),
                read_fee_change_cooldown_secs(&env),
                timestamp,
            ),
        );

        Ok(())
    }

    /// Accept allowlist mint - this should be the address of the vault that is being swapped to
    pub fn accept_allowlist_mint(env: Env, mint: Address) -> Result<(), STokenAllowlistMintError> {
        let manager = read_manager(&env);

        // Validate manager authority
        manager.require_auth();

        let vault_client = VaultInterfaceClient::new(&env, &mint);
        let asset_manager = vault_client.asset_manager();
        if asset_manager != read_asset_manager(&env) {
            return Err(STokenAllowlistMintError::AssetManagerMismatch);
        }

        write_allowlist_mint(&env, &mint, &true);

        let topics = (
            Symbol::new(&env, "stoken_allowlist_mint_accepted"),
            env.current_contract_address(),
        );
        env.events().publish(topics, (manager, mint));

        Ok(())
    }

    pub fn cancel_allowlist_mint(env: Env, mint: Address) -> Result<(), STokenAllowlistMintError> {
        let manager = read_manager(&env);
        manager.require_auth();

        let allowlist_mint = read_allowlist_mint(&env, &mint);
        if !allowlist_mint {
            return Err(STokenAllowlistMintError::NotInAllowlist);
        }

        write_allowlist_mint(&env, &mint, &false);

        let topics = (
            Symbol::new(&env, "stoken_allowlist_mint_canceled"),
            env.current_contract_address(),
        );
        env.events().publish(topics, (manager, mint));

        Ok(())
    }

    pub fn write_vault_total_shares(
        env: Env,
        mint: Address,
        shares: u64,
    ) -> Result<(), STokenAllowlistMintError> {
        let allowlist_mint = read_allowlist_mint(&env, &mint);
        if !allowlist_mint {
            return Err(STokenAllowlistMintError::NotInAllowlist);
        }

        // Vault not paused
        let paused = read_paused(&env);
        if paused {
            return Err(STokenAllowlistMintError::VaultPaused);
        }

        // Update total shares
        write_total_shares(&env, &shares);

        // Emit event
        let topics = (
            Symbol::new(&env, "stoken_vault_total_shares_updated"),
            env.current_contract_address(),
        );
        env.events().publish(topics, (mint, shares));

        Ok(())
    }

    pub fn total_shares(env: &Env) -> u64 {
        read_total_shares(env)
    }

    pub fn is_paused(env: &Env) -> bool {
        read_paused(env)
    }

    pub fn price(env: &Env) -> u64 {
        read_price(env)
    }

    pub fn asset_manager(env: &Env) -> Address {
        read_asset_manager(env)
    }

    pub fn accountant(env: &Env) -> Address {
        read_accountant(env)
    }

    pub fn whitelist_enabled(env: &Env) -> bool {
        read_whitelist_enabled(env)
    }

    pub fn is_whitelisted(env: &Env, caller: Address) -> bool {
        read_is_whitelisted(env, &caller)
    }

    pub fn min_shares_to_mint(env: &Env) -> u64 {
        read_min_shares_to_mint(env)
    }
}

#[default_impl]
#[contractimpl]
impl FungibleToken for SToken {
    type ContractType = Vault;

    fn total_supply(e: &Env) -> i128 {
        Self::ContractType::total_supply(e)
    }
}

//
// Extensions
//

#[contractimpl]
impl FungibleVault for SToken {
    fn query_asset(e: &Env) -> Address {
        Vault::query_asset(e)
    }

    fn total_assets(e: &Env) -> i128 {
        Vault::total_assets(e)
    }

    fn convert_to_shares(e: &Env, assets: i128) -> i128 {
        Vault::convert_to_shares(e, assets)
    }

    fn convert_to_assets(e: &Env, shares: i128) -> i128 {
        Vault::convert_to_assets(e, shares)
    }

    fn max_deposit(e: &Env, account: Address) -> i128 {
        Vault::max_deposit(e, account)
    }

    fn preview_deposit(e: &Env, assets: i128) -> i128 {
        Vault::preview_deposit(e, assets)
    }

    fn deposit(_e: &Env, _assets: i128, _caller: Address, _receiver: Address) -> i128 {
        -1
    }

    fn max_mint(e: &Env, account: Address) -> i128 {
        Vault::max_mint(e, account)
    }

    fn preview_mint(e: &Env, shares: i128) -> i128 {
        Vault::preview_mint(e, shares)
    }

    fn mint(_e: &Env, _shares: i128, _caller: Address, _receiver: Address) -> i128 {
        -1
    }

    fn max_withdraw(e: &Env, account: Address) -> i128 {
        Vault::max_withdraw(e, account)
    }

    fn preview_withdraw(e: &Env, assets: i128) -> i128 {
        Vault::preview_withdraw(e, assets)
    }

    fn withdraw(e: &Env, assets: i128, caller: Address, receiver: Address, owner: Address) -> i128 {
        Vault::withdraw(e, assets, caller, receiver, owner)
    }

    fn max_redeem(e: &Env, account: Address) -> i128 {
        Vault::max_redeem(e, account)
    }

    fn preview_redeem(e: &Env, shares: i128) -> i128 {
        Vault::preview_redeem(e, shares)
    }

    fn redeem(e: &Env, shares: i128, caller: Address, receiver: Address, owner: Address) -> i128 {
        Vault::redeem(e, shares, caller, receiver, owner)
    }
}
