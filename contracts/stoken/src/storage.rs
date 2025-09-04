use soroban_sdk::{Address, Env};

use crate::keys::{
    PendingCooldowns, PendingFees, PendingLimits, PendingPrice, PendingRoles, PendingWhitelist,
    StorageKey, WithdrawalRequest,
};

// Use Instance or Persistent storage

pub fn has_authority(e: &Env) -> bool {
    let key = StorageKey::Authority;
    e.storage().instance().has(&key)
}

pub fn read_authority(e: &Env) -> Address {
    let key = StorageKey::Authority;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_authority(e: &Env, address: &Address) {
    let key = StorageKey::Authority;
    e.storage().instance().set(&key, address);
}

pub fn read_oracle(e: &Env) -> Address {
    let key = StorageKey::Oracle;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_oracle(e: &Env, address: &Address) {
    let key = StorageKey::Oracle;
    e.storage().instance().set(&key, address);
}

pub fn read_manager(e: &Env) -> Address {
    let key = StorageKey::Manager;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_manager(e: &Env, address: &Address) {
    let key = StorageKey::Manager;
    e.storage().instance().set(&key, address);
}

pub fn read_processor(e: &Env) -> Address {
    let key = StorageKey::Processor;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_processor(e: &Env, address: &Address) {
    let key = StorageKey::Processor;
    e.storage().instance().set(&key, address);
}

pub fn read_accountant(e: &Env) -> Address {
    let key = StorageKey::Accountant;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_accountant(e: &Env, address: &Address) {
    let key = StorageKey::Accountant;
    e.storage().instance().set(&key, address);
}

pub fn read_asset_manager(e: &Env) -> Address {
    let key = StorageKey::AssetManager;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_asset_manager(e: &Env, address: &Address) {
    let key = StorageKey::AssetManager;
    e.storage().instance().set(&key, address);
}

pub fn read_deposit_fee_bps(e: &Env) -> u32 {
    let key = StorageKey::DepositFeeBps;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_deposit_fee_bps(e: &Env, bps: &u32) {
    let key = StorageKey::DepositFeeBps;
    e.storage().instance().set(&key, bps);
}

pub fn read_withdraw_fee_bps(e: &Env) -> u32 {
    let key = StorageKey::WithdrawFeeBps;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_withdraw_fee_bps(e: &Env, bps: &u32) {
    let key = StorageKey::WithdrawFeeBps;
    e.storage().instance().set(&key, bps);
}

pub fn read_management_fee_bps_per_year(e: &Env) -> u32 {
    let key = StorageKey::ManagementFeeBpsPerYear;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_management_fee_bps_per_year(e: &Env, bps: &u32) {
    let key = StorageKey::ManagementFeeBpsPerYear;
    e.storage().instance().set(&key, bps);
}

pub fn read_last_mgmt_fee_ts(e: &Env) -> u64 {
    let key = StorageKey::LastMgmtFeeTs;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_last_mgmt_fee_ts(e: &Env, ts: &u64) {
    let key = StorageKey::LastMgmtFeeTs;
    e.storage().instance().set(&key, ts);
}

pub fn read_price(e: &Env) -> u64 {
    let key = StorageKey::Price;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_price(e: &Env, price: &u64) {
    let key = StorageKey::Price;
    e.storage().instance().set(&key, price);
}

pub fn read_total_shares(e: &Env) -> u64 {
    let key = StorageKey::TotalShares;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_total_shares(e: &Env, shares: &u64) {
    let key = StorageKey::TotalShares;
    e.storage().instance().set(&key, shares);
}

pub fn read_total_idle(e: &Env) -> u64 {
    let key = StorageKey::TotalIdle;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_total_idle(e: &Env, idle: &u64) {
    let key = StorageKey::TotalIdle;
    e.storage().instance().set(&key, idle);
}

pub fn read_total_withdrawals_pending(e: &Env) -> u64 {
    let key = StorageKey::TotalWithdrawalsPending;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_total_withdrawals_pending(e: &Env, pending: &u64) {
    let key = StorageKey::TotalWithdrawalsPending;
    e.storage().instance().set(&key, pending);
}

pub fn read_shares_in_custody(e: &Env) -> u64 {
    let key = StorageKey::SharesInCustody;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_shares_in_custody(e: &Env, custody: &u64) {
    let key = StorageKey::SharesInCustody;
    e.storage().instance().set(&key, custody);
}

pub fn read_created_at(e: &Env) -> u64 {
    let key = StorageKey::CreatedAt;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_created_at(e: &Env, created_at: &u64) {
    let key = StorageKey::CreatedAt;
    e.storage().instance().set(&key, created_at);
}

pub fn read_max_total_shares(e: &Env) -> u64 {
    let key = StorageKey::MaxTotalShares;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_max_total_shares(e: &Env, max_total_shares: &u64) {
    let key = StorageKey::MaxTotalShares;
    e.storage().instance().set(&key, max_total_shares);
}

pub fn read_max_shares_per_user(e: &Env) -> u64 {
    let key = StorageKey::MaxSharesPerUser;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_max_shares_per_user(e: &Env, max_shares_per_user: &u64) {
    let key = StorageKey::MaxSharesPerUser;
    e.storage().instance().set(&key, max_shares_per_user);
}

pub fn read_max_total_idle(e: &Env) -> u64 {
    let key = StorageKey::MaxTotalIdle;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_max_total_idle(e: &Env, max_total_idle: &u64) {
    let key = StorageKey::MaxTotalIdle;
    e.storage().instance().set(&key, max_total_idle);
}

pub fn read_min_shares_to_mint(e: &Env) -> u64 {
    let key = StorageKey::MinSharesToMint;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_min_shares_to_mint(e: &Env, min_shares_to_mint: &u64) {
    let key = StorageKey::MinSharesToMint;
    e.storage().instance().set(&key, min_shares_to_mint);
}

pub fn read_max_deviation_bps(e: &Env) -> u32 {
    let key = StorageKey::MaxDeviationBps;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_max_deviation_bps(e: &Env, max_deviation_bps: &u32) {
    let key = StorageKey::MaxDeviationBps;
    e.storage().instance().set(&key, max_deviation_bps);
}

pub fn read_last_price_update_timestamp(e: &Env) -> u64 {
    let key = StorageKey::LastPriceUpdateTimestamp;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_last_price_update_timestamp(e: &Env, last_price_update_timestamp: &u64) {
    let key = StorageKey::LastPriceUpdateTimestamp;
    e.storage()
        .instance()
        .set(&key, last_price_update_timestamp);
}

pub fn read_next_withdrawal_id(e: &Env) -> u64 {
    let key = StorageKey::NextWithdrawalId;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_next_withdrawal_id(e: &Env, next_withdrawal_id: &u64) {
    let key = StorageKey::NextWithdrawalId;
    e.storage().instance().set(&key, next_withdrawal_id);
}

pub fn read_price_update_cooldown_secs(e: &Env) -> u64 {
    let key = StorageKey::PriceUpdateCooldownSecs;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_price_update_cooldown_secs(e: &Env, price_update_cooldown_secs: &u64) {
    let key = StorageKey::PriceUpdateCooldownSecs;
    e.storage().instance().set(&key, price_update_cooldown_secs);
}

pub fn read_price_acceptance_cooldown_secs(e: &Env) -> u64 {
    let key = StorageKey::PriceAcceptanceCooldownSecs;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_price_acceptance_cooldown_secs(e: &Env, price_acceptance_cooldown_secs: &u64) {
    let key = StorageKey::PriceAcceptanceCooldownSecs;
    e.storage()
        .instance()
        .set(&key, price_acceptance_cooldown_secs);
}

pub fn read_downside_cap_bps(e: &Env) -> u32 {
    let key = StorageKey::DownsideCapBps;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_downside_cap_bps(e: &Env, downside_cap_bps: &u32) {
    let key = StorageKey::DownsideCapBps;
    e.storage().instance().set(&key, downside_cap_bps);
}

pub fn read_withdrawal_ttl_secs(e: &Env) -> u64 {
    let key = StorageKey::WithdrawalTtlSecs;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_withdrawal_ttl_secs(e: &Env, withdrawal_ttl_secs: &u64) {
    let key = StorageKey::WithdrawalTtlSecs;
    e.storage().instance().set(&key, withdrawal_ttl_secs);
}

pub fn read_early_cancel_fee_bps(e: &Env) -> u32 {
    let key = StorageKey::EarlyCancelFeeBps;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_early_cancel_fee_bps(e: &Env, early_cancel_fee_bps: &u32) {
    let key = StorageKey::EarlyCancelFeeBps;
    e.storage().instance().set(&key, early_cancel_fee_bps);
}

pub fn read_system_penalty_bps(e: &Env) -> u32 {
    let key = StorageKey::SystemPenaltyBps;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_system_penalty_bps(e: &Env, system_penalty_bps: &u32) {
    let key = StorageKey::SystemPenaltyBps;
    e.storage().instance().set(&key, system_penalty_bps);
}

pub fn read_whitelist_enabled(e: &Env) -> bool {
    let key = StorageKey::WhitelistEnabled;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_whitelist_enabled(e: &Env, whitelist_enabled: &bool) {
    let key = StorageKey::WhitelistEnabled;
    e.storage().instance().set(&key, whitelist_enabled);
}

pub fn read_paused(e: &Env) -> bool {
    let key = StorageKey::Paused;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_paused(e: &Env, paused: &bool) {
    let key = StorageKey::Paused;
    e.storage().instance().set(&key, paused);
}

pub fn read_role_change_cooldown_secs(e: &Env) -> u64 {
    let key = StorageKey::RoleChangeCooldownSecs;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_role_change_cooldown_secs(e: &Env, role_change_cooldown_secs: &u64) {
    let key = StorageKey::RoleChangeCooldownSecs;
    e.storage().instance().set(&key, role_change_cooldown_secs);
}

pub fn read_config_cooldown_secs(e: &Env) -> u64 {
    let key = StorageKey::ConfigCooldownSecs;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_config_cooldown_secs(e: &Env, config_cooldown_secs: &u64) {
    let key = StorageKey::ConfigCooldownSecs;
    e.storage().instance().set(&key, config_cooldown_secs);
}

pub fn read_fee_change_cooldown_secs(e: &Env) -> u64 {
    let key = StorageKey::FeeChangeCooldownSecs;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_fee_change_cooldown_secs(e: &Env, fee_change_cooldown_secs: &u64) {
    let key = StorageKey::FeeChangeCooldownSecs;
    e.storage().instance().set(&key, fee_change_cooldown_secs);
}

pub fn read_pending_price(e: &Env) -> Option<PendingPrice> {
    let key = StorageKey::PendingPrice;
    e.storage().instance().get(&key).unwrap_or(None)
}

pub fn write_pending_price(e: &Env, pending_price: Option<PendingPrice>) {
    let key = StorageKey::PendingPrice;
    e.storage().instance().set(&key, &pending_price);
}

pub fn read_pending_roles(e: &Env) -> Option<PendingRoles> {
    let key = StorageKey::PendingRoles;
    e.storage().instance().get(&key).unwrap_or(None)
}

pub fn write_pending_roles(e: &Env, pending_roles: Option<PendingRoles>) {
    let key = StorageKey::PendingRoles;
    e.storage().instance().set(&key, &pending_roles);
}

pub fn read_pending_fees(e: &Env) -> Option<PendingFees> {
    let key = StorageKey::PendingFees;
    e.storage().instance().get(&key).unwrap_or(None)
}

pub fn write_pending_fees(e: &Env, pending_fees: Option<PendingFees>) {
    let key = StorageKey::PendingFees;
    e.storage().instance().set(&key, &pending_fees);
}

pub fn read_pending_limits(e: &Env) -> Option<PendingLimits> {
    let key = StorageKey::PendingLimits;
    e.storage().instance().get(&key).unwrap_or(None)
}

pub fn write_pending_limits(e: &Env, pending_limits: Option<PendingLimits>) {
    let key = StorageKey::PendingLimits;
    e.storage().instance().set(&key, &pending_limits);
}

pub fn read_pending_whitelist(e: &Env) -> Option<PendingWhitelist> {
    let key = StorageKey::PendingWhitelist;
    e.storage().instance().get(&key).unwrap_or(None)
}

pub fn write_pending_whitelist(e: &Env, pending_whitelist: Option<PendingWhitelist>) {
    let key = StorageKey::PendingWhitelist;
    e.storage().instance().set(&key, &pending_whitelist);
}

pub fn read_pending_cooldowns(e: &Env) -> Option<PendingCooldowns> {
    let key = StorageKey::PendingCooldowns;
    e.storage().instance().get(&key).unwrap_or(None)
}

pub fn write_pending_cooldowns(e: &Env, pending_cooldowns: Option<PendingCooldowns>) {
    let key = StorageKey::PendingCooldowns;
    e.storage().instance().set(&key, &pending_cooldowns);
}

pub fn read_emergency_withdraw_timelock_end(e: &Env) -> u64 {
    let key = StorageKey::EmergencyWithdrawTimelockEnd;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_emergency_withdraw_timelock_end(e: &Env, emergency_withdraw_timelock_end: &u64) {
    let key = StorageKey::EmergencyWithdrawTimelockEnd;
    e.storage()
        .instance()
        .set(&key, emergency_withdraw_timelock_end);
}

pub fn read_emergency_withdrawal_cooldown(e: &Env) -> u64 {
    let key = StorageKey::EmergencyWithdrawalCooldown;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_emergency_withdrawal_cooldown(e: &Env, emergency_withdrawal_cooldown: &u64) {
    let key = StorageKey::EmergencyWithdrawalCooldown;
    e.storage()
        .instance()
        .set(&key, emergency_withdrawal_cooldown);
}

pub fn read_emergency_withdraw_token_mint(e: &Env) -> Option<Address> {
    let key = StorageKey::EmergencyWithdrawTokenMint;
    e.storage().instance().get(&key).unwrap_or(None)
}

pub fn write_emergency_withdraw_token_mint(
    e: &Env,
    emergency_withdraw_token_mint: Option<Address>,
) {
    let key = StorageKey::EmergencyWithdrawTokenMint;
    e.storage()
        .instance()
        .set(&key, &emergency_withdraw_token_mint);
}

pub fn read_emergency_withdrawal_amount(e: &Env) -> u64 {
    let key = StorageKey::EmergencyWithdrawalAmount;
    e.storage().instance().get(&key).unwrap()
}

pub fn write_emergency_withdrawal_amount(e: &Env, emergency_withdrawal_amount: &u64) {
    let key = StorageKey::EmergencyWithdrawalAmount;
    e.storage()
        .instance()
        .set(&key, emergency_withdrawal_amount);
}

pub fn read_is_whitelisted(e: &Env, user: &Address) -> bool {
    let key = StorageKey::IsWhitelisted(user.clone());

    if let Some(is_whitelisted) = e.storage().instance().get::<_, bool>(&key) {
        is_whitelisted
    } else {
        false
    }
}

pub fn write_is_whitelisted(e: &Env, user: &Address, is_whitelisted: &bool) {
    let key = StorageKey::IsWhitelisted(user.clone());
    e.storage().instance().set(&key, is_whitelisted);
}

pub fn read_withdraw_request(e: &Env, request_id: &u64) -> Option<WithdrawalRequest> {
    let key = StorageKey::WithdrawRequest(request_id.clone());
    e.storage().instance().get(&key).unwrap_or(None)
}

pub fn write_withdraw_request(e: &Env, request_id: &u64, request: &WithdrawalRequest) {
    let key = StorageKey::WithdrawRequest(request_id.clone());
    e.storage().instance().set(&key, request);
}

pub fn read_allowlist_mint(e: &Env, mint: &Address) -> bool {
    let key = StorageKey::AllowlistMint(mint.clone());
    e.storage().instance().get(&key).unwrap_or(false)
}

pub fn write_allowlist_mint(e: &Env, mint: &Address, allowlist_mint: &bool) {
    let key = StorageKey::AllowlistMint(mint.clone());
    e.storage().instance().set(&key, allowlist_mint);
}

// Call extend_contract_ttl or extend_persistence_ttl

#[allow(dead_code)]
const DAY_IN_LEDGERS: u32 = 17280; // One day, assuming 5s per ledger: 24 * 60 * 60 / 5
#[allow(dead_code)]
const MAXIMUM_EXTEND_DAYS: u32 = 30; // One month
#[allow(dead_code)]
pub const EXTEND_TO_DAYS: u32 = MAXIMUM_EXTEND_DAYS * DAY_IN_LEDGERS; // Extend TTL to maximum 30 days
#[allow(dead_code)]
pub const BUMP_THRESHOLD: u32 = EXTEND_TO_DAYS - DAY_IN_LEDGERS; // One day threshold

#[allow(dead_code)]
pub fn extend_contract_ttl(env: &Env, threshold: u32, extend_to: u32) {
    env.storage().instance().extend_ttl(threshold, extend_to);
}

#[allow(dead_code)]
pub fn extend_persistence_ttl(env: &Env, key: StorageKey, threshold: u32, extend_to: u32) {
    env.storage()
        .persistent()
        .extend_ttl(&key, threshold, extend_to);
}

#[allow(dead_code)]
pub fn extend_persistence_all_ttl(_env: &Env, _threshold: u32, _extend_to: u32) {
    // call extend_persistence_ttl (above) with persistence keys one by one
    // currently no key is stored in persistence, only in instance
    // .. add more as needed
}
