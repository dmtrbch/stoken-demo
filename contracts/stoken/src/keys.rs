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
    pub value: u64,
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
    pub new_deposit_fee_bps: u32,
    pub new_withdraw_fee_bps: u32,
    pub new_management_fee_bps_peryear: u32,
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
    pub new_enabled: bool,
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
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum WithdrawalRequestStatus {
    PENDING = 1,
    FULFILLED = 2,
    CANCELLED = 3,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WithdrawalRequest {
    pub user: Address,
    pub shares: u64,
    pub amount_due: u64,
    pub min_amount_out: u64,
    pub fee_shares: u64,
    pub price_at_request: u64,
    pub created_at: u64,
    pub status: WithdrawalRequestStatus,
    pub processed_at: Option<u64>,
}

#[derive(Clone)]
#[contracttype]
pub enum StorageKey {
    Authority,
    Oracle,
    Manager,
    Processor,
    Accountant,
    AssetManager,
    DepositFeeBps,
    WithdrawFeeBps,
    ManagementFeeBpsPerYear,
    LastMgmtFeeTs,
    Price, // Fixed point, PRICE_PRECISION = 1 unit of underlying
    TotalShares,
    TotalIdle, // Total underlying tokens available in vault for deposits/withdrawals
    TotalWithdrawalsPending,
    SharesInCustody, // Share tokens temporarily held in vault's custody during withdrawal process
    CreatedAt,
    // Share and idle fund limits
    MaxTotalShares,   // Maximum total shares that can exist (max total supply)
    MaxSharesPerUser, // Maximum shares per user
    MaxTotalIdle, // Maximum idle underlying tokens (checked only on deposits, not asset manager returns)
    MinSharesToMint, // Minimum shares required for deposits and remaining after withdrawals/swaps
    /// Maximum allowed price deviation in basis points before manual approval required
    MaxDeviationBps,
    /// Last price update timestamp for deviation cooldown
    LastPriceUpdateTimestamp,
    /// Storage for withdrawal sequence counter
    NextWithdrawalId,
    /// Cooldown period between price updates for deviation checking
    PriceUpdateCooldownSecs,
    /// Cooldown period in seconds after which anyone can accept pending price
    PriceAcceptanceCooldownSecs,

    /// New withdrawal lifecycle parameters
    /// Maximum negative slippage bot may absorb (in basis points)
    DownsideCapBps,
    /// Time-to-live after which request can be cancelled fee-free (in seconds)
    WithdrawalTtlSecs,
    /// Penalty for user-initiated cancel before TTL (in basis points)
    EarlyCancelFeeBps,
    /// Extra shares minted to user when cancel happens after TTL (in basis points)
    SystemPenaltyBps,

    /// Whitelist enabled flag
    WhitelistEnabled,
    /// Is user whitelisted
    IsWhitelisted(Address),

    /// Vault pause state
    Paused,
    /// Role change cooldown period in seconds (default 48 hours)
    RoleChangeCooldownSecs,
    /// Default cooldown period for configuration changes in seconds
    ConfigCooldownSecs,
    /// Fee change cooldown period in seconds (default 24 hours)
    FeeChangeCooldownSecs,
    /// Pending price update awaiting approval
    PendingPrice,
    /// Pending roles change awaiting approval
    PendingRoles,
    /// Pending fee changes awaiting approval
    PendingFees,
    /// Pending limits changes awaiting approval
    PendingLimits,
    /// Pending whitelist changes awaiting approval
    PendingWhitelist,
    /// Pending cooldown changes awaiting approval
    PendingCooldowns,
    /// Emergency withdrawal timelock end timestamp
    EmergencyWithdrawTimelockEnd,
    /// Emergency withdrawal cooldown period in seconds (default 24 hours)
    EmergencyWithdrawalCooldown,
    /// Pending emergency withdrawal request token mint (None if no active request)
    EmergencyWithdrawTokenMint,
    /// Pending emergency withdrawal request amount (0 if no active request)
    EmergencyWithdrawalAmount,
    /// Withdrawal request data
    WithdrawRequest(u64),
    /// Allowlist for mint - needed for swaps between vaults
    AllowlistMint(Address),
}
