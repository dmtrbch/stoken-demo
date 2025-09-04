// Constants for the S-Token vault program

/// Fixed-point precision for price calculations (1e18 = 1 unit of underlying)
pub const PRICE_PRECISION: u64 = 10_000_000;

/// Basis points precision (10,000 = 100%)
pub const BPS_PRECISION: u32 = 10_000;

/// Maximum fee in basis points (10% = 1,000 bps)
pub const MAX_FEE_BPS: u32 = 1_000;

/// Maximum management fee per year in basis points (5% = 500 bps)
pub const MAX_MANAGEMENT_FEE_BPS_PER_YEAR: u32 = 500;

/// Seconds per year for management fee calculations
pub const SECONDS_PER_YEAR: u64 = 365 * 24 * 60 * 60;

/// Minimum cooldown duration in seconds
pub const MIN_COOLDOWN_SECS: u64 = 1;

/// Maximum cooldown duration in seconds (1 year)
pub const MAX_COOLDOWN_SECS: u64 = SECONDS_PER_YEAR;

/// Minimum fee threshold to avoid zero fees for small amounts
pub const MIN_FEE_THRESHOLD: u64 = 1;

/// Maximum deviation (in basis points) that manager can bypass cooldown for
/// 2000 bps = 20% deviation
pub const MAX_MANAGER_BYPASS_DEVIATION_BPS: u32 = 2000;

/// Maximum allowed token decimals (typical for SPL tokens)
pub const MAX_TOKEN_DECIMALS: u8 = 7;

/// Maximum allowed value for max_total_shares (1 billion shares)
/// This is large enough for any reasonable vault but prevents overflow issues
pub const MAX_ALLOWED_TOTAL_SHARES: u64 = 10_000_000_000_000_000;

/// Maximum allowed value for max_shares_per_user (10 million shares)
/// Allows large institutional use while preventing total monopolization
pub const MAX_ALLOWED_SHARES_PER_USER: u64 = 100_000_000_000_000;

/// Maximum allowed value for max_total_idle (10 billion underlying tokens)
/// Supports extremely large asset pools while maintaining reasonable bounds
pub const MAX_ALLOWED_TOTAL_IDLE: u64 = 100_000_000_000_000_000;

/// Maximum allowed value for min_shares_to_mint (100 million shares)
/// Prevents setting minimums so high that they become unusable
pub const MAX_ALLOWED_MIN_SHARES_TO_MINT: u64 = 1_000_000_000_000_000;

/// Maximum swap fee in basis points (1% = 100 bps)
/// Keeps swap fees reasonable and competitive
pub const MAX_SWAP_FEE_BPS: u16 = 100;

/// Default swap fee in basis points (0.1% = 10 bps)
pub const DEFAULT_SWAP_FEE_BPS: u16 = 10;

/// New withdrawal lifecycle constants
/// Default downside cap for withdrawal fulfillment (5% = 500 bps)  
pub const DEFAULT_DOWNSIDE_CAP_BPS: u32 = 500;

/// Default time-to-live for withdrawal requests (24 hours)
pub const DEFAULT_WITHDRAWAL_TTL_SECS: u64 = 86400;

/// Default early cancellation fee (1% = 100 bps)
pub const DEFAULT_EARLY_CANCEL_FEE_BPS: u32 = 100;

/// Default system penalty for late cancellations (0.5% = 50 bps)
pub const DEFAULT_SYSTEM_PENALTY_BPS: u32 = 50;

/// Maximum withdrawal TTL (7 days)
pub const MAX_WITHDRAWAL_TTL_SECS: u64 = 7 * 24 * 60 * 60;
