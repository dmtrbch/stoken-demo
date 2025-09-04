use soroban_sdk::contracterror;

/// Error codes for the STokenCore contract
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenCoreError {
    Unauthorized = 1,
    InvalidFee = 2,
    InvalidPrice = 3,
    InvalidAmount = 4,
    InvalidArgument = 5,
    InsufficientBalance = 6,
    InsufficientShares = 7,
    MathOverflow = 8,
    InvalidUnderlyingMint = 9,
    InvalidSharesMint = 10,
    InvalidTokenAccountMint = 11,
    InvalidTokenAccountOwner = 12,
    InvalidAtaAddress = 13,
    InvalidTokenProgram = 14,
    VaultNotInitialized = 15,
    WithdrawalRequestNotFound = 16,
    WithdrawalAmountTooLow = 17,
    // WithdrawalQueueFull = 17,
    InvalidTimestamp = 18,
    FeeCalculationError = 19,
    PriceTooOld = 20,
    InvalidOracle = 21,
    InvalidManager = 22,
    // InvalidProcessor = 23,
    InvalidWithdrawalMinimum = 23,
    // InvalidAccountant = 24,
    MinimumTooHigh = 24,
    InvalidAssetManager = 25,
    ZeroSharesCalculated = 26,
    ZeroAmountCalculated = 27,
    UserNotWhitelisted = 28,
    WhitelistNotEnabled = 29,
    WhitelistAlreadyExists = 30,
    WhitelistFull = 31,
    AddressAlreadyWhitelisted = 32,
    AddressNotWhitelisted = 33,
    InvalidWhitelist = 34,
    InvalidUserWhitelist = 35,
    MaxTotalSharesExceeded = 36,
    MaxSharesPerUserExceeded = 37,
    MaxTotalIdleExceeded = 38,
    InvalidRecipient = 39,
    InitializationFailed = 40,
    PriceCooldownNotExpired = 41,
    SlippageNotMet = 42,
    InvalidLimit = 43,
    LimitExceedsMaximum = 44,
    MinimumSharesNotMet = 45,
    LimitsChangeTimelockActive = 46,
    NoPendingLimitsChange = 47,
    NoLimitsChanges = 48,
    UserAlreadyWhitelisted = 49,
    VaultPaused = 50,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenOracleError {
    PricePending = 1,
    NoPendingPrice = 2,
    PriceDeviationTooHigh = 3,
    PriceCooldownNotExpired = 4,
    PriceUpdateTooFrequent = 5,
    InvalidDeviationThreshold = 6,
    InvalidOracleData = 7,
    InvalidPrice = 8,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenWithdrawalRequestError {
    InvalidWithdrawalIndex = 1,
    WithdrawalAlreadyFulfilled = 2,
    WithdrawalAlreadyCancelled = 3,
    InvalidWithdrawalRequestStatus = 4,

    // Indexed Withdrawal Requests errors
    WithdrawalQueueEmpty = 5,
    InvalidBatchSize = 6,
    VaultPaused = 7,
    InvalidWithdrawalRequest = 8,
    TtlNotExpired = 9,
    InvalidUserAccount = 10,
    MathOverflow = 11,
    MinimumCannotIncrease = 12,
    InsufficientBalance = 13,
    InsufficientVaultFunds = 14,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenInboundTransfersError {
    NoUnexpectedDeposits = 1,
    UnexpectedDepositsCooldown = 2,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenEmergencyWithdrawalError {
    VaultPaused = 1,
    VaultNotPaused = 2,
    EmergencyOnly = 3,
    EmergencyWithdrawalTimelockActive = 4,
    EmergencyWithdrawalTokenMismatch = 5,
    EmergencyWithdrawalAmountMismatch = 6,
    InvalidAmount = 7,
    InvalidArgument = 8,
    InvalidTokenAccountMint = 9,
    InsufficientBalance = 10,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenConfigurationCooldownError {
    ConfigChangePending = 1,
    ConfigCooldownNotExpired = 2,
    NoConfigChangesPending = 3,
    NoConfigChanges = 4,
    TooManyPendingChanges = 5,
    InvalidConfigChange = 6,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenFulfillWithdrawalError {
    InvalidWithdrawalRequest = 1,
    InvalidUserTokenAccount = 2,
    InsufficientVaultFunds = 3,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenRoleChangeError {
    RoleChangeTimelockActive = 1,
    InvalidRole = 2,
    NoPendingRolesChange = 3,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenFeeChangeError {
    FeeChangeTimelockActive = 1,
    NoPendingFeesChange = 2,
    NoFeeChanges = 3,
    InvalidFee = 4,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenCooldownChangeError {
    CooldownChangeTimelockActive = 1,
    NoPendingCooldownChange = 2,
    NoCooldownChanges = 3,
    CooldownUpdateBlockedByPendingChanges = 4,
    InvalidCooldownDuration = 5,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenWhitelistChangeError {
    WhitelistChangeTimelockActive = 1,
    NoPendingWhitelistChange = 2,
    NoWhitelistChanges = 3,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenSwapError {
    InvalidSwapSameVault = 1,
    IncompatibleUnderlyingTokens = 2,
    MissingAssetManager = 3,
    InvalidSwapFee = 4,
    ZeroSwapAmount = 5,
    SwapAmountTooSmall = 6,
    UnderlyingMintMismatch = 7,
    VaultsMustHaveAssetManagers = 8,
    AssetManagerMismatch = 9,
    VaultPaused = 10,
    MathOverflow = 11,
    TokenDecimalMismatch = 12,
    UserNotWhitelisted = 13,
    SlippageNotMet = 14,
    MinimumSharesNotMet = 15,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenWithdrawalLifecycleError {
    MinimumCannotIncrease = 1,
    InsufficientLiquidity = 2,
    PriceDropExceedsDownsideCap = 3,
    WithdrawalTtlNotExpired = 4,
    InvalidWithdrawalMinimum = 5,
    BotCancellationForbidden = 6,
    WithdrawalAmountTooLow = 7,
    MinimumTooHigh = 8,
    TokenDecimalMismatch = 9,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum STokenAllowlistMintError {
    AssetManagerMismatch = 1,
    NotInAllowlist = 2,
    VaultPaused = 3,
}
