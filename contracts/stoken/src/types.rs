use soroban_sdk::{contracttype, Address};

#[contracttype]
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct VaultInitConfig {
    pub authority: Address,
    pub underlying_mint: Address,
    pub oracle: Address,
    pub manager: Address,
    pub processor: Address,
    pub accountant: Address,
    pub asset_manager: Address,
    pub deposit_fee_bps: u32,
    pub withdraw_fee_bps: u32,
    pub management_fee_bps_per_year: u32,

    // Optional share and idle fund limits
    pub max_total_shares: Option<u64>,
    pub max_shares_per_user: Option<u64>,
    pub max_total_idle: Option<u64>,
    pub min_shares_to_mint: Option<u64>,

    // Secure Oracle Price Flow settings
    pub max_deviation_bps: Option<u32>,
    pub price_update_cooldown_secs: Option<u64>,
    pub price_acceptance_cooldown_secs: Option<u64>,

    // Configuration change cooldown
    pub config_cooldown_secs: Option<u64>,

    // Emergency withdrawal cooldown
    pub emergency_withdrawal_cooldown: Option<u64>,

    // Role change cooldown
    pub role_change_cooldown_secs: Option<u64>,

    // Fee change cooldown
    pub fee_change_cooldown_secs: Option<u64>,

    // Initial price setting
    pub initial_price: Option<u64>,

    // Whitelist enabled flag
    pub whitelist_enabled: Option<bool>,

    // New withdrawal lifecycle parameters
    pub downside_cap_bps: Option<u32>,
    pub withdrawal_ttl_secs: Option<u64>,
    pub early_cancel_fee_bps: Option<u32>,
    pub system_penalty_bps: Option<u32>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingPrice {
    pub value: Option<u64>,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingRoles {
    pub new_manager: Option<Address>,
    pub new_processor: Option<Address>,
    pub new_accountant: Option<Address>,
    pub new_oracle: Option<Address>,
    pub new_asset_manager: Option<Address>,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingFees {
    pub new_deposit_fee_bps: Option<u32>,
    pub new_withdraw_fee_bps: Option<u32>,
    pub new_management_fee_bps_peryear: Option<u32>,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingLimits {
    pub new_max_total_shares: Option<u64>,
    pub new_max_shares_per_user: Option<u64>,
    pub new_max_total_idle: Option<u64>,
    pub new_max_deviation_bps: Option<u32>,
    pub new_min_shares_to_mint: Option<u64>,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingWhitelist {
    pub new_enabled: Option<bool>,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PendingCooldowns {
    pub new_price_update_cooldown_secs: Option<u64>,
    pub new_price_acceptance_cldwn_s: Option<u64>,
    pub new_config_cooldown_secs: Option<u64>,
    pub new_emergency_withdraw_cldwn_s: Option<u64>,
    pub new_role_change_cooldown_secs: Option<u64>,
    pub new_fee_change_cooldown_secs: Option<u64>,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct State {
    pub core: StateCore,
    pub config: StateConfig,
    pub pending: StatePending,
    pub emergency: StateEmergency,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StateCore {
    pub authority: Address,

    pub oracle: Address,
    pub manager: Address,
    pub processor: Address,
    pub accountant: Address,

    pub asset_manager: Address,

    pub deposit_fee_bps: u32,
    pub withdraw_fee_bps: u32,
    pub management_fee_bps_per_year: u32,

    pub last_mgmt_fee_ts: u64,
    pub price: u64, // Fixed point, PRICE_PRECISION = 1 unit of underlying
    pub total_shares: u64,
    pub total_idle: u64, // Total underlying tokens available in vault for deposits/withdrawals
    pub total_withdrawals_pending: u64,
    pub shares_in_custody: u64, // Share tokens temporarily held in vault's custody during withdrawal process
    pub created_at: u64,

    // Share and idle fund limits
    pub max_total_shares: u64, // Maximum total shares that can exist (max total supply)
    pub max_shares_per_user: u64, // Maximum shares per user
    pub max_total_idle: u64, // Maximum idle underlying tokens (checked only on deposits, not asset manager returns)
    pub min_shares_to_mint: u64, // Minimum shares required for deposits and remaining after withdrawals/swaps
    /// Maximum allowed price deviation in basis points before manual approval required
    pub max_deviation_bps: u32,
    /// Last price update timestamp for deviation cooldown
    pub last_price_update_timestamp: u64,
    /// Storage for withdrawal sequence counter
    pub next_withdrawal_id: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StateConfig {
    /// Cooldown period between price updates for deviation checking
    pub price_update_cooldown_secs: u64,
    /// Cooldown period in seconds after which anyone can accept pending price
    pub price_acceptance_cooldown_secs: u64,
    /// New withdrawal lifecycle parameters
    /// Maximum negative slippage bot may absorb (in basis points)
    pub downside_cap_bps: u32,
    /// Time-to-live after which request can be cancelled fee-free (in seconds)
    pub withdrawal_ttl_secs: u64,
    /// Penalty for user-initiated cancel before TTL (in basis points)
    pub early_cancel_fee_bps: u32,
    /// Extra shares minted to user when cancel happens after TTL (in basis points)
    pub system_penalty_bps: u32,
    /// Whitelist enabled flag
    pub whitelist_enabled: bool,
    /// Vault pause state
    pub paused: bool,
    /// Role change cooldown period in seconds (default 48 hours)
    pub role_change_cooldown_secs: u64,
    /// Default cooldown period for configuration changes in seconds
    pub config_cooldown_secs: u64,
    /// Fee change cooldown period in seconds (default 24 hours)
    pub fee_change_cooldown_secs: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StatePending {
    /// Pending price update awaiting approval
    pub pending_price: PendingPrice,
    /// Pending roles change awaiting approval
    pub pending_roles: PendingRoles,
    /// Pending fee changes awaiting approval
    pub pending_fees: PendingFees,
    /// Pending limits changes awaiting approval
    pub pending_limits: PendingLimits,
    /// Pending whitelist changes awaiting approval
    pub pending_whitelist: PendingWhitelist,
    /// Pending cooldown changes awaiting approval
    pub pending_cooldowns: PendingCooldowns,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StateEmergency {
    /// Emergency withdrawal timelock end timestamp
    pub emergency_withdraw_timelock_e: u64,
    /// Emergency withdrawal cooldown period in seconds (default 24 hours)
    pub emergency_withdrawal_cooldown: u64,
    /// Pending emergency withdrawal request token mint (None if no active request)
    pub emergency_withdraw_token_mint: Option<Address>,
    /// Pending emergency withdrawal request amount (0 if no active request)
    pub emergency_withdrawal_amount: u64,
}
