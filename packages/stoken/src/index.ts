import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CB7U3MEFKRFGVWBRBYQI5LGBR4Q542AUGKEK5ABXUVLCQXSZ5FLEKGGE",
  }
} as const

/**
 * Error codes for the STokenCore contract
 */
export const STokenCoreError = {
  1: {message:"Unauthorized"},
  2: {message:"InvalidFee"},
  3: {message:"InvalidPrice"},
  4: {message:"InvalidAmount"},
  5: {message:"InvalidArgument"},
  6: {message:"InsufficientBalance"},
  7: {message:"InsufficientShares"},
  8: {message:"MathOverflow"},
  9: {message:"InvalidUnderlyingMint"},
  10: {message:"InvalidSharesMint"},
  11: {message:"InvalidTokenAccountMint"},
  12: {message:"InvalidTokenAccountOwner"},
  13: {message:"InvalidAtaAddress"},
  14: {message:"InvalidTokenProgram"},
  15: {message:"VaultNotInitialized"},
  16: {message:"WithdrawalRequestNotFound"},
  17: {message:"WithdrawalAmountTooLow"},
  18: {message:"InvalidTimestamp"},
  19: {message:"FeeCalculationError"},
  20: {message:"PriceTooOld"},
  21: {message:"InvalidOracle"},
  22: {message:"InvalidManager"},
  23: {message:"InvalidWithdrawalMinimum"},
  24: {message:"MinimumTooHigh"},
  25: {message:"InvalidAssetManager"},
  26: {message:"ZeroSharesCalculated"},
  27: {message:"ZeroAmountCalculated"},
  28: {message:"UserNotWhitelisted"},
  29: {message:"WhitelistNotEnabled"},
  30: {message:"WhitelistAlreadyExists"},
  31: {message:"WhitelistFull"},
  32: {message:"AddressAlreadyWhitelisted"},
  33: {message:"AddressNotWhitelisted"},
  34: {message:"InvalidWhitelist"},
  35: {message:"InvalidUserWhitelist"},
  36: {message:"MaxTotalSharesExceeded"},
  37: {message:"MaxSharesPerUserExceeded"},
  38: {message:"MaxTotalIdleExceeded"},
  39: {message:"InvalidRecipient"},
  40: {message:"InitializationFailed"},
  41: {message:"PriceCooldownNotExpired"},
  42: {message:"SlippageNotMet"},
  43: {message:"InvalidLimit"},
  44: {message:"LimitExceedsMaximum"},
  45: {message:"MinimumSharesNotMet"},
  46: {message:"LimitsChangeTimelockActive"},
  47: {message:"NoPendingLimitsChange"},
  48: {message:"NoLimitsChanges"},
  49: {message:"UserAlreadyWhitelisted"},
  50: {message:"VaultPaused"}
}

export const STokenOracleError = {
  1: {message:"PricePending"},
  2: {message:"NoPendingPrice"},
  3: {message:"PriceDeviationTooHigh"},
  4: {message:"PriceCooldownNotExpired"},
  5: {message:"PriceUpdateTooFrequent"},
  6: {message:"InvalidDeviationThreshold"},
  7: {message:"InvalidOracleData"},
  8: {message:"InvalidPrice"}
}

export const STokenWithdrawalRequestError = {
  1: {message:"InvalidWithdrawalIndex"},
  2: {message:"WithdrawalAlreadyFulfilled"},
  3: {message:"WithdrawalAlreadyCancelled"},
  4: {message:"InvalidWithdrawalRequestStatus"},
  5: {message:"WithdrawalQueueEmpty"},
  6: {message:"InvalidBatchSize"},
  7: {message:"VaultPaused"},
  8: {message:"InvalidWithdrawalRequest"},
  9: {message:"TtlNotExpired"},
  10: {message:"InvalidUserAccount"},
  11: {message:"MathOverflow"},
  12: {message:"MinimumCannotIncrease"},
  13: {message:"InsufficientBalance"},
  14: {message:"InsufficientVaultFunds"}
}

export const STokenInboundTransfersError = {
  1: {message:"NoUnexpectedDeposits"},
  2: {message:"UnexpectedDepositsCooldown"}
}

export const STokenEmergencyWithdrawalError = {
  1: {message:"VaultPaused"},
  2: {message:"VaultNotPaused"},
  3: {message:"EmergencyOnly"},
  4: {message:"EmergencyWithdrawalTimelockActive"},
  5: {message:"EmergencyWithdrawalTokenMismatch"},
  6: {message:"EmergencyWithdrawalAmountMismatch"},
  7: {message:"InvalidAmount"},
  8: {message:"InvalidArgument"},
  9: {message:"InvalidTokenAccountMint"},
  10: {message:"InsufficientBalance"}
}

export const STokenConfigurationCooldownError = {
  1: {message:"ConfigChangePending"},
  2: {message:"ConfigCooldownNotExpired"},
  3: {message:"NoConfigChangesPending"},
  4: {message:"NoConfigChanges"},
  5: {message:"TooManyPendingChanges"},
  6: {message:"InvalidConfigChange"}
}

export const STokenFulfillWithdrawalError = {
  1: {message:"InvalidWithdrawalRequest"},
  2: {message:"InvalidUserTokenAccount"},
  3: {message:"InsufficientVaultFunds"}
}

export const STokenRoleChangeError = {
  1: {message:"RoleChangeTimelockActive"},
  2: {message:"InvalidRole"},
  3: {message:"NoPendingRolesChange"}
}

export const STokenFeeChangeError = {
  1: {message:"FeeChangeTimelockActive"},
  2: {message:"NoPendingFeesChange"},
  3: {message:"NoFeeChanges"},
  4: {message:"InvalidFee"}
}

export const STokenCooldownChangeError = {
  1: {message:"CooldownChangeTimelockActive"},
  2: {message:"NoPendingCooldownChange"},
  3: {message:"NoCooldownChanges"},
  4: {message:"CooldownUpdateBlockedByPendingChanges"},
  5: {message:"InvalidCooldownDuration"}
}

export const STokenWhitelistChangeError = {
  1: {message:"WhitelistChangeTimelockActive"},
  2: {message:"NoPendingWhitelistChange"},
  3: {message:"NoWhitelistChanges"}
}

export const STokenSwapError = {
  1: {message:"InvalidSwapSameVault"},
  2: {message:"IncompatibleUnderlyingTokens"},
  3: {message:"MissingAssetManager"},
  4: {message:"InvalidSwapFee"},
  5: {message:"ZeroSwapAmount"},
  6: {message:"SwapAmountTooSmall"},
  7: {message:"UnderlyingMintMismatch"},
  8: {message:"VaultsMustHaveAssetManagers"},
  9: {message:"AssetManagerMismatch"},
  10: {message:"VaultPaused"},
  11: {message:"MathOverflow"},
  12: {message:"TokenDecimalMismatch"},
  13: {message:"UserNotWhitelisted"},
  14: {message:"SlippageNotMet"},
  15: {message:"MinimumSharesNotMet"}
}

export const STokenWithdrawalLifecycleError = {
  1: {message:"MinimumCannotIncrease"},
  2: {message:"InsufficientLiquidity"},
  3: {message:"PriceDropExceedsDownsideCap"},
  4: {message:"WithdrawalTtlNotExpired"},
  5: {message:"InvalidWithdrawalMinimum"},
  6: {message:"BotCancellationForbidden"},
  7: {message:"WithdrawalAmountTooLow"},
  8: {message:"MinimumTooHigh"},
  9: {message:"TokenDecimalMismatch"}
}

export const STokenAllowlistMintError = {
  1: {message:"AssetManagerMismatch"},
  2: {message:"NotInAllowlist"},
  3: {message:"VaultPaused"}
}


export interface VaultInitConfig {
  accountant: string;
  asset_manager: string;
  authority: string;
  config_cooldown_secs: Option<u64>;
  deposit_fee_bps: u32;
  downside_cap_bps: Option<u32>;
  early_cancel_fee_bps: Option<u32>;
  emergency_withdrawal_cooldown: Option<u64>;
  fee_change_cooldown_secs: Option<u64>;
  initial_price: Option<u64>;
  management_fee_bps_per_year: u32;
  manager: string;
  max_deviation_bps: Option<u32>;
  max_shares_per_user: Option<u64>;
  max_total_idle: Option<u64>;
  max_total_shares: Option<u64>;
  min_shares_to_mint: Option<u64>;
  oracle: string;
  price_acceptance_cooldown_secs: Option<u64>;
  price_update_cooldown_secs: Option<u64>;
  processor: string;
  role_change_cooldown_secs: Option<u64>;
  system_penalty_bps: Option<u32>;
  underlying_mint: string;
  whitelist_enabled: Option<boolean>;
  withdraw_fee_bps: u32;
  withdrawal_ttl_secs: Option<u64>;
}


export interface PendingPrice {
  timestamp: u64;
  value: u64;
}


export interface PendingRoles {
  new_accountant: Option<string>;
  new_asset_manager: Option<string>;
  new_manager: Option<string>;
  new_oracle: Option<string>;
  new_processor: Option<string>;
  timestamp: u64;
}


export interface PendingFees {
  new_deposit_fee_bps: u32;
  new_management_fee_bps_peryear: u32;
  new_withdraw_fee_bps: u32;
  timestamp: u64;
}


export interface PendingLimits {
  new_max_deviation_bps: Option<u32>;
  new_max_shares_per_user: Option<u64>;
  new_max_total_idle: Option<u64>;
  new_max_total_shares: Option<u64>;
  new_min_shares_to_mint: Option<u64>;
  timestamp: u64;
}


export interface PendingWhitelist {
  new_enabled: boolean;
  timestamp: u64;
}


export interface PendingCooldowns {
  new_config_cooldown_secs: Option<u64>;
  new_emergency_withdraw_cldwn_s: Option<u64>;
  new_fee_change_cooldown_secs: Option<u64>;
  new_price_acceptance_cldwn_s: Option<u64>;
  new_price_update_cooldown_secs: Option<u64>;
  new_role_change_cooldown_secs: Option<u64>;
  timestamp: u64;
}

export enum WithdrawalRequestStatus {
  PENDING = 1,
  FULFILLED = 2,
  CANCELLED = 3,
}


export interface WithdrawalRequest {
  amount_due: u64;
  created_at: u64;
  fee_shares: u64;
  min_amount_out: u64;
  price_at_request: u64;
  processed_at: Option<u64>;
  shares: u64;
  status: WithdrawalRequestStatus;
  user: string;
}

export type STokenStorageKey = {tag: "Authority", values: void} | {tag: "Oracle", values: void} | {tag: "Manager", values: void} | {tag: "Processor", values: void} | {tag: "Accountant", values: void} | {tag: "AssetManager", values: void} | {tag: "DepositFeeBps", values: void} | {tag: "WithdrawFeeBps", values: void} | {tag: "ManagementFeeBpsPerYear", values: void} | {tag: "LastMgmtFeeTs", values: void} | {tag: "Price", values: void} | {tag: "TotalShares", values: void} | {tag: "TotalIdle", values: void} | {tag: "TotalWithdrawalsPending", values: void} | {tag: "SharesInCustody", values: void} | {tag: "CreatedAt", values: void} | {tag: "MaxTotalShares", values: void} | {tag: "MaxSharesPerUser", values: void} | {tag: "MaxTotalIdle", values: void} | {tag: "MinSharesToMint", values: void} | {tag: "MaxDeviationBps", values: void} | {tag: "LastPriceUpdateTimestamp", values: void} | {tag: "NextWithdrawalId", values: void} | {tag: "PriceUpdateCooldownSecs", values: void} | {tag: "PriceAcceptanceCooldownSecs", values: void} | {tag: "DownsideCapBps", values: void} | {tag: "WithdrawalTtlSecs", values: void} | {tag: "EarlyCancelFeeBps", values: void} | {tag: "SystemPenaltyBps", values: void} | {tag: "WhitelistEnabled", values: void} | {tag: "IsWhitelisted", values: readonly [string]} | {tag: "Paused", values: void} | {tag: "RoleChangeCooldownSecs", values: void} | {tag: "ConfigCooldownSecs", values: void} | {tag: "FeeChangeCooldownSecs", values: void} | {tag: "PendingPrice", values: void} | {tag: "PendingRoles", values: void} | {tag: "PendingFees", values: void} | {tag: "PendingLimits", values: void} | {tag: "PendingWhitelist", values: void} | {tag: "PendingCooldowns", values: void} | {tag: "EmergencyWithdrawTimelockEnd", values: void} | {tag: "EmergencyWithdrawalCooldown", values: void} | {tag: "EmergencyWithdrawTokenMint", values: void} | {tag: "EmergencyWithdrawalAmount", values: void} | {tag: "WithdrawRequest", values: readonly [u64]} | {tag: "AllowlistMint", values: readonly [string]};


export interface VaultInitConfig {
  accountant: string;
  asset_manager: string;
  authority: string;
  config_cooldown_secs: Option<u64>;
  deposit_fee_bps: u32;
  downside_cap_bps: Option<u32>;
  early_cancel_fee_bps: Option<u32>;
  emergency_withdrawal_cooldown: Option<u64>;
  fee_change_cooldown_secs: Option<u64>;
  initial_price: Option<u64>;
  management_fee_bps_per_year: u32;
  manager: string;
  max_deviation_bps: Option<u32>;
  max_shares_per_user: Option<u64>;
  max_total_idle: Option<u64>;
  max_total_shares: Option<u64>;
  min_shares_to_mint: Option<u64>;
  oracle: string;
  price_acceptance_cooldown_secs: Option<u64>;
  price_update_cooldown_secs: Option<u64>;
  processor: string;
  role_change_cooldown_secs: Option<u64>;
  system_penalty_bps: Option<u32>;
  underlying_mint: string;
  whitelist_enabled: Option<boolean>;
  withdraw_fee_bps: u32;
  withdrawal_ttl_secs: Option<u64>;
}



export interface PendingRoles {
  new_accountant: Option<string>;
  new_asset_manager: Option<string>;
  new_manager: Option<string>;
  new_oracle: Option<string>;
  new_processor: Option<string>;
  timestamp: u64;
}



export interface PendingLimits {
  new_max_deviation_bps: Option<u32>;
  new_max_shares_per_user: Option<u64>;
  new_max_total_idle: Option<u64>;
  new_max_total_shares: Option<u64>;
  new_min_shares_to_mint: Option<u64>;
  timestamp: u64;
}



export interface PendingCooldowns {
  new_config_cooldown_secs: Option<u64>;
  new_emergency_withdraw_cldwn_s: Option<u64>;
  new_fee_change_cooldown_secs: Option<u64>;
  new_price_acceptance_cldwn_s: Option<u64>;
  new_price_update_cooldown_secs: Option<u64>;
  new_role_change_cooldown_secs: Option<u64>;
  timestamp: u64;
}


export interface State {
  config: StateConfig;
  core: StateCore;
  emergency: StateEmergency;
  pending: StatePending;
}


export interface StateCore {
  accountant: string;
  asset_manager: string;
  authority: string;
  created_at: u64;
  deposit_fee_bps: u32;
  last_mgmt_fee_ts: u64;
  /**
 * Last price update timestamp for deviation cooldown
 */
last_price_update_timestamp: u64;
  management_fee_bps_per_year: u32;
  manager: string;
  /**
 * Maximum allowed price deviation in basis points before manual approval required
 */
max_deviation_bps: u32;
  max_shares_per_user: u64;
  max_total_idle: u64;
  max_total_shares: u64;
  min_shares_to_mint: u64;
  /**
 * Storage for withdrawal sequence counter
 */
next_withdrawal_id: u64;
  oracle: string;
  price: u64;
  processor: string;
  shares_in_custody: u64;
  total_idle: u64;
  total_shares: u64;
  total_withdrawals_pending: u64;
  withdraw_fee_bps: u32;
}


export interface StateConfig {
  /**
 * Default cooldown period for configuration changes in seconds
 */
config_cooldown_secs: u64;
  /**
 * New withdrawal lifecycle parameters
 * Maximum negative slippage bot may absorb (in basis points)
 */
downside_cap_bps: u32;
  /**
 * Penalty for user-initiated cancel before TTL (in basis points)
 */
early_cancel_fee_bps: u32;
  /**
 * Fee change cooldown period in seconds (default 24 hours)
 */
fee_change_cooldown_secs: u64;
  /**
 * Vault pause state
 */
paused: boolean;
  /**
 * Cooldown period in seconds after which anyone can accept pending price
 */
price_acceptance_cooldown_secs: u64;
  /**
 * Cooldown period between price updates for deviation checking
 */
price_update_cooldown_secs: u64;
  /**
 * Role change cooldown period in seconds (default 48 hours)
 */
role_change_cooldown_secs: u64;
  /**
 * Extra shares minted to user when cancel happens after TTL (in basis points)
 */
system_penalty_bps: u32;
  /**
 * Whitelist enabled flag
 */
whitelist_enabled: boolean;
  /**
 * Time-to-live after which request can be cancelled fee-free (in seconds)
 */
withdrawal_ttl_secs: u64;
}


export interface StatePending {
  /**
 * Pending cooldown changes awaiting approval
 */
pending_cooldowns: PendingCooldowns;
  /**
 * Pending fee changes awaiting approval
 */
pending_fees: PendingFees;
  /**
 * Pending limits changes awaiting approval
 */
pending_limits: PendingLimits;
  /**
 * Pending price update awaiting approval
 */
pending_price: PendingPrice;
  /**
 * Pending roles change awaiting approval
 */
pending_roles: PendingRoles;
  /**
 * Pending whitelist changes awaiting approval
 */
pending_whitelist: PendingWhitelist;
}


export interface StateEmergency {
  /**
 * Emergency withdrawal timelock end timestamp
 */
emergency_withdraw_timelock_e: u64;
  /**
 * Pending emergency withdrawal request token mint (None if no active request)
 */
emergency_withdraw_token_mint: Option<string>;
  /**
 * Pending emergency withdrawal request amount (0 if no active request)
 */
emergency_withdrawal_amount: u64;
  /**
 * Emergency withdrawal cooldown period in seconds (default 24 hours)
 */
emergency_withdrawal_cooldown: u64;
}

/**
 * Storage keys for the data associated with the allowlist extension
 */
export type AllowListStorageKey = {tag: "Allowed", values: readonly [string]};

/**
 * Storage keys for the data associated with the blocklist extension
 */
export type BlockListStorageKey = {tag: "Blocked", values: readonly [string]};

/**
 * Storage keys for the data associated with the vault extension
 */
export type VaultStorageKey = {tag: "AssetAddress", values: void};

export type Rounding = {tag: "Floor", values: void} | {tag: "Ceil", values: void};


/**
 * Storage key that maps to [`AllowanceData`]
 */
export interface AllowanceKey {
  owner: string;
  spender: string;
}


/**
 * Storage container for the amount of tokens for which an allowance is granted
 * and the ledger number at which this allowance expires.
 */
export interface AllowanceData {
  amount: i128;
  live_until_ledger: u32;
}

/**
 * Storage keys for the data associated with `FungibleToken`
 */
export type StorageKey = {tag: "TotalSupply", values: void} | {tag: "Balance", values: readonly [string]} | {tag: "Allowance", values: readonly [AllowanceKey]};


/**
 * Storage container for token metadata
 */
export interface Metadata {
  decimals: u32;
  name: string;
  symbol: string;
}

/**
 * Storage key for accessing the SAC address
 */
export type SACAdminGenericDataKey = {tag: "Sac", values: void};

/**
 * Storage key for accessing the SAC address
 */
export type SACAdminWrapperDataKey = {tag: "Sac", values: void};

export const FungibleTokenError = {
  /**
   * Indicates an error related to the current balance of account from which
   * tokens are expected to be transferred.
   */
  100: {message:"InsufficientBalance"},
  /**
   * Indicates a failure with the allowance mechanism when a given spender
   * doesn't have enough allowance.
   */
  101: {message:"InsufficientAllowance"},
  /**
   * Indicates an invalid value for `live_until_ledger` when setting an
   * allowance.
   */
  102: {message:"InvalidLiveUntilLedger"},
  /**
   * Indicates an error when an input that must be >= 0
   */
  103: {message:"LessThanZero"},
  /**
   * Indicates overflow when adding two values
   */
  104: {message:"MathOverflow"},
  /**
   * Indicates access to uninitialized metadata
   */
  105: {message:"UnsetMetadata"},
  /**
   * Indicates that the operation would have caused `total_supply` to exceed
   * the `cap`.
   */
  106: {message:"ExceededCap"},
  /**
   * Indicates the supplied `cap` is not a valid cap value.
   */
  107: {message:"InvalidCap"},
  /**
   * Indicates the Cap was not set.
   */
  108: {message:"CapNotSet"},
  /**
   * Indicates the SAC address was not set.
   */
  109: {message:"SACNotSet"},
  /**
   * Indicates a SAC address different than expected.
   */
  110: {message:"SACAddressMismatch"},
  /**
   * Indicates a missing function parameter in the SAC contract context.
   */
  111: {message:"SACMissingFnParam"},
  /**
   * Indicates an invalid function parameter in the SAC contract context.
   */
  112: {message:"SACInvalidFnParam"},
  /**
   * The user is not allowed to perform this operation
   */
  113: {message:"UserNotAllowed"},
  /**
   * The user is blocked and cannot perform this operation
   */
  114: {message:"UserBlocked"},
  /**
   * Indicates access to uninitialized vault asset address
   */
  115: {message:"VaultAssetAddressNotSet"},
  /**
   * Indicates the amount is not a valid vault assets value.
   */
  116: {message:"VaultInvalidAssetsAmount"},
  /**
   * Indicates the amount is not a valid vault shares value.
   */
  117: {message:"VaultInvalidSharesAmount"},
  /**
   * Attempted to deposit more assets than the max amount for address.
   */
  118: {message:"VaultExceededMaxDeposit"},
  /**
   * Attempted to mint more shares than the max amount for address.
   */
  119: {message:"VaultExceededMaxMint"},
  /**
   * Attempted to withdraw more assets than the max amount for address.
   */
  120: {message:"VaultExceededMaxWithdraw"},
  /**
   * Attempted to redeem more shares than the max amount for address.
   */
  121: {message:"VaultExceededMaxRedeem"}
}

/**
 * Storage keys for the data associated with the consecutive extension of
 * `NonFungibleToken`
 */
export type NFTConsecutiveStorageKey = {tag: "Approval", values: readonly [u32]} | {tag: "Owner", values: readonly [u32]} | {tag: "OwnershipBucket", values: readonly [u32]} | {tag: "BurnedToken", values: readonly [u32]};


export interface OwnerTokensKey {
  index: u32;
  owner: string;
}

/**
 * Storage keys for the data associated with the enumerable extension of
 * `NonFungibleToken`
 */
export type NFTEnumerableStorageKey = {tag: "TotalSupply", values: void} | {tag: "OwnerTokens", values: readonly [OwnerTokensKey]} | {tag: "OwnerTokensIndex", values: readonly [u32]} | {tag: "GlobalTokens", values: readonly [u32]} | {tag: "GlobalTokensIndex", values: readonly [u32]};


/**
 * Storage container for royalty information
 */
export interface RoyaltyInfo {
  basis_points: u32;
  receiver: string;
}

/**
 * Storage keys for royalty data
 */
export type NFTRoyaltiesStorageKey = {tag: "DefaultRoyalty", values: void} | {tag: "TokenRoyalty", values: readonly [u32]};


/**
 * Storage container for the token for which an approval is granted
 * and the ledger number at which this approval expires.
 */
export interface ApprovalData {
  approved: string;
  live_until_ledger: u32;
}


/**
 * Storage container for token metadata
 */
export interface Metadata {
  base_uri: string;
  name: string;
  symbol: string;
}

/**
 * Storage keys for the data associated with `NonFungibleToken`
 */
export type NFTStorageKey = {tag: "Owner", values: readonly [u32]} | {tag: "Balance", values: readonly [string]} | {tag: "Approval", values: readonly [u32]} | {tag: "ApprovalForAll", values: readonly [string, string]} | {tag: "Metadata", values: void};

export type NFTSequentialStorageKey = {tag: "TokenIdCounter", values: void};

export const NonFungibleTokenError = {
  /**
   * Indicates a non-existent `token_id`.
   */
  200: {message:"NonExistentToken"},
  /**
   * Indicates an error related to the ownership over a particular token.
   * Used in transfers.
   */
  201: {message:"IncorrectOwner"},
  /**
   * Indicates a failure with the `operator`s approval. Used in transfers.
   */
  202: {message:"InsufficientApproval"},
  /**
   * Indicates a failure with the `approver` of a token to be approved. Used
   * in approvals.
   */
  203: {message:"InvalidApprover"},
  /**
   * Indicates an invalid value for `live_until_ledger` when setting
   * approvals.
   */
  204: {message:"InvalidLiveUntilLedger"},
  /**
   * Indicates overflow when adding two values
   */
  205: {message:"MathOverflow"},
  /**
   * Indicates all possible `token_id`s are already in use.
   */
  206: {message:"TokenIDsAreDepleted"},
  /**
   * Indicates an invalid amount to batch mint in `consecutive` extension.
   */
  207: {message:"InvalidAmount"},
  /**
   * Indicates the token does not exist in owner's list.
   */
  208: {message:"TokenNotFoundInOwnerList"},
  /**
   * Indicates the token does not exist in global list.
   */
  209: {message:"TokenNotFoundInGlobalList"},
  /**
   * Indicates access to unset metadata.
   */
  210: {message:"UnsetMetadata"},
  /**
   * Indicates the length of the base URI exceeds the maximum allowed.
   */
  211: {message:"BaseUriMaxLenExceeded"},
  /**
   * Indicates the royalty amount is higher than 10_000 (100%) basis points.
   */
  212: {message:"InvalidRoyaltyAmount"}
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({config}: {config: VaultInitConfig}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a mint_core transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint_core: ({mint, to, amount}: {mint: string, to: string, amount: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a propose_roles transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Propose vault role changes
   */
  propose_roles: ({new_manager, new_processor, new_accountant, new_oracle, new_asset_manager}: {new_manager: Option<string>, new_processor: Option<string>, new_accountant: Option<string>, new_oracle: Option<string>, new_asset_manager: Option<string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a accept_roles transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accept pending role changes after cooldown
   */
  accept_roles: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a propose_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Propose fee parameter changes (starts cooldown period)
   */
  propose_fees: ({deposit_fee_bps, withdraw_fee_bps, management_fee_bps_per_year}: {deposit_fee_bps: u32, withdraw_fee_bps: u32, management_fee_bps_per_year: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a accept_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accept pending fee changes after cooldown
   */
  accept_fees: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a propose_limits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Propose limits parameter changes (starts cooldown period)
   */
  propose_limits: ({new_max_total_shares, new_max_shares_per_user, new_max_total_idle, new_max_deviation_bps, new_min_shares_to_mint}: {new_max_total_shares: Option<u64>, new_max_shares_per_user: Option<u64>, new_max_total_idle: Option<u64>, new_max_deviation_bps: Option<u32>, new_min_shares_to_mint: Option<u64>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a accept_limits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accept pending limits changes after cooldown
   */
  accept_limits: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a update_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update S-Token price (with secure price flow for v2)
   */
  update_price: ({new_price}: {new_price: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a deposit_core transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deposit underlying tokens to receive S-Tokens
   */
  deposit_core: ({amount, caller, min_shares, beneficiary}: {amount: u64, caller: string, min_shares: Option<u64>, beneficiary: Option<string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a withdraw_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Request withdrawal of S-Tokens
   */
  withdraw_request: ({caller, shares, min_amount_out}: {caller: string, shares: u64, min_amount_out: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a update_withdrawal_minimum transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update minimum acceptable payout for a pending withdrawal request
   */
  update_withdrawal_minimum: ({caller, request_id, new_minimum}: {caller: string, request_id: u64, new_minimum: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a process_deposits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Process queued deposits (processor only)
   */
  process_deposits: ({amount}: {amount: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a return_funds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Return funds from asset manager to vault
   */
  return_funds: ({amount}: {amount: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a fulfill_withdrawal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Fulfill a withdrawal request by request ID
   */
  fulfill_withdrawal: ({user, request_id}: {user: string, request_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a accrue_management_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accrue management fee (anyone can call)
   */
  accrue_management_fee: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a accept_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accept a pending price update
   */
  accept_price: ({manager_auth, processor_auth, oracle_auth}: {manager_auth: Option<string>, processor_auth: Option<string>, oracle_auth: Option<string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a reject_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Reject a pending price update (manager only)
   */
  reject_price: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a cancel_withdrawal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Cancel a withdrawal request
   */
  cancel_withdrawal: ({caller, request_id}: {caller: string, request_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a withdraw_unexpected_deposits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Withdraw unexpected deposits immediately
   */
  withdraw_unexpected_deposits: ({token_mint, amount}: {token_mint: string, amount: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a pause_vault transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pause the vault (emergency mode)
   */
  pause_vault: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a unpause_vault transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Unpause the vault
   */
  unpause_vault: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a emergency_withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Emergency withdrawal when vault is paused
   */
  emergency_withdraw: ({token_mint, amount}: {token_mint: string, amount: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a add_user_to_whitelist transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Add a user to the vault whitelist
   */
  add_user_to_whitelist: ({user_to_add}: {user_to_add: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a propose_whitelist transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Propose whitelist toggle (starts cooldown period)
   */
  propose_whitelist: ({enabled}: {enabled: boolean}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a accept_whitelist transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accept pending whitelist changes after cooldown
   */
  accept_whitelist: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a remove_user_from_whitelist transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Remove a user from the vault whitelist
   */
  remove_user_from_whitelist: ({user_to_remove}: {user_to_remove: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a swap_tokens transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Swap tokens between two s-token vaults with the same underlying token and asset manager
   */
  swap_tokens: ({caller, destination_vault, source_amount, swap_fee_bps, min_destination_amount}: {caller: string, destination_vault: string, source_amount: u64, swap_fee_bps: u32, min_destination_amount: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a propose_cooldowns transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Propose cooldown parameter changes (starts cooldown period)
   */
  propose_cooldowns: ({new_price_update_cooldown_secs, new_price_acceptance_cooldown, new_config_cooldown_secs, new_emergency_withdraw_cldwn, new_role_change_cooldown_secs, new_fee_change_cooldown_secs}: {new_price_update_cooldown_secs: Option<u64>, new_price_acceptance_cooldown: Option<u64>, new_config_cooldown_secs: Option<u64>, new_emergency_withdraw_cldwn: Option<u64>, new_role_change_cooldown_secs: Option<u64>, new_fee_change_cooldown_secs: Option<u64>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a accept_cooldowns transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accept pending cooldown changes after cooldown
   */
  accept_cooldowns: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a accept_allowlist_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Accept allowlist mint - this should be the address of the vault that is being swapped to
   */
  accept_allowlist_mint: ({mint}: {mint: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a cancel_allowlist_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  cancel_allowlist_mint: ({mint}: {mint: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a write_vault_total_shares transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  write_vault_total_shares: ({mint, shares}: {mint: string, shares: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a total_idle transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_idle: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a total_shares transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_shares: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a is_paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_paused: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  price: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a asset_manager transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  asset_manager: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a accountant transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  accountant: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a whitelist_enabled transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  whitelist_enabled: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a is_whitelisted transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_whitelisted: ({caller}: {caller: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a min_shares_to_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  min_shares_to_mint: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_withdraw_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_withdraw_request: ({request_id}: {request_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<readonly [u64, u64, u64, u64]>>

  /**
   * Construct and simulate a theoretical_out transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  theoretical_out: ({shares, price}: {shares: u64, price: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a total_withdrawals_pending transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_withdrawals_pending: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a shares_in_custody transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  shares_in_custody: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_supply: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({account}: {account: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  allowance: ({owner, spender}: {owner: string, spender: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_from: ({spender, from, to, amount}: {spender: string, from: string, to: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve: ({owner, spender, amount, live_until_ledger}: {owner: string, spender: string, amount: i128, live_until_ledger: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  decimals: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  name: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  symbol: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a query_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_asset: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a total_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_assets: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a convert_to_shares transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  convert_to_shares: ({assets}: {assets: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a convert_to_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  convert_to_assets: ({shares}: {shares: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a max_deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  max_deposit: ({account}: {account: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a preview_deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  preview_deposit: ({assets}: {assets: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({_assets, _caller, _receiver}: {_assets: i128, _caller: string, _receiver: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a max_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  max_mint: ({account}: {account: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a preview_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  preview_mint: ({shares}: {shares: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint: ({_shares, _caller, _receiver}: {_shares: i128, _caller: string, _receiver: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a max_withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  max_withdraw: ({account}: {account: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a preview_withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  preview_withdraw: ({assets}: {assets: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({assets, caller, receiver, owner}: {assets: i128, caller: string, receiver: string, owner: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a max_redeem transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  max_redeem: ({account}: {account: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a preview_redeem transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  preview_redeem: ({shares}: {shares: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a redeem transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  redeem: ({shares, caller, receiver, owner}: {shares: i128, caller: string, receiver: string, owner: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAACdFcnJvciBjb2RlcyBmb3IgdGhlIFNUb2tlbkNvcmUgY29udHJhY3QAAAAAAAAAAA9TVG9rZW5Db3JlRXJyb3IAAAAAMgAAAAAAAAAMVW5hdXRob3JpemVkAAAAAQAAAAAAAAAKSW52YWxpZEZlZQAAAAAAAgAAAAAAAAAMSW52YWxpZFByaWNlAAAAAwAAAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAAQAAAAAAAAAD0ludmFsaWRBcmd1bWVudAAAAAAFAAAAAAAAABNJbnN1ZmZpY2llbnRCYWxhbmNlAAAAAAYAAAAAAAAAEkluc3VmZmljaWVudFNoYXJlcwAAAAAABwAAAAAAAAAMTWF0aE92ZXJmbG93AAAACAAAAAAAAAAVSW52YWxpZFVuZGVybHlpbmdNaW50AAAAAAAACQAAAAAAAAARSW52YWxpZFNoYXJlc01pbnQAAAAAAAAKAAAAAAAAABdJbnZhbGlkVG9rZW5BY2NvdW50TWludAAAAAALAAAAAAAAABhJbnZhbGlkVG9rZW5BY2NvdW50T3duZXIAAAAMAAAAAAAAABFJbnZhbGlkQXRhQWRkcmVzcwAAAAAAAA0AAAAAAAAAE0ludmFsaWRUb2tlblByb2dyYW0AAAAADgAAAAAAAAATVmF1bHROb3RJbml0aWFsaXplZAAAAAAPAAAAAAAAABlXaXRoZHJhd2FsUmVxdWVzdE5vdEZvdW5kAAAAAAAAEAAAAAAAAAAWV2l0aGRyYXdhbEFtb3VudFRvb0xvdwAAAAAAEQAAAAAAAAAQSW52YWxpZFRpbWVzdGFtcAAAABIAAAAAAAAAE0ZlZUNhbGN1bGF0aW9uRXJyb3IAAAAAEwAAAAAAAAALUHJpY2VUb29PbGQAAAAAFAAAAAAAAAANSW52YWxpZE9yYWNsZQAAAAAAABUAAAAAAAAADkludmFsaWRNYW5hZ2VyAAAAAAAWAAAAAAAAABhJbnZhbGlkV2l0aGRyYXdhbE1pbmltdW0AAAAXAAAAAAAAAA5NaW5pbXVtVG9vSGlnaAAAAAAAGAAAAAAAAAATSW52YWxpZEFzc2V0TWFuYWdlcgAAAAAZAAAAAAAAABRaZXJvU2hhcmVzQ2FsY3VsYXRlZAAAABoAAAAAAAAAFFplcm9BbW91bnRDYWxjdWxhdGVkAAAAGwAAAAAAAAASVXNlck5vdFdoaXRlbGlzdGVkAAAAAAAcAAAAAAAAABNXaGl0ZWxpc3ROb3RFbmFibGVkAAAAAB0AAAAAAAAAFldoaXRlbGlzdEFscmVhZHlFeGlzdHMAAAAAAB4AAAAAAAAADVdoaXRlbGlzdEZ1bGwAAAAAAAAfAAAAAAAAABlBZGRyZXNzQWxyZWFkeVdoaXRlbGlzdGVkAAAAAAAAIAAAAAAAAAAVQWRkcmVzc05vdFdoaXRlbGlzdGVkAAAAAAAAIQAAAAAAAAAQSW52YWxpZFdoaXRlbGlzdAAAACIAAAAAAAAAFEludmFsaWRVc2VyV2hpdGVsaXN0AAAAIwAAAAAAAAAWTWF4VG90YWxTaGFyZXNFeGNlZWRlZAAAAAAAJAAAAAAAAAAYTWF4U2hhcmVzUGVyVXNlckV4Y2VlZGVkAAAAJQAAAAAAAAAUTWF4VG90YWxJZGxlRXhjZWVkZWQAAAAmAAAAAAAAABBJbnZhbGlkUmVjaXBpZW50AAAAJwAAAAAAAAAUSW5pdGlhbGl6YXRpb25GYWlsZWQAAAAoAAAAAAAAABdQcmljZUNvb2xkb3duTm90RXhwaXJlZAAAAAApAAAAAAAAAA5TbGlwcGFnZU5vdE1ldAAAAAAAKgAAAAAAAAAMSW52YWxpZExpbWl0AAAAKwAAAAAAAAATTGltaXRFeGNlZWRzTWF4aW11bQAAAAAsAAAAAAAAABNNaW5pbXVtU2hhcmVzTm90TWV0AAAAAC0AAAAAAAAAGkxpbWl0c0NoYW5nZVRpbWVsb2NrQWN0aXZlAAAAAAAuAAAAAAAAABVOb1BlbmRpbmdMaW1pdHNDaGFuZ2UAAAAAAAAvAAAAAAAAAA9Ob0xpbWl0c0NoYW5nZXMAAAAAMAAAAAAAAAAWVXNlckFscmVhZHlXaGl0ZWxpc3RlZAAAAAAAMQAAAAAAAAALVmF1bHRQYXVzZWQAAAAAMg==",
        "AAAABAAAAAAAAAAAAAAAEVNUb2tlbk9yYWNsZUVycm9yAAAAAAAACAAAAAAAAAAMUHJpY2VQZW5kaW5nAAAAAQAAAAAAAAAOTm9QZW5kaW5nUHJpY2UAAAAAAAIAAAAAAAAAFVByaWNlRGV2aWF0aW9uVG9vSGlnaAAAAAAAAAMAAAAAAAAAF1ByaWNlQ29vbGRvd25Ob3RFeHBpcmVkAAAAAAQAAAAAAAAAFlByaWNlVXBkYXRlVG9vRnJlcXVlbnQAAAAAAAUAAAAAAAAAGUludmFsaWREZXZpYXRpb25UaHJlc2hvbGQAAAAAAAAGAAAAAAAAABFJbnZhbGlkT3JhY2xlRGF0YQAAAAAAAAcAAAAAAAAADEludmFsaWRQcmljZQAAAAg=",
        "AAAABAAAAAAAAAAAAAAAHFNUb2tlbldpdGhkcmF3YWxSZXF1ZXN0RXJyb3IAAAAOAAAAAAAAABZJbnZhbGlkV2l0aGRyYXdhbEluZGV4AAAAAAABAAAAAAAAABpXaXRoZHJhd2FsQWxyZWFkeUZ1bGZpbGxlZAAAAAAAAgAAAAAAAAAaV2l0aGRyYXdhbEFscmVhZHlDYW5jZWxsZWQAAAAAAAMAAAAAAAAAHkludmFsaWRXaXRoZHJhd2FsUmVxdWVzdFN0YXR1cwAAAAAABAAAAAAAAAAUV2l0aGRyYXdhbFF1ZXVlRW1wdHkAAAAFAAAAAAAAABBJbnZhbGlkQmF0Y2hTaXplAAAABgAAAAAAAAALVmF1bHRQYXVzZWQAAAAABwAAAAAAAAAYSW52YWxpZFdpdGhkcmF3YWxSZXF1ZXN0AAAACAAAAAAAAAANVHRsTm90RXhwaXJlZAAAAAAAAAkAAAAAAAAAEkludmFsaWRVc2VyQWNjb3VudAAAAAAACgAAAAAAAAAMTWF0aE92ZXJmbG93AAAACwAAAAAAAAAVTWluaW11bUNhbm5vdEluY3JlYXNlAAAAAAAADAAAAAAAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAANAAAAAAAAABZJbnN1ZmZpY2llbnRWYXVsdEZ1bmRzAAAAAAAO",
        "AAAABAAAAAAAAAAAAAAAG1NUb2tlbkluYm91bmRUcmFuc2ZlcnNFcnJvcgAAAAACAAAAAAAAABROb1VuZXhwZWN0ZWREZXBvc2l0cwAAAAEAAAAAAAAAGlVuZXhwZWN0ZWREZXBvc2l0c0Nvb2xkb3duAAAAAAAC",
        "AAAABAAAAAAAAAAAAAAAHlNUb2tlbkVtZXJnZW5jeVdpdGhkcmF3YWxFcnJvcgAAAAAACgAAAAAAAAALVmF1bHRQYXVzZWQAAAAAAQAAAAAAAAAOVmF1bHROb3RQYXVzZWQAAAAAAAIAAAAAAAAADUVtZXJnZW5jeU9ubHkAAAAAAAADAAAAAAAAACFFbWVyZ2VuY3lXaXRoZHJhd2FsVGltZWxvY2tBY3RpdmUAAAAAAAAEAAAAAAAAACBFbWVyZ2VuY3lXaXRoZHJhd2FsVG9rZW5NaXNtYXRjaAAAAAUAAAAAAAAAIUVtZXJnZW5jeVdpdGhkcmF3YWxBbW91bnRNaXNtYXRjaAAAAAAAAAYAAAAAAAAADUludmFsaWRBbW91bnQAAAAAAAAHAAAAAAAAAA9JbnZhbGlkQXJndW1lbnQAAAAACAAAAAAAAAAXSW52YWxpZFRva2VuQWNjb3VudE1pbnQAAAAACQAAAAAAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAAK",
        "AAAABAAAAAAAAAAAAAAAIFNUb2tlbkNvbmZpZ3VyYXRpb25Db29sZG93bkVycm9yAAAABgAAAAAAAAATQ29uZmlnQ2hhbmdlUGVuZGluZwAAAAABAAAAAAAAABhDb25maWdDb29sZG93bk5vdEV4cGlyZWQAAAACAAAAAAAAABZOb0NvbmZpZ0NoYW5nZXNQZW5kaW5nAAAAAAADAAAAAAAAAA9Ob0NvbmZpZ0NoYW5nZXMAAAAABAAAAAAAAAAVVG9vTWFueVBlbmRpbmdDaGFuZ2VzAAAAAAAABQAAAAAAAAATSW52YWxpZENvbmZpZ0NoYW5nZQAAAAAG",
        "AAAABAAAAAAAAAAAAAAAHFNUb2tlbkZ1bGZpbGxXaXRoZHJhd2FsRXJyb3IAAAADAAAAAAAAABhJbnZhbGlkV2l0aGRyYXdhbFJlcXVlc3QAAAABAAAAAAAAABdJbnZhbGlkVXNlclRva2VuQWNjb3VudAAAAAACAAAAAAAAABZJbnN1ZmZpY2llbnRWYXVsdEZ1bmRzAAAAAAAD",
        "AAAABAAAAAAAAAAAAAAAFVNUb2tlblJvbGVDaGFuZ2VFcnJvcgAAAAAAAAMAAAAAAAAAGFJvbGVDaGFuZ2VUaW1lbG9ja0FjdGl2ZQAAAAEAAAAAAAAAC0ludmFsaWRSb2xlAAAAAAIAAAAAAAAAFE5vUGVuZGluZ1JvbGVzQ2hhbmdlAAAAAw==",
        "AAAABAAAAAAAAAAAAAAAFFNUb2tlbkZlZUNoYW5nZUVycm9yAAAABAAAAAAAAAAXRmVlQ2hhbmdlVGltZWxvY2tBY3RpdmUAAAAAAQAAAAAAAAATTm9QZW5kaW5nRmVlc0NoYW5nZQAAAAACAAAAAAAAAAxOb0ZlZUNoYW5nZXMAAAADAAAAAAAAAApJbnZhbGlkRmVlAAAAAAAE",
        "AAAABAAAAAAAAAAAAAAAGVNUb2tlbkNvb2xkb3duQ2hhbmdlRXJyb3IAAAAAAAAFAAAAAAAAABxDb29sZG93bkNoYW5nZVRpbWVsb2NrQWN0aXZlAAAAAQAAAAAAAAAXTm9QZW5kaW5nQ29vbGRvd25DaGFuZ2UAAAAAAgAAAAAAAAARTm9Db29sZG93bkNoYW5nZXMAAAAAAAADAAAAAAAAACVDb29sZG93blVwZGF0ZUJsb2NrZWRCeVBlbmRpbmdDaGFuZ2VzAAAAAAAABAAAAAAAAAAXSW52YWxpZENvb2xkb3duRHVyYXRpb24AAAAABQ==",
        "AAAABAAAAAAAAAAAAAAAGlNUb2tlbldoaXRlbGlzdENoYW5nZUVycm9yAAAAAAADAAAAAAAAAB1XaGl0ZWxpc3RDaGFuZ2VUaW1lbG9ja0FjdGl2ZQAAAAAAAAEAAAAAAAAAGE5vUGVuZGluZ1doaXRlbGlzdENoYW5nZQAAAAIAAAAAAAAAEk5vV2hpdGVsaXN0Q2hhbmdlcwAAAAAAAw==",
        "AAAABAAAAAAAAAAAAAAAD1NUb2tlblN3YXBFcnJvcgAAAAAPAAAAAAAAABRJbnZhbGlkU3dhcFNhbWVWYXVsdAAAAAEAAAAAAAAAHEluY29tcGF0aWJsZVVuZGVybHlpbmdUb2tlbnMAAAACAAAAAAAAABNNaXNzaW5nQXNzZXRNYW5hZ2VyAAAAAAMAAAAAAAAADkludmFsaWRTd2FwRmVlAAAAAAAEAAAAAAAAAA5aZXJvU3dhcEFtb3VudAAAAAAABQAAAAAAAAASU3dhcEFtb3VudFRvb1NtYWxsAAAAAAAGAAAAAAAAABZVbmRlcmx5aW5nTWludE1pc21hdGNoAAAAAAAHAAAAAAAAABtWYXVsdHNNdXN0SGF2ZUFzc2V0TWFuYWdlcnMAAAAACAAAAAAAAAAUQXNzZXRNYW5hZ2VyTWlzbWF0Y2gAAAAJAAAAAAAAAAtWYXVsdFBhdXNlZAAAAAAKAAAAAAAAAAxNYXRoT3ZlcmZsb3cAAAALAAAAAAAAABRUb2tlbkRlY2ltYWxNaXNtYXRjaAAAAAwAAAAAAAAAElVzZXJOb3RXaGl0ZWxpc3RlZAAAAAAADQAAAAAAAAAOU2xpcHBhZ2VOb3RNZXQAAAAAAA4AAAAAAAAAE01pbmltdW1TaGFyZXNOb3RNZXQAAAAADw==",
        "AAAABAAAAAAAAAAAAAAAHlNUb2tlbldpdGhkcmF3YWxMaWZlY3ljbGVFcnJvcgAAAAAACQAAAAAAAAAVTWluaW11bUNhbm5vdEluY3JlYXNlAAAAAAAAAQAAAAAAAAAVSW5zdWZmaWNpZW50TGlxdWlkaXR5AAAAAAAAAgAAAAAAAAAbUHJpY2VEcm9wRXhjZWVkc0Rvd25zaWRlQ2FwAAAAAAMAAAAAAAAAF1dpdGhkcmF3YWxUdGxOb3RFeHBpcmVkAAAAAAQAAAAAAAAAGEludmFsaWRXaXRoZHJhd2FsTWluaW11bQAAAAUAAAAAAAAAGEJvdENhbmNlbGxhdGlvbkZvcmJpZGRlbgAAAAYAAAAAAAAAFldpdGhkcmF3YWxBbW91bnRUb29Mb3cAAAAAAAcAAAAAAAAADk1pbmltdW1Ub29IaWdoAAAAAAAIAAAAAAAAABRUb2tlbkRlY2ltYWxNaXNtYXRjaAAAAAk=",
        "AAAABAAAAAAAAAAAAAAAGFNUb2tlbkFsbG93bGlzdE1pbnRFcnJvcgAAAAMAAAAAAAAAFEFzc2V0TWFuYWdlck1pc21hdGNoAAAAAQAAAAAAAAAOTm90SW5BbGxvd2xpc3QAAAAAAAIAAAAAAAAAC1ZhdWx0UGF1c2VkAAAAAAM=",
        "AAAAAQAAAAAAAAAAAAAAD1ZhdWx0SW5pdENvbmZpZwAAAAAbAAAAAAAAAAphY2NvdW50YW50AAAAAAATAAAAAAAAAA1hc3NldF9tYW5hZ2VyAAAAAAAAEwAAAAAAAAAJYXV0aG9yaXR5AAAAAAAAEwAAAAAAAAAUY29uZmlnX2Nvb2xkb3duX3NlY3MAAAPoAAAABgAAAAAAAAAPZGVwb3NpdF9mZWVfYnBzAAAAAAQAAAAAAAAAEGRvd25zaWRlX2NhcF9icHMAAAPoAAAABAAAAAAAAAAUZWFybHlfY2FuY2VsX2ZlZV9icHMAAAPoAAAABAAAAAAAAAAdZW1lcmdlbmN5X3dpdGhkcmF3YWxfY29vbGRvd24AAAAAAAPoAAAABgAAAAAAAAAYZmVlX2NoYW5nZV9jb29sZG93bl9zZWNzAAAD6AAAAAYAAAAAAAAADWluaXRpYWxfcHJpY2UAAAAAAAPoAAAABgAAAAAAAAAbbWFuYWdlbWVudF9mZWVfYnBzX3Blcl95ZWFyAAAAAAQAAAAAAAAAB21hbmFnZXIAAAAAEwAAAAAAAAARbWF4X2RldmlhdGlvbl9icHMAAAAAAAPoAAAABAAAAAAAAAATbWF4X3NoYXJlc19wZXJfdXNlcgAAAAPoAAAABgAAAAAAAAAObWF4X3RvdGFsX2lkbGUAAAAAA+gAAAAGAAAAAAAAABBtYXhfdG90YWxfc2hhcmVzAAAD6AAAAAYAAAAAAAAAEm1pbl9zaGFyZXNfdG9fbWludAAAAAAD6AAAAAYAAAAAAAAABm9yYWNsZQAAAAAAEwAAAAAAAAAecHJpY2VfYWNjZXB0YW5jZV9jb29sZG93bl9zZWNzAAAAAAPoAAAABgAAAAAAAAAacHJpY2VfdXBkYXRlX2Nvb2xkb3duX3NlY3MAAAAAA+gAAAAGAAAAAAAAAAlwcm9jZXNzb3IAAAAAAAATAAAAAAAAABlyb2xlX2NoYW5nZV9jb29sZG93bl9zZWNzAAAAAAAD6AAAAAYAAAAAAAAAEnN5c3RlbV9wZW5hbHR5X2JwcwAAAAAD6AAAAAQAAAAAAAAAD3VuZGVybHlpbmdfbWludAAAAAATAAAAAAAAABF3aGl0ZWxpc3RfZW5hYmxlZAAAAAAAA+gAAAABAAAAAAAAABB3aXRoZHJhd19mZWVfYnBzAAAABAAAAAAAAAATd2l0aGRyYXdhbF90dGxfc2VjcwAAAAPoAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADFBlbmRpbmdQcmljZQAAAAIAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAYAAAAAAAAABXZhbHVlAAAAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADFBlbmRpbmdSb2xlcwAAAAYAAAAAAAAADm5ld19hY2NvdW50YW50AAAAAAPoAAAAEwAAAAAAAAARbmV3X2Fzc2V0X21hbmFnZXIAAAAAAAPoAAAAEwAAAAAAAAALbmV3X21hbmFnZXIAAAAD6AAAABMAAAAAAAAACm5ld19vcmFjbGUAAAAAA+gAAAATAAAAAAAAAA1uZXdfcHJvY2Vzc29yAAAAAAAD6AAAABMAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAAC1BlbmRpbmdGZWVzAAAAAAQAAAAAAAAAE25ld19kZXBvc2l0X2ZlZV9icHMAAAAABAAAAAAAAAAebmV3X21hbmFnZW1lbnRfZmVlX2Jwc19wZXJ5ZWFyAAAAAAAEAAAAAAAAABRuZXdfd2l0aGRyYXdfZmVlX2JwcwAAAAQAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAADVBlbmRpbmdMaW1pdHMAAAAAAAAGAAAAAAAAABVuZXdfbWF4X2RldmlhdGlvbl9icHMAAAAAAAPoAAAABAAAAAAAAAAXbmV3X21heF9zaGFyZXNfcGVyX3VzZXIAAAAD6AAAAAYAAAAAAAAAEm5ld19tYXhfdG90YWxfaWRsZQAAAAAD6AAAAAYAAAAAAAAAFG5ld19tYXhfdG90YWxfc2hhcmVzAAAD6AAAAAYAAAAAAAAAFm5ld19taW5fc2hhcmVzX3RvX21pbnQAAAAAA+gAAAAGAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAAAQAAAAAAAAAAAAAAEFBlbmRpbmdXaGl0ZWxpc3QAAAACAAAAAAAAAAtuZXdfZW5hYmxlZAAAAAABAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAAAQAAAAAAAAAAAAAAEFBlbmRpbmdDb29sZG93bnMAAAAHAAAAAAAAABhuZXdfY29uZmlnX2Nvb2xkb3duX3NlY3MAAAPoAAAABgAAAAAAAAAebmV3X2VtZXJnZW5jeV93aXRoZHJhd19jbGR3bl9zAAAAAAPoAAAABgAAAAAAAAAcbmV3X2ZlZV9jaGFuZ2VfY29vbGRvd25fc2VjcwAAA+gAAAAGAAAAAAAAABxuZXdfcHJpY2VfYWNjZXB0YW5jZV9jbGR3bl9zAAAD6AAAAAYAAAAAAAAAHm5ld19wcmljZV91cGRhdGVfY29vbGRvd25fc2VjcwAAAAAD6AAAAAYAAAAAAAAAHW5ld19yb2xlX2NoYW5nZV9jb29sZG93bl9zZWNzAAAAAAAD6AAAAAYAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAwAAAAAAAAAAAAAAF1dpdGhkcmF3YWxSZXF1ZXN0U3RhdHVzAAAAAAMAAAAAAAAAB1BFTkRJTkcAAAAAAQAAAAAAAAAJRlVMRklMTEVEAAAAAAAAAgAAAAAAAAAJQ0FOQ0VMTEVEAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAAEVdpdGhkcmF3YWxSZXF1ZXN0AAAAAAAACQAAAAAAAAAKYW1vdW50X2R1ZQAAAAAABgAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAAKZmVlX3NoYXJlcwAAAAAABgAAAAAAAAAObWluX2Ftb3VudF9vdXQAAAAAAAYAAAAAAAAAEHByaWNlX2F0X3JlcXVlc3QAAAAGAAAAAAAAAAxwcm9jZXNzZWRfYXQAAAPoAAAABgAAAAAAAAAGc2hhcmVzAAAAAAAGAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAAXV2l0aGRyYXdhbFJlcXVlc3RTdGF0dXMAAAAAAAAAAAR1c2VyAAAAEw==",
        "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAC8AAAAAAAAAAAAAAAlBdXRob3JpdHkAAAAAAAAAAAAAAAAAAAZPcmFjbGUAAAAAAAAAAAAAAAAAB01hbmFnZXIAAAAAAAAAAAAAAAAJUHJvY2Vzc29yAAAAAAAAAAAAAAAAAAAKQWNjb3VudGFudAAAAAAAAAAAAAAAAAAMQXNzZXRNYW5hZ2VyAAAAAAAAAAAAAAANRGVwb3NpdEZlZUJwcwAAAAAAAAAAAAAAAAAADldpdGhkcmF3RmVlQnBzAAAAAAAAAAAAAAAAABdNYW5hZ2VtZW50RmVlQnBzUGVyWWVhcgAAAAAAAAAAAAAAAA1MYXN0TWdtdEZlZVRzAAAAAAAAAAAAAAAAAAAFUHJpY2UAAAAAAAAAAAAAAAAAAAtUb3RhbFNoYXJlcwAAAAAAAAAAAAAAAAlUb3RhbElkbGUAAAAAAAAAAAAAAAAAABdUb3RhbFdpdGhkcmF3YWxzUGVuZGluZwAAAAAAAAAAAAAAAA9TaGFyZXNJbkN1c3RvZHkAAAAAAAAAAAAAAAAJQ3JlYXRlZEF0AAAAAAAAAAAAAAAAAAAOTWF4VG90YWxTaGFyZXMAAAAAAAAAAAAAAAAAEE1heFNoYXJlc1BlclVzZXIAAAAAAAAAAAAAAAxNYXhUb3RhbElkbGUAAAAAAAAAAAAAAA9NaW5TaGFyZXNUb01pbnQAAAAAAAAAAE9NYXhpbXVtIGFsbG93ZWQgcHJpY2UgZGV2aWF0aW9uIGluIGJhc2lzIHBvaW50cyBiZWZvcmUgbWFudWFsIGFwcHJvdmFsIHJlcXVpcmVkAAAAAA9NYXhEZXZpYXRpb25CcHMAAAAAAAAAADJMYXN0IHByaWNlIHVwZGF0ZSB0aW1lc3RhbXAgZm9yIGRldmlhdGlvbiBjb29sZG93bgAAAAAAGExhc3RQcmljZVVwZGF0ZVRpbWVzdGFtcAAAAAAAAAAnU3RvcmFnZSBmb3Igd2l0aGRyYXdhbCBzZXF1ZW5jZSBjb3VudGVyAAAAABBOZXh0V2l0aGRyYXdhbElkAAAAAAAAADxDb29sZG93biBwZXJpb2QgYmV0d2VlbiBwcmljZSB1cGRhdGVzIGZvciBkZXZpYXRpb24gY2hlY2tpbmcAAAAXUHJpY2VVcGRhdGVDb29sZG93blNlY3MAAAAAAAAAAEZDb29sZG93biBwZXJpb2QgaW4gc2Vjb25kcyBhZnRlciB3aGljaCBhbnlvbmUgY2FuIGFjY2VwdCBwZW5kaW5nIHByaWNlAAAAAAAbUHJpY2VBY2NlcHRhbmNlQ29vbGRvd25TZWNzAAAAAAAAAABeTmV3IHdpdGhkcmF3YWwgbGlmZWN5Y2xlIHBhcmFtZXRlcnMKTWF4aW11bSBuZWdhdGl2ZSBzbGlwcGFnZSBib3QgbWF5IGFic29yYiAoaW4gYmFzaXMgcG9pbnRzKQAAAAAADkRvd25zaWRlQ2FwQnBzAAAAAAAAAAAAR1RpbWUtdG8tbGl2ZSBhZnRlciB3aGljaCByZXF1ZXN0IGNhbiBiZSBjYW5jZWxsZWQgZmVlLWZyZWUgKGluIHNlY29uZHMpAAAAABFXaXRoZHJhd2FsVHRsU2VjcwAAAAAAAAAAAAA+UGVuYWx0eSBmb3IgdXNlci1pbml0aWF0ZWQgY2FuY2VsIGJlZm9yZSBUVEwgKGluIGJhc2lzIHBvaW50cykAAAAAABFFYXJseUNhbmNlbEZlZUJwcwAAAAAAAAAAAABLRXh0cmEgc2hhcmVzIG1pbnRlZCB0byB1c2VyIHdoZW4gY2FuY2VsIGhhcHBlbnMgYWZ0ZXIgVFRMIChpbiBiYXNpcyBwb2ludHMpAAAAABBTeXN0ZW1QZW5hbHR5QnBzAAAAAAAAABZXaGl0ZWxpc3QgZW5hYmxlZCBmbGFnAAAAAAAQV2hpdGVsaXN0RW5hYmxlZAAAAAEAAAATSXMgdXNlciB3aGl0ZWxpc3RlZAAAAAANSXNXaGl0ZWxpc3RlZAAAAAAAAAEAAAATAAAAAAAAABFWYXVsdCBwYXVzZSBzdGF0ZQAAAAAAAAZQYXVzZWQAAAAAAAAAAAA5Um9sZSBjaGFuZ2UgY29vbGRvd24gcGVyaW9kIGluIHNlY29uZHMgKGRlZmF1bHQgNDggaG91cnMpAAAAAAAAFlJvbGVDaGFuZ2VDb29sZG93blNlY3MAAAAAAAAAAAA8RGVmYXVsdCBjb29sZG93biBwZXJpb2QgZm9yIGNvbmZpZ3VyYXRpb24gY2hhbmdlcyBpbiBzZWNvbmRzAAAAEkNvbmZpZ0Nvb2xkb3duU2VjcwAAAAAAAAAAADhGZWUgY2hhbmdlIGNvb2xkb3duIHBlcmlvZCBpbiBzZWNvbmRzIChkZWZhdWx0IDI0IGhvdXJzKQAAABVGZWVDaGFuZ2VDb29sZG93blNlY3MAAAAAAAAAAAAAJlBlbmRpbmcgcHJpY2UgdXBkYXRlIGF3YWl0aW5nIGFwcHJvdmFsAAAAAAAMUGVuZGluZ1ByaWNlAAAAAAAAACZQZW5kaW5nIHJvbGVzIGNoYW5nZSBhd2FpdGluZyBhcHByb3ZhbAAAAAAADFBlbmRpbmdSb2xlcwAAAAAAAAAlUGVuZGluZyBmZWUgY2hhbmdlcyBhd2FpdGluZyBhcHByb3ZhbAAAAAAAAAtQZW5kaW5nRmVlcwAAAAAAAAAAKFBlbmRpbmcgbGltaXRzIGNoYW5nZXMgYXdhaXRpbmcgYXBwcm92YWwAAAANUGVuZGluZ0xpbWl0cwAAAAAAAAAAAAArUGVuZGluZyB3aGl0ZWxpc3QgY2hhbmdlcyBhd2FpdGluZyBhcHByb3ZhbAAAAAAQUGVuZGluZ1doaXRlbGlzdAAAAAAAAAAqUGVuZGluZyBjb29sZG93biBjaGFuZ2VzIGF3YWl0aW5nIGFwcHJvdmFsAAAAAAAQUGVuZGluZ0Nvb2xkb3ducwAAAAAAAAArRW1lcmdlbmN5IHdpdGhkcmF3YWwgdGltZWxvY2sgZW5kIHRpbWVzdGFtcAAAAAAcRW1lcmdlbmN5V2l0aGRyYXdUaW1lbG9ja0VuZAAAAAAAAABCRW1lcmdlbmN5IHdpdGhkcmF3YWwgY29vbGRvd24gcGVyaW9kIGluIHNlY29uZHMgKGRlZmF1bHQgMjQgaG91cnMpAAAAAAAbRW1lcmdlbmN5V2l0aGRyYXdhbENvb2xkb3duAAAAAAAAAABLUGVuZGluZyBlbWVyZ2VuY3kgd2l0aGRyYXdhbCByZXF1ZXN0IHRva2VuIG1pbnQgKE5vbmUgaWYgbm8gYWN0aXZlIHJlcXVlc3QpAAAAABpFbWVyZ2VuY3lXaXRoZHJhd1Rva2VuTWludAAAAAAAAAAAAERQZW5kaW5nIGVtZXJnZW5jeSB3aXRoZHJhd2FsIHJlcXVlc3QgYW1vdW50ICgwIGlmIG5vIGFjdGl2ZSByZXF1ZXN0KQAAABlFbWVyZ2VuY3lXaXRoZHJhd2FsQW1vdW50AAAAAAAAAQAAABdXaXRoZHJhd2FsIHJlcXVlc3QgZGF0YQAAAAAPV2l0aGRyYXdSZXF1ZXN0AAAAAAEAAAAGAAAAAQAAADRBbGxvd2xpc3QgZm9yIG1pbnQgLSBuZWVkZWQgZm9yIHN3YXBzIGJldHdlZW4gdmF1bHRzAAAADUFsbG93bGlzdE1pbnQAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAGY29uZmlnAAAAAAfQAAAAD1ZhdWx0SW5pdENvbmZpZwAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA9TVG9rZW5Db3JlRXJyb3IA",
        "AAAAAAAAAAAAAAAJbWludF9jb3JlAAAAAAAAAwAAAAAAAAAEbWludAAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAABhTVG9rZW5BbGxvd2xpc3RNaW50RXJyb3I=",
        "AAAAAAAAABpQcm9wb3NlIHZhdWx0IHJvbGUgY2hhbmdlcwAAAAAADXByb3Bvc2Vfcm9sZXMAAAAAAAAFAAAAAAAAAAtuZXdfbWFuYWdlcgAAAAPoAAAAEwAAAAAAAAANbmV3X3Byb2Nlc3NvcgAAAAAAA+gAAAATAAAAAAAAAA5uZXdfYWNjb3VudGFudAAAAAAD6AAAABMAAAAAAAAACm5ld19vcmFjbGUAAAAAA+gAAAATAAAAAAAAABFuZXdfYXNzZXRfbWFuYWdlcgAAAAAAA+gAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAVU1Rva2VuUm9sZUNoYW5nZUVycm9yAAAA",
        "AAAAAAAAACpBY2NlcHQgcGVuZGluZyByb2xlIGNoYW5nZXMgYWZ0ZXIgY29vbGRvd24AAAAAAAxhY2NlcHRfcm9sZXMAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAVU1Rva2VuUm9sZUNoYW5nZUVycm9yAAAA",
        "AAAAAAAAADZQcm9wb3NlIGZlZSBwYXJhbWV0ZXIgY2hhbmdlcyAoc3RhcnRzIGNvb2xkb3duIHBlcmlvZCkAAAAAAAxwcm9wb3NlX2ZlZXMAAAADAAAAAAAAAA9kZXBvc2l0X2ZlZV9icHMAAAAABAAAAAAAAAAQd2l0aGRyYXdfZmVlX2JwcwAAAAQAAAAAAAAAG21hbmFnZW1lbnRfZmVlX2Jwc19wZXJfeWVhcgAAAAAEAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAUU1Rva2VuRmVlQ2hhbmdlRXJyb3I=",
        "AAAAAAAAAClBY2NlcHQgcGVuZGluZyBmZWUgY2hhbmdlcyBhZnRlciBjb29sZG93bgAAAAAAAAthY2NlcHRfZmVlcwAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAUU1Rva2VuRmVlQ2hhbmdlRXJyb3I=",
        "AAAAAAAAADlQcm9wb3NlIGxpbWl0cyBwYXJhbWV0ZXIgY2hhbmdlcyAoc3RhcnRzIGNvb2xkb3duIHBlcmlvZCkAAAAAAAAOcHJvcG9zZV9saW1pdHMAAAAAAAUAAAAAAAAAFG5ld19tYXhfdG90YWxfc2hhcmVzAAAD6AAAAAYAAAAAAAAAF25ld19tYXhfc2hhcmVzX3Blcl91c2VyAAAAA+gAAAAGAAAAAAAAABJuZXdfbWF4X3RvdGFsX2lkbGUAAAAAA+gAAAAGAAAAAAAAABVuZXdfbWF4X2RldmlhdGlvbl9icHMAAAAAAAPoAAAABAAAAAAAAAAWbmV3X21pbl9zaGFyZXNfdG9fbWludAAAAAAD6AAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA9TVG9rZW5Db3JlRXJyb3IA",
        "AAAAAAAAACxBY2NlcHQgcGVuZGluZyBsaW1pdHMgY2hhbmdlcyBhZnRlciBjb29sZG93bgAAAA1hY2NlcHRfbGltaXRzAAAAAAAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAD1NUb2tlbkNvcmVFcnJvcgA=",
        "AAAAAAAAADRVcGRhdGUgUy1Ub2tlbiBwcmljZSAod2l0aCBzZWN1cmUgcHJpY2UgZmxvdyBmb3IgdjIpAAAADHVwZGF0ZV9wcmljZQAAAAEAAAAAAAAACW5ld19wcmljZQAAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAABFTVG9rZW5PcmFjbGVFcnJvcgAAAA==",
        "AAAAAAAAAC1EZXBvc2l0IHVuZGVybHlpbmcgdG9rZW5zIHRvIHJlY2VpdmUgUy1Ub2tlbnMAAAAAAAAMZGVwb3NpdF9jb3JlAAAABAAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACm1pbl9zaGFyZXMAAAAAA+gAAAAGAAAAAAAAAAtiZW5lZmljaWFyeQAAAAPoAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAD1NUb2tlbkNvcmVFcnJvcgA=",
        "AAAAAAAAAB5SZXF1ZXN0IHdpdGhkcmF3YWwgb2YgUy1Ub2tlbnMAAAAAABB3aXRoZHJhd19yZXF1ZXN0AAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAZzaGFyZXMAAAAAAAYAAAAAAAAADm1pbl9hbW91bnRfb3V0AAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAPU1Rva2VuQ29yZUVycm9yAA==",
        "AAAAAAAAAEFVcGRhdGUgbWluaW11bSBhY2NlcHRhYmxlIHBheW91dCBmb3IgYSBwZW5kaW5nIHdpdGhkcmF3YWwgcmVxdWVzdAAAAAAAABl1cGRhdGVfd2l0aGRyYXdhbF9taW5pbXVtAAAAAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAApyZXF1ZXN0X2lkAAAAAAAGAAAAAAAAAAtuZXdfbWluaW11bQAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAcU1Rva2VuV2l0aGRyYXdhbFJlcXVlc3RFcnJvcg==",
        "AAAAAAAAAChQcm9jZXNzIHF1ZXVlZCBkZXBvc2l0cyAocHJvY2Vzc29yIG9ubHkpAAAAEHByb2Nlc3NfZGVwb3NpdHMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA9TVG9rZW5Db3JlRXJyb3IA",
        "AAAAAAAAAChSZXR1cm4gZnVuZHMgZnJvbSBhc3NldCBtYW5hZ2VyIHRvIHZhdWx0AAAADHJldHVybl9mdW5kcwAAAAEAAAAAAAAABmFtb3VudAAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAD1NUb2tlbkNvcmVFcnJvcgA=",
        "AAAAAAAAACpGdWxmaWxsIGEgd2l0aGRyYXdhbCByZXF1ZXN0IGJ5IHJlcXVlc3QgSUQAAAAAABJmdWxmaWxsX3dpdGhkcmF3YWwAAAAAAAIAAAAAAAAABHVzZXIAAAATAAAAAAAAAApyZXF1ZXN0X2lkAAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAcU1Rva2VuV2l0aGRyYXdhbFJlcXVlc3RFcnJvcg==",
        "AAAAAAAAACdBY2NydWUgbWFuYWdlbWVudCBmZWUgKGFueW9uZSBjYW4gY2FsbCkAAAAAFWFjY3J1ZV9tYW5hZ2VtZW50X2ZlZQAAAAAAAAAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA9TVG9rZW5Db3JlRXJyb3IA",
        "AAAAAAAAAB1BY2NlcHQgYSBwZW5kaW5nIHByaWNlIHVwZGF0ZQAAAAAAAAxhY2NlcHRfcHJpY2UAAAADAAAAAAAAAAxtYW5hZ2VyX2F1dGgAAAPoAAAAEwAAAAAAAAAOcHJvY2Vzc29yX2F1dGgAAAAAA+gAAAATAAAAAAAAAAtvcmFjbGVfYXV0aAAAAAPoAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAD1NUb2tlbkNvcmVFcnJvcgA=",
        "AAAAAAAAACxSZWplY3QgYSBwZW5kaW5nIHByaWNlIHVwZGF0ZSAobWFuYWdlciBvbmx5KQAAAAxyZWplY3RfcHJpY2UAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAPU1Rva2VuQ29yZUVycm9yAA==",
        "AAAAAAAAABtDYW5jZWwgYSB3aXRoZHJhd2FsIHJlcXVlc3QAAAAAEWNhbmNlbF93aXRoZHJhd2FsAAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAApyZXF1ZXN0X2lkAAAAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAcU1Rva2VuV2l0aGRyYXdhbFJlcXVlc3RFcnJvcg==",
        "AAAAAAAAAChXaXRoZHJhdyB1bmV4cGVjdGVkIGRlcG9zaXRzIGltbWVkaWF0ZWx5AAAAHHdpdGhkcmF3X3VuZXhwZWN0ZWRfZGVwb3NpdHMAAAACAAAAAAAAAAp0b2tlbl9taW50AAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA9TVG9rZW5Db3JlRXJyb3IA",
        "AAAAAAAAACBQYXVzZSB0aGUgdmF1bHQgKGVtZXJnZW5jeSBtb2RlKQAAAAtwYXVzZV92YXVsdAAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAeU1Rva2VuRW1lcmdlbmN5V2l0aGRyYXdhbEVycm9yAAA=",
        "AAAAAAAAABFVbnBhdXNlIHRoZSB2YXVsdAAAAAAAAA11bnBhdXNlX3ZhdWx0AAAAAAAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAHlNUb2tlbkVtZXJnZW5jeVdpdGhkcmF3YWxFcnJvcgAA",
        "AAAAAAAAAClFbWVyZ2VuY3kgd2l0aGRyYXdhbCB3aGVuIHZhdWx0IGlzIHBhdXNlZAAAAAAAABJlbWVyZ2VuY3lfd2l0aGRyYXcAAAAAAAIAAAAAAAAACnRva2VuX21pbnQAAAAAABMAAAAAAAAABmFtb3VudAAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAHlNUb2tlbkVtZXJnZW5jeVdpdGhkcmF3YWxFcnJvcgAA",
        "AAAAAAAAACFBZGQgYSB1c2VyIHRvIHRoZSB2YXVsdCB3aGl0ZWxpc3QAAAAAAAAVYWRkX3VzZXJfdG9fd2hpdGVsaXN0AAAAAAAAAQAAAAAAAAALdXNlcl90b19hZGQAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAD1NUb2tlbkNvcmVFcnJvcgA=",
        "AAAAAAAAADFQcm9wb3NlIHdoaXRlbGlzdCB0b2dnbGUgKHN0YXJ0cyBjb29sZG93biBwZXJpb2QpAAAAAAAAEXByb3Bvc2Vfd2hpdGVsaXN0AAAAAAAAAQAAAAAAAAAHZW5hYmxlZAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAaU1Rva2VuV2hpdGVsaXN0Q2hhbmdlRXJyb3IAAA==",
        "AAAAAAAAAC9BY2NlcHQgcGVuZGluZyB3aGl0ZWxpc3QgY2hhbmdlcyBhZnRlciBjb29sZG93bgAAAAAQYWNjZXB0X3doaXRlbGlzdAAAAAAAAAABAAAD6QAAA+0AAAAAAAAH0AAAABpTVG9rZW5XaGl0ZWxpc3RDaGFuZ2VFcnJvcgAA",
        "AAAAAAAAACZSZW1vdmUgYSB1c2VyIGZyb20gdGhlIHZhdWx0IHdoaXRlbGlzdAAAAAAAGnJlbW92ZV91c2VyX2Zyb21fd2hpdGVsaXN0AAAAAAABAAAAAAAAAA51c2VyX3RvX3JlbW92ZQAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAD1NUb2tlbkNvcmVFcnJvcgA=",
        "AAAAAAAAAFdTd2FwIHRva2VucyBiZXR3ZWVuIHR3byBzLXRva2VuIHZhdWx0cyB3aXRoIHRoZSBzYW1lIHVuZGVybHlpbmcgdG9rZW4gYW5kIGFzc2V0IG1hbmFnZXIAAAAAC3N3YXBfdG9rZW5zAAAAAAUAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAARZGVzdGluYXRpb25fdmF1bHQAAAAAAAATAAAAAAAAAA1zb3VyY2VfYW1vdW50AAAAAAAABgAAAAAAAAAMc3dhcF9mZWVfYnBzAAAABAAAAAAAAAAWbWluX2Rlc3RpbmF0aW9uX2Ftb3VudAAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAD1NUb2tlblN3YXBFcnJvcgA=",
        "AAAAAAAAADtQcm9wb3NlIGNvb2xkb3duIHBhcmFtZXRlciBjaGFuZ2VzIChzdGFydHMgY29vbGRvd24gcGVyaW9kKQAAAAARcHJvcG9zZV9jb29sZG93bnMAAAAAAAAGAAAAAAAAAB5uZXdfcHJpY2VfdXBkYXRlX2Nvb2xkb3duX3NlY3MAAAAAA+gAAAAGAAAAAAAAAB1uZXdfcHJpY2VfYWNjZXB0YW5jZV9jb29sZG93bgAAAAAAA+gAAAAGAAAAAAAAABhuZXdfY29uZmlnX2Nvb2xkb3duX3NlY3MAAAPoAAAABgAAAAAAAAAcbmV3X2VtZXJnZW5jeV93aXRoZHJhd19jbGR3bgAAA+gAAAAGAAAAAAAAAB1uZXdfcm9sZV9jaGFuZ2VfY29vbGRvd25fc2VjcwAAAAAAA+gAAAAGAAAAAAAAABxuZXdfZmVlX2NoYW5nZV9jb29sZG93bl9zZWNzAAAD6AAAAAYAAAABAAAD6QAAA+0AAAAAAAAH0AAAABlTVG9rZW5Db29sZG93bkNoYW5nZUVycm9yAAAA",
        "AAAAAAAAAC5BY2NlcHQgcGVuZGluZyBjb29sZG93biBjaGFuZ2VzIGFmdGVyIGNvb2xkb3duAAAAAAAQYWNjZXB0X2Nvb2xkb3ducwAAAAAAAAABAAAD6QAAA+0AAAAAAAAH0AAAABlTVG9rZW5Db29sZG93bkNoYW5nZUVycm9yAAAA",
        "AAAAAAAAAFhBY2NlcHQgYWxsb3dsaXN0IG1pbnQgLSB0aGlzIHNob3VsZCBiZSB0aGUgYWRkcmVzcyBvZiB0aGUgdmF1bHQgdGhhdCBpcyBiZWluZyBzd2FwcGVkIHRvAAAAFWFjY2VwdF9hbGxvd2xpc3RfbWludAAAAAAAAAEAAAAAAAAABG1pbnQAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAYU1Rva2VuQWxsb3dsaXN0TWludEVycm9y",
        "AAAAAAAAAAAAAAAVY2FuY2VsX2FsbG93bGlzdF9taW50AAAAAAAAAQAAAAAAAAAEbWludAAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAABhTVG9rZW5BbGxvd2xpc3RNaW50RXJyb3I=",
        "AAAAAAAAAAAAAAAYd3JpdGVfdmF1bHRfdG90YWxfc2hhcmVzAAAAAgAAAAAAAAAEbWludAAAABMAAAAAAAAABnNoYXJlcwAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAGFNUb2tlbkFsbG93bGlzdE1pbnRFcnJvcg==",
        "AAAAAAAAAAAAAAAKdG90YWxfaWRsZQAAAAAAAAAAAAEAAAAG",
        "AAAAAAAAAAAAAAAMdG90YWxfc2hhcmVzAAAAAAAAAAEAAAAG",
        "AAAAAAAAAAAAAAAJaXNfcGF1c2VkAAAAAAAAAAAAAAEAAAAB",
        "AAAAAAAAAAAAAAAFcHJpY2UAAAAAAAAAAAAAAQAAAAY=",
        "AAAAAAAAAAAAAAANYXNzZXRfbWFuYWdlcgAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAKYWNjb3VudGFudAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAARd2hpdGVsaXN0X2VuYWJsZWQAAAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAOaXNfd2hpdGVsaXN0ZWQAAAAAAAEAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAEAAAAB",
        "AAAAAAAAAAAAAAASbWluX3NoYXJlc190b19taW50AAAAAAAAAAAAAQAAAAY=",
        "AAAAAAAAAAAAAAAUZ2V0X3dpdGhkcmF3X3JlcXVlc3QAAAABAAAAAAAAAApyZXF1ZXN0X2lkAAAAAAAGAAAAAQAAA+0AAAAEAAAABgAAAAYAAAAGAAAABg==",
        "AAAAAAAAAAAAAAAPdGhlb3JldGljYWxfb3V0AAAAAAIAAAAAAAAABnNoYXJlcwAAAAAABgAAAAAAAAAFcHJpY2UAAAAAAAAGAAAAAQAAAAY=",
        "AAAAAAAAAAAAAAAZdG90YWxfd2l0aGRyYXdhbHNfcGVuZGluZwAAAAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAARc2hhcmVzX2luX2N1c3RvZHkAAAAAAAAAAAAAAQAAAAY=",
        "AAAAAAAAAAAAAAAMdG90YWxfc3VwcGx5AAAAAAAAAAEAAAAL",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAJYWxsb3dhbmNlAAAAAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdzcGVuZGVyAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAABFsaXZlX3VudGlsX2xlZGdlcgAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
        "AAAAAAAAAAAAAAALcXVlcnlfYXNzZXQAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAMdG90YWxfYXNzZXRzAAAAAAAAAAEAAAAL",
        "AAAAAAAAAAAAAAARY29udmVydF90b19zaGFyZXMAAAAAAAABAAAAAAAAAAZhc3NldHMAAAAAAAsAAAABAAAACw==",
        "AAAAAAAAAAAAAAARY29udmVydF90b19hc3NldHMAAAAAAAABAAAAAAAAAAZzaGFyZXMAAAAAAAsAAAABAAAACw==",
        "AAAAAAAAAAAAAAALbWF4X2RlcG9zaXQAAAAAAQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAPcHJldmlld19kZXBvc2l0AAAAAAEAAAAAAAAABmFzc2V0cwAAAAAACwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAAdfYXNzZXRzAAAAAAsAAAAAAAAAB19jYWxsZXIAAAAAEwAAAAAAAAAJX3JlY2VpdmVyAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAIbWF4X21pbnQAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAMcHJldmlld19taW50AAAAAQAAAAAAAAAGc2hhcmVzAAAAAAALAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAEbWludAAAAAMAAAAAAAAAB19zaGFyZXMAAAAACwAAAAAAAAAHX2NhbGxlcgAAAAATAAAAAAAAAAlfcmVjZWl2ZXIAAAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAMbWF4X3dpdGhkcmF3AAAAAQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAQcHJldmlld193aXRoZHJhdwAAAAEAAAAAAAAABmFzc2V0cwAAAAAACwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAEAAAAAAAAAAZhc3NldHMAAAAAAAsAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAIcmVjZWl2ZXIAAAATAAAAAAAAAAVvd25lcgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAKbWF4X3JlZGVlbQAAAAAAAQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAOcHJldmlld19yZWRlZW0AAAAAAAEAAAAAAAAABnNoYXJlcwAAAAAACwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAGcmVkZWVtAAAAAAAEAAAAAAAAAAZzaGFyZXMAAAAAAAsAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAIcmVjZWl2ZXIAAAATAAAAAAAAAAVvd25lcgAAAAAAABMAAAABAAAACw==",
        "AAAAAQAAAAAAAAAAAAAAD1ZhdWx0SW5pdENvbmZpZwAAAAAbAAAAAAAAAAphY2NvdW50YW50AAAAAAATAAAAAAAAAA1hc3NldF9tYW5hZ2VyAAAAAAAAEwAAAAAAAAAJYXV0aG9yaXR5AAAAAAAAEwAAAAAAAAAUY29uZmlnX2Nvb2xkb3duX3NlY3MAAAPoAAAABgAAAAAAAAAPZGVwb3NpdF9mZWVfYnBzAAAAAAQAAAAAAAAAEGRvd25zaWRlX2NhcF9icHMAAAPoAAAABAAAAAAAAAAUZWFybHlfY2FuY2VsX2ZlZV9icHMAAAPoAAAABAAAAAAAAAAdZW1lcmdlbmN5X3dpdGhkcmF3YWxfY29vbGRvd24AAAAAAAPoAAAABgAAAAAAAAAYZmVlX2NoYW5nZV9jb29sZG93bl9zZWNzAAAD6AAAAAYAAAAAAAAADWluaXRpYWxfcHJpY2UAAAAAAAPoAAAABgAAAAAAAAAbbWFuYWdlbWVudF9mZWVfYnBzX3Blcl95ZWFyAAAAAAQAAAAAAAAAB21hbmFnZXIAAAAAEwAAAAAAAAARbWF4X2RldmlhdGlvbl9icHMAAAAAAAPoAAAABAAAAAAAAAATbWF4X3NoYXJlc19wZXJfdXNlcgAAAAPoAAAABgAAAAAAAAAObWF4X3RvdGFsX2lkbGUAAAAAA+gAAAAGAAAAAAAAABBtYXhfdG90YWxfc2hhcmVzAAAD6AAAAAYAAAAAAAAAEm1pbl9zaGFyZXNfdG9fbWludAAAAAAD6AAAAAYAAAAAAAAABm9yYWNsZQAAAAAAEwAAAAAAAAAecHJpY2VfYWNjZXB0YW5jZV9jb29sZG93bl9zZWNzAAAAAAPoAAAABgAAAAAAAAAacHJpY2VfdXBkYXRlX2Nvb2xkb3duX3NlY3MAAAAAA+gAAAAGAAAAAAAAAAlwcm9jZXNzb3IAAAAAAAATAAAAAAAAABlyb2xlX2NoYW5nZV9jb29sZG93bl9zZWNzAAAAAAAD6AAAAAYAAAAAAAAAEnN5c3RlbV9wZW5hbHR5X2JwcwAAAAAD6AAAAAQAAAAAAAAAD3VuZGVybHlpbmdfbWludAAAAAATAAAAAAAAABF3aGl0ZWxpc3RfZW5hYmxlZAAAAAAAA+gAAAABAAAAAAAAABB3aXRoZHJhd19mZWVfYnBzAAAABAAAAAAAAAATd2l0aGRyYXdhbF90dGxfc2VjcwAAAAPoAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADFBlbmRpbmdQcmljZQAAAAIAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAYAAAAAAAAABXZhbHVlAAAAAAAD6AAAAAY=",
        "AAAAAQAAAAAAAAAAAAAADFBlbmRpbmdSb2xlcwAAAAYAAAAAAAAADm5ld19hY2NvdW50YW50AAAAAAPoAAAAEwAAAAAAAAARbmV3X2Fzc2V0X21hbmFnZXIAAAAAAAPoAAAAEwAAAAAAAAALbmV3X21hbmFnZXIAAAAD6AAAABMAAAAAAAAACm5ld19vcmFjbGUAAAAAA+gAAAATAAAAAAAAAA1uZXdfcHJvY2Vzc29yAAAAAAAD6AAAABMAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAAC1BlbmRpbmdGZWVzAAAAAAQAAAAAAAAAE25ld19kZXBvc2l0X2ZlZV9icHMAAAAD6AAAAAQAAAAAAAAAHm5ld19tYW5hZ2VtZW50X2ZlZV9icHNfcGVyeWVhcgAAAAAD6AAAAAQAAAAAAAAAFG5ld193aXRoZHJhd19mZWVfYnBzAAAD6AAAAAQAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAADVBlbmRpbmdMaW1pdHMAAAAAAAAGAAAAAAAAABVuZXdfbWF4X2RldmlhdGlvbl9icHMAAAAAAAPoAAAABAAAAAAAAAAXbmV3X21heF9zaGFyZXNfcGVyX3VzZXIAAAAD6AAAAAYAAAAAAAAAEm5ld19tYXhfdG90YWxfaWRsZQAAAAAD6AAAAAYAAAAAAAAAFG5ld19tYXhfdG90YWxfc2hhcmVzAAAD6AAAAAYAAAAAAAAAFm5ld19taW5fc2hhcmVzX3RvX21pbnQAAAAAA+gAAAAGAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAAAQAAAAAAAAAAAAAAEFBlbmRpbmdXaGl0ZWxpc3QAAAACAAAAAAAAAAtuZXdfZW5hYmxlZAAAAAPoAAAAAQAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAAEFBlbmRpbmdDb29sZG93bnMAAAAHAAAAAAAAABhuZXdfY29uZmlnX2Nvb2xkb3duX3NlY3MAAAPoAAAABgAAAAAAAAAebmV3X2VtZXJnZW5jeV93aXRoZHJhd19jbGR3bl9zAAAAAAPoAAAABgAAAAAAAAAcbmV3X2ZlZV9jaGFuZ2VfY29vbGRvd25fc2VjcwAAA+gAAAAGAAAAAAAAABxuZXdfcHJpY2VfYWNjZXB0YW5jZV9jbGR3bl9zAAAD6AAAAAYAAAAAAAAAHm5ld19wcmljZV91cGRhdGVfY29vbGRvd25fc2VjcwAAAAAD6AAAAAYAAAAAAAAAHW5ld19yb2xlX2NoYW5nZV9jb29sZG93bl9zZWNzAAAAAAAD6AAAAAYAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAABVN0YXRlAAAAAAAABAAAAAAAAAAGY29uZmlnAAAAAAfQAAAAC1N0YXRlQ29uZmlnAAAAAAAAAAAEY29yZQAAB9AAAAAJU3RhdGVDb3JlAAAAAAAAAAAAAAllbWVyZ2VuY3kAAAAAAAfQAAAADlN0YXRlRW1lcmdlbmN5AAAAAAAAAAAAB3BlbmRpbmcAAAAH0AAAAAxTdGF0ZVBlbmRpbmc=",
        "AAAAAQAAAAAAAAAAAAAACVN0YXRlQ29yZQAAAAAAABcAAAAAAAAACmFjY291bnRhbnQAAAAAABMAAAAAAAAADWFzc2V0X21hbmFnZXIAAAAAAAATAAAAAAAAAAlhdXRob3JpdHkAAAAAAAATAAAAAAAAAApjcmVhdGVkX2F0AAAAAAAGAAAAAAAAAA9kZXBvc2l0X2ZlZV9icHMAAAAABAAAAAAAAAAQbGFzdF9tZ210X2ZlZV90cwAAAAYAAAAyTGFzdCBwcmljZSB1cGRhdGUgdGltZXN0YW1wIGZvciBkZXZpYXRpb24gY29vbGRvd24AAAAAABtsYXN0X3ByaWNlX3VwZGF0ZV90aW1lc3RhbXAAAAAABgAAAAAAAAAbbWFuYWdlbWVudF9mZWVfYnBzX3Blcl95ZWFyAAAAAAQAAAAAAAAAB21hbmFnZXIAAAAAEwAAAE9NYXhpbXVtIGFsbG93ZWQgcHJpY2UgZGV2aWF0aW9uIGluIGJhc2lzIHBvaW50cyBiZWZvcmUgbWFudWFsIGFwcHJvdmFsIHJlcXVpcmVkAAAAABFtYXhfZGV2aWF0aW9uX2JwcwAAAAAAAAQAAAAAAAAAE21heF9zaGFyZXNfcGVyX3VzZXIAAAAABgAAAAAAAAAObWF4X3RvdGFsX2lkbGUAAAAAAAYAAAAAAAAAEG1heF90b3RhbF9zaGFyZXMAAAAGAAAAAAAAABJtaW5fc2hhcmVzX3RvX21pbnQAAAAAAAYAAAAnU3RvcmFnZSBmb3Igd2l0aGRyYXdhbCBzZXF1ZW5jZSBjb3VudGVyAAAAABJuZXh0X3dpdGhkcmF3YWxfaWQAAAAAAAYAAAAAAAAABm9yYWNsZQAAAAAAEwAAAAAAAAAFcHJpY2UAAAAAAAAGAAAAAAAAAAlwcm9jZXNzb3IAAAAAAAATAAAAAAAAABFzaGFyZXNfaW5fY3VzdG9keQAAAAAAAAYAAAAAAAAACnRvdGFsX2lkbGUAAAAAAAYAAAAAAAAADHRvdGFsX3NoYXJlcwAAAAYAAAAAAAAAGXRvdGFsX3dpdGhkcmF3YWxzX3BlbmRpbmcAAAAAAAAGAAAAAAAAABB3aXRoZHJhd19mZWVfYnBzAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAC1N0YXRlQ29uZmlnAAAAAAsAAAA8RGVmYXVsdCBjb29sZG93biBwZXJpb2QgZm9yIGNvbmZpZ3VyYXRpb24gY2hhbmdlcyBpbiBzZWNvbmRzAAAAFGNvbmZpZ19jb29sZG93bl9zZWNzAAAABgAAAF5OZXcgd2l0aGRyYXdhbCBsaWZlY3ljbGUgcGFyYW1ldGVycwpNYXhpbXVtIG5lZ2F0aXZlIHNsaXBwYWdlIGJvdCBtYXkgYWJzb3JiIChpbiBiYXNpcyBwb2ludHMpAAAAAAAQZG93bnNpZGVfY2FwX2JwcwAAAAQAAAA+UGVuYWx0eSBmb3IgdXNlci1pbml0aWF0ZWQgY2FuY2VsIGJlZm9yZSBUVEwgKGluIGJhc2lzIHBvaW50cykAAAAAABRlYXJseV9jYW5jZWxfZmVlX2JwcwAAAAQAAAA4RmVlIGNoYW5nZSBjb29sZG93biBwZXJpb2QgaW4gc2Vjb25kcyAoZGVmYXVsdCAyNCBob3VycykAAAAYZmVlX2NoYW5nZV9jb29sZG93bl9zZWNzAAAABgAAABFWYXVsdCBwYXVzZSBzdGF0ZQAAAAAAAAZwYXVzZWQAAAAAAAEAAABGQ29vbGRvd24gcGVyaW9kIGluIHNlY29uZHMgYWZ0ZXIgd2hpY2ggYW55b25lIGNhbiBhY2NlcHQgcGVuZGluZyBwcmljZQAAAAAAHnByaWNlX2FjY2VwdGFuY2VfY29vbGRvd25fc2VjcwAAAAAABgAAADxDb29sZG93biBwZXJpb2QgYmV0d2VlbiBwcmljZSB1cGRhdGVzIGZvciBkZXZpYXRpb24gY2hlY2tpbmcAAAAacHJpY2VfdXBkYXRlX2Nvb2xkb3duX3NlY3MAAAAAAAYAAAA5Um9sZSBjaGFuZ2UgY29vbGRvd24gcGVyaW9kIGluIHNlY29uZHMgKGRlZmF1bHQgNDggaG91cnMpAAAAAAAAGXJvbGVfY2hhbmdlX2Nvb2xkb3duX3NlY3MAAAAAAAAGAAAAS0V4dHJhIHNoYXJlcyBtaW50ZWQgdG8gdXNlciB3aGVuIGNhbmNlbCBoYXBwZW5zIGFmdGVyIFRUTCAoaW4gYmFzaXMgcG9pbnRzKQAAAAASc3lzdGVtX3BlbmFsdHlfYnBzAAAAAAAEAAAAFldoaXRlbGlzdCBlbmFibGVkIGZsYWcAAAAAABF3aGl0ZWxpc3RfZW5hYmxlZAAAAAAAAAEAAABHVGltZS10by1saXZlIGFmdGVyIHdoaWNoIHJlcXVlc3QgY2FuIGJlIGNhbmNlbGxlZCBmZWUtZnJlZSAoaW4gc2Vjb25kcykAAAAAE3dpdGhkcmF3YWxfdHRsX3NlY3MAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADFN0YXRlUGVuZGluZwAAAAYAAAAqUGVuZGluZyBjb29sZG93biBjaGFuZ2VzIGF3YWl0aW5nIGFwcHJvdmFsAAAAAAARcGVuZGluZ19jb29sZG93bnMAAAAAAAfQAAAAEFBlbmRpbmdDb29sZG93bnMAAAAlUGVuZGluZyBmZWUgY2hhbmdlcyBhd2FpdGluZyBhcHByb3ZhbAAAAAAAAAxwZW5kaW5nX2ZlZXMAAAfQAAAAC1BlbmRpbmdGZWVzAAAAAChQZW5kaW5nIGxpbWl0cyBjaGFuZ2VzIGF3YWl0aW5nIGFwcHJvdmFsAAAADnBlbmRpbmdfbGltaXRzAAAAAAfQAAAADVBlbmRpbmdMaW1pdHMAAAAAAAAmUGVuZGluZyBwcmljZSB1cGRhdGUgYXdhaXRpbmcgYXBwcm92YWwAAAAAAA1wZW5kaW5nX3ByaWNlAAAAAAAH0AAAAAxQZW5kaW5nUHJpY2UAAAAmUGVuZGluZyByb2xlcyBjaGFuZ2UgYXdhaXRpbmcgYXBwcm92YWwAAAAAAA1wZW5kaW5nX3JvbGVzAAAAAAAH0AAAAAxQZW5kaW5nUm9sZXMAAAArUGVuZGluZyB3aGl0ZWxpc3QgY2hhbmdlcyBhd2FpdGluZyBhcHByb3ZhbAAAAAARcGVuZGluZ193aGl0ZWxpc3QAAAAAAAfQAAAAEFBlbmRpbmdXaGl0ZWxpc3Q=",
        "AAAAAQAAAAAAAAAAAAAADlN0YXRlRW1lcmdlbmN5AAAAAAAEAAAAK0VtZXJnZW5jeSB3aXRoZHJhd2FsIHRpbWVsb2NrIGVuZCB0aW1lc3RhbXAAAAAAHWVtZXJnZW5jeV93aXRoZHJhd190aW1lbG9ja19lAAAAAAAABgAAAEtQZW5kaW5nIGVtZXJnZW5jeSB3aXRoZHJhd2FsIHJlcXVlc3QgdG9rZW4gbWludCAoTm9uZSBpZiBubyBhY3RpdmUgcmVxdWVzdCkAAAAAHWVtZXJnZW5jeV93aXRoZHJhd190b2tlbl9taW50AAAAAAAD6AAAABMAAABEUGVuZGluZyBlbWVyZ2VuY3kgd2l0aGRyYXdhbCByZXF1ZXN0IGFtb3VudCAoMCBpZiBubyBhY3RpdmUgcmVxdWVzdCkAAAAbZW1lcmdlbmN5X3dpdGhkcmF3YWxfYW1vdW50AAAAAAYAAABCRW1lcmdlbmN5IHdpdGhkcmF3YWwgY29vbGRvd24gcGVyaW9kIGluIHNlY29uZHMgKGRlZmF1bHQgMjQgaG91cnMpAAAAAAAdZW1lcmdlbmN5X3dpdGhkcmF3YWxfY29vbGRvd24AAAAAAAAG",
        "AAAAAgAAAEFTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgYWxsb3dsaXN0IGV4dGVuc2lvbgAAAAAAAAAAAAATQWxsb3dMaXN0U3RvcmFnZUtleQAAAAABAAAAAQAAACdTdG9yZXMgdGhlIGFsbG93ZWQgc3RhdHVzIG9mIGFuIGFjY291bnQAAAAAB0FsbG93ZWQAAAAAAQAAABM=",
        "AAAAAgAAAEFTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgYmxvY2tsaXN0IGV4dGVuc2lvbgAAAAAAAAAAAAATQmxvY2tMaXN0U3RvcmFnZUtleQAAAAABAAAAAQAAACdTdG9yZXMgdGhlIGJsb2NrZWQgc3RhdHVzIG9mIGFuIGFjY291bnQAAAAAB0Jsb2NrZWQAAAAAAQAAABM=",
        "AAAAAgAAAD1TdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgdmF1bHQgZXh0ZW5zaW9uAAAAAAAAAAAAAA9WYXVsdFN0b3JhZ2VLZXkAAAAAAQAAAAAAAAAyU3RvcmVzIHRoZSBhZGRyZXNzIG9mIHRoZSB2YXVsdCdzIHVuZGVybHlpbmcgYXNzZXQAAAAAAAxBc3NldEFkZHJlc3M=",
        "AAAAAgAAAAAAAAAAAAAACFJvdW5kaW5nAAAAAgAAAAAAAAAAAAAABUZsb29yAAAAAAAAAAAAAAAAAAAEQ2VpbA==",
        "AAAAAQAAACpTdG9yYWdlIGtleSB0aGF0IG1hcHMgdG8gW2BBbGxvd2FuY2VEYXRhYF0AAAAAAAAAAAAMQWxsb3dhbmNlS2V5AAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdzcGVuZGVyAAAAABM=",
        "AAAAAQAAAINTdG9yYWdlIGNvbnRhaW5lciBmb3IgdGhlIGFtb3VudCBvZiB0b2tlbnMgZm9yIHdoaWNoIGFuIGFsbG93YW5jZSBpcyBncmFudGVkCmFuZCB0aGUgbGVkZ2VyIG51bWJlciBhdCB3aGljaCB0aGlzIGFsbG93YW5jZSBleHBpcmVzLgAAAAAAAAAADUFsbG93YW5jZURhdGEAAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWxpdmVfdW50aWxfbGVkZ2VyAAAAAAAABA==",
        "AAAAAgAAADlTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgRnVuZ2libGVUb2tlbmAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAMAAAAAAAAAAAAAAAtUb3RhbFN1cHBseQAAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAJQWxsb3dhbmNlAAAAAAAAAQAAB9AAAAAMQWxsb3dhbmNlS2V5",
        "AAAAAQAAACRTdG9yYWdlIGNvbnRhaW5lciBmb3IgdG9rZW4gbWV0YWRhdGEAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ",
        "AAAAAgAAAClTdG9yYWdlIGtleSBmb3IgYWNjZXNzaW5nIHRoZSBTQUMgYWRkcmVzcwAAAAAAAAAAAAAWU0FDQWRtaW5HZW5lcmljRGF0YUtleQAAAAAAAQAAAAAAAAAAAAAAA1NhYwA=",
        "AAAAAgAAAClTdG9yYWdlIGtleSBmb3IgYWNjZXNzaW5nIHRoZSBTQUMgYWRkcmVzcwAAAAAAAAAAAAAWU0FDQWRtaW5XcmFwcGVyRGF0YUtleQAAAAAAAQAAAAAAAAAAAAAAA1NhYwA=",
        "AAAABAAAAAAAAAAAAAAAEkZ1bmdpYmxlVG9rZW5FcnJvcgAAAAAAFgAAAG5JbmRpY2F0ZXMgYW4gZXJyb3IgcmVsYXRlZCB0byB0aGUgY3VycmVudCBiYWxhbmNlIG9mIGFjY291bnQgZnJvbSB3aGljaAp0b2tlbnMgYXJlIGV4cGVjdGVkIHRvIGJlIHRyYW5zZmVycmVkLgAAAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAAZAAAAGRJbmRpY2F0ZXMgYSBmYWlsdXJlIHdpdGggdGhlIGFsbG93YW5jZSBtZWNoYW5pc20gd2hlbiBhIGdpdmVuIHNwZW5kZXIKZG9lc24ndCBoYXZlIGVub3VnaCBhbGxvd2FuY2UuAAAAFUluc3VmZmljaWVudEFsbG93YW5jZQAAAAAAAGUAAABNSW5kaWNhdGVzIGFuIGludmFsaWQgdmFsdWUgZm9yIGBsaXZlX3VudGlsX2xlZGdlcmAgd2hlbiBzZXR0aW5nIGFuCmFsbG93YW5jZS4AAAAAAAAWSW52YWxpZExpdmVVbnRpbExlZGdlcgAAAAAAZgAAADJJbmRpY2F0ZXMgYW4gZXJyb3Igd2hlbiBhbiBpbnB1dCB0aGF0IG11c3QgYmUgPj0gMAAAAAAADExlc3NUaGFuWmVybwAAAGcAAAApSW5kaWNhdGVzIG92ZXJmbG93IHdoZW4gYWRkaW5nIHR3byB2YWx1ZXMAAAAAAAAMTWF0aE92ZXJmbG93AAAAaAAAACpJbmRpY2F0ZXMgYWNjZXNzIHRvIHVuaW5pdGlhbGl6ZWQgbWV0YWRhdGEAAAAAAA1VbnNldE1ldGFkYXRhAAAAAAAAaQAAAFJJbmRpY2F0ZXMgdGhhdCB0aGUgb3BlcmF0aW9uIHdvdWxkIGhhdmUgY2F1c2VkIGB0b3RhbF9zdXBwbHlgIHRvIGV4Y2VlZAp0aGUgYGNhcGAuAAAAAAALRXhjZWVkZWRDYXAAAAAAagAAADZJbmRpY2F0ZXMgdGhlIHN1cHBsaWVkIGBjYXBgIGlzIG5vdCBhIHZhbGlkIGNhcCB2YWx1ZS4AAAAAAApJbnZhbGlkQ2FwAAAAAABrAAAAHkluZGljYXRlcyB0aGUgQ2FwIHdhcyBub3Qgc2V0LgAAAAAACUNhcE5vdFNldAAAAAAAAGwAAAAmSW5kaWNhdGVzIHRoZSBTQUMgYWRkcmVzcyB3YXMgbm90IHNldC4AAAAAAAlTQUNOb3RTZXQAAAAAAABtAAAAMEluZGljYXRlcyBhIFNBQyBhZGRyZXNzIGRpZmZlcmVudCB0aGFuIGV4cGVjdGVkLgAAABJTQUNBZGRyZXNzTWlzbWF0Y2gAAAAAAG4AAABDSW5kaWNhdGVzIGEgbWlzc2luZyBmdW5jdGlvbiBwYXJhbWV0ZXIgaW4gdGhlIFNBQyBjb250cmFjdCBjb250ZXh0LgAAAAARU0FDTWlzc2luZ0ZuUGFyYW0AAAAAAABvAAAAREluZGljYXRlcyBhbiBpbnZhbGlkIGZ1bmN0aW9uIHBhcmFtZXRlciBpbiB0aGUgU0FDIGNvbnRyYWN0IGNvbnRleHQuAAAAEVNBQ0ludmFsaWRGblBhcmFtAAAAAAAAcAAAADFUaGUgdXNlciBpcyBub3QgYWxsb3dlZCB0byBwZXJmb3JtIHRoaXMgb3BlcmF0aW9uAAAAAAAADlVzZXJOb3RBbGxvd2VkAAAAAABxAAAANVRoZSB1c2VyIGlzIGJsb2NrZWQgYW5kIGNhbm5vdCBwZXJmb3JtIHRoaXMgb3BlcmF0aW9uAAAAAAAAC1VzZXJCbG9ja2VkAAAAAHIAAAA1SW5kaWNhdGVzIGFjY2VzcyB0byB1bmluaXRpYWxpemVkIHZhdWx0IGFzc2V0IGFkZHJlc3MAAAAAAAAXVmF1bHRBc3NldEFkZHJlc3NOb3RTZXQAAAAAcwAAADdJbmRpY2F0ZXMgdGhlIGFtb3VudCBpcyBub3QgYSB2YWxpZCB2YXVsdCBhc3NldHMgdmFsdWUuAAAAABhWYXVsdEludmFsaWRBc3NldHNBbW91bnQAAAB0AAAAN0luZGljYXRlcyB0aGUgYW1vdW50IGlzIG5vdCBhIHZhbGlkIHZhdWx0IHNoYXJlcyB2YWx1ZS4AAAAAGFZhdWx0SW52YWxpZFNoYXJlc0Ftb3VudAAAAHUAAABBQXR0ZW1wdGVkIHRvIGRlcG9zaXQgbW9yZSBhc3NldHMgdGhhbiB0aGUgbWF4IGFtb3VudCBmb3IgYWRkcmVzcy4AAAAAAAAXVmF1bHRFeGNlZWRlZE1heERlcG9zaXQAAAAAdgAAAD5BdHRlbXB0ZWQgdG8gbWludCBtb3JlIHNoYXJlcyB0aGFuIHRoZSBtYXggYW1vdW50IGZvciBhZGRyZXNzLgAAAAAAFFZhdWx0RXhjZWVkZWRNYXhNaW50AAAAdwAAAEJBdHRlbXB0ZWQgdG8gd2l0aGRyYXcgbW9yZSBhc3NldHMgdGhhbiB0aGUgbWF4IGFtb3VudCBmb3IgYWRkcmVzcy4AAAAAABhWYXVsdEV4Y2VlZGVkTWF4V2l0aGRyYXcAAAB4AAAAQEF0dGVtcHRlZCB0byByZWRlZW0gbW9yZSBzaGFyZXMgdGhhbiB0aGUgbWF4IGFtb3VudCBmb3IgYWRkcmVzcy4AAAAWVmF1bHRFeGNlZWRlZE1heFJlZGVlbQAAAAAAeQ==",
        "AAAAAgAAAFlTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29uc2VjdXRpdmUgZXh0ZW5zaW9uIG9mCmBOb25GdW5naWJsZVRva2VuYAAAAAAAAAAAAAAYTkZUQ29uc2VjdXRpdmVTdG9yYWdlS2V5AAAABAAAAAEAAAAAAAAACEFwcHJvdmFsAAAAAQAAAAQAAAABAAAAAAAAAAVPd25lcgAAAAAAAAEAAAAEAAAAAQAAAAAAAAAPT3duZXJzaGlwQnVja2V0AAAAAAEAAAAEAAAAAQAAAAAAAAALQnVybmVkVG9rZW4AAAAAAQAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADk93bmVyVG9rZW5zS2V5AAAAAAACAAAAAAAAAAVpbmRleAAAAAAAAAQAAAAAAAAABW93bmVyAAAAAAAAEw==",
        "AAAAAgAAAFhTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgZW51bWVyYWJsZSBleHRlbnNpb24gb2YKYE5vbkZ1bmdpYmxlVG9rZW5gAAAAAAAAABdORlRFbnVtZXJhYmxlU3RvcmFnZUtleQAAAAAFAAAAAAAAAAAAAAALVG90YWxTdXBwbHkAAAAAAQAAAAAAAAALT3duZXJUb2tlbnMAAAAAAQAAB9AAAAAOT3duZXJUb2tlbnNLZXkAAAAAAAEAAAAAAAAAEE93bmVyVG9rZW5zSW5kZXgAAAABAAAABAAAAAEAAAAAAAAADEdsb2JhbFRva2VucwAAAAEAAAAEAAAAAQAAAAAAAAARR2xvYmFsVG9rZW5zSW5kZXgAAAAAAAABAAAABA==",
        "AAAAAQAAAClTdG9yYWdlIGNvbnRhaW5lciBmb3Igcm95YWx0eSBpbmZvcm1hdGlvbgAAAAAAAAAAAAALUm95YWx0eUluZm8AAAAAAgAAAAAAAAAMYmFzaXNfcG9pbnRzAAAABAAAAAAAAAAIcmVjZWl2ZXIAAAAT",
        "AAAAAgAAAB1TdG9yYWdlIGtleXMgZm9yIHJveWFsdHkgZGF0YQAAAAAAAAAAAAAWTkZUUm95YWx0aWVzU3RvcmFnZUtleQAAAAAAAgAAAAAAAAAAAAAADkRlZmF1bHRSb3lhbHR5AAAAAAABAAAAAAAAAAxUb2tlblJveWFsdHkAAAABAAAABA==",
        "AAAAAQAAAHZTdG9yYWdlIGNvbnRhaW5lciBmb3IgdGhlIHRva2VuIGZvciB3aGljaCBhbiBhcHByb3ZhbCBpcyBncmFudGVkCmFuZCB0aGUgbGVkZ2VyIG51bWJlciBhdCB3aGljaCB0aGlzIGFwcHJvdmFsIGV4cGlyZXMuAAAAAAAAAAAADEFwcHJvdmFsRGF0YQAAAAIAAAAAAAAACGFwcHJvdmVkAAAAEwAAAAAAAAARbGl2ZV91bnRpbF9sZWRnZXIAAAAAAAAE",
        "AAAAAQAAACRTdG9yYWdlIGNvbnRhaW5lciBmb3IgdG9rZW4gbWV0YWRhdGEAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ",
        "AAAAAgAAADxTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgTm9uRnVuZ2libGVUb2tlbmAAAAAAAAAADU5GVFN0b3JhZ2VLZXkAAAAAAAAFAAAAAQAAAAAAAAAFT3duZXIAAAAAAAABAAAABAAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAhBcHByb3ZhbAAAAAEAAAAEAAAAAQAAAAAAAAAOQXBwcm92YWxGb3JBbGwAAAAAAAIAAAATAAAAEwAAAAAAAAAAAAAACE1ldGFkYXRh",
        "AAAAAgAAAAAAAAAAAAAAF05GVFNlcXVlbnRpYWxTdG9yYWdlS2V5AAAAAAEAAAAAAAAAAAAAAA5Ub2tlbklkQ291bnRlcgAA",
        "AAAABAAAAAAAAAAAAAAAFU5vbkZ1bmdpYmxlVG9rZW5FcnJvcgAAAAAAAA0AAAAkSW5kaWNhdGVzIGEgbm9uLWV4aXN0ZW50IGB0b2tlbl9pZGAuAAAAEE5vbkV4aXN0ZW50VG9rZW4AAADIAAAAV0luZGljYXRlcyBhbiBlcnJvciByZWxhdGVkIHRvIHRoZSBvd25lcnNoaXAgb3ZlciBhIHBhcnRpY3VsYXIgdG9rZW4uClVzZWQgaW4gdHJhbnNmZXJzLgAAAAAOSW5jb3JyZWN0T3duZXIAAAAAAMkAAABFSW5kaWNhdGVzIGEgZmFpbHVyZSB3aXRoIHRoZSBgb3BlcmF0b3JgcyBhcHByb3ZhbC4gVXNlZCBpbiB0cmFuc2ZlcnMuAAAAAAAAFEluc3VmZmljaWVudEFwcHJvdmFsAAAAygAAAFVJbmRpY2F0ZXMgYSBmYWlsdXJlIHdpdGggdGhlIGBhcHByb3ZlcmAgb2YgYSB0b2tlbiB0byBiZSBhcHByb3ZlZC4gVXNlZAppbiBhcHByb3ZhbHMuAAAAAAAAD0ludmFsaWRBcHByb3ZlcgAAAADLAAAASkluZGljYXRlcyBhbiBpbnZhbGlkIHZhbHVlIGZvciBgbGl2ZV91bnRpbF9sZWRnZXJgIHdoZW4gc2V0dGluZwphcHByb3ZhbHMuAAAAAAAWSW52YWxpZExpdmVVbnRpbExlZGdlcgAAAAAAzAAAAClJbmRpY2F0ZXMgb3ZlcmZsb3cgd2hlbiBhZGRpbmcgdHdvIHZhbHVlcwAAAAAAAAxNYXRoT3ZlcmZsb3cAAADNAAAANkluZGljYXRlcyBhbGwgcG9zc2libGUgYHRva2VuX2lkYHMgYXJlIGFscmVhZHkgaW4gdXNlLgAAAAAAE1Rva2VuSURzQXJlRGVwbGV0ZWQAAAAAzgAAAEVJbmRpY2F0ZXMgYW4gaW52YWxpZCBhbW91bnQgdG8gYmF0Y2ggbWludCBpbiBgY29uc2VjdXRpdmVgIGV4dGVuc2lvbi4AAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAM8AAAAzSW5kaWNhdGVzIHRoZSB0b2tlbiBkb2VzIG5vdCBleGlzdCBpbiBvd25lcidzIGxpc3QuAAAAABhUb2tlbk5vdEZvdW5kSW5Pd25lckxpc3QAAADQAAAAMkluZGljYXRlcyB0aGUgdG9rZW4gZG9lcyBub3QgZXhpc3QgaW4gZ2xvYmFsIGxpc3QuAAAAAAAZVG9rZW5Ob3RGb3VuZEluR2xvYmFsTGlzdAAAAAAAANEAAAAjSW5kaWNhdGVzIGFjY2VzcyB0byB1bnNldCBtZXRhZGF0YS4AAAAADVVuc2V0TWV0YWRhdGEAAAAAAADSAAAAQUluZGljYXRlcyB0aGUgbGVuZ3RoIG9mIHRoZSBiYXNlIFVSSSBleGNlZWRzIHRoZSBtYXhpbXVtIGFsbG93ZWQuAAAAAAAAFUJhc2VVcmlNYXhMZW5FeGNlZWRlZAAAAAAAANMAAABHSW5kaWNhdGVzIHRoZSByb3lhbHR5IGFtb3VudCBpcyBoaWdoZXIgdGhhbiAxMF8wMDAgKDEwMCUpIGJhc2lzIHBvaW50cy4AAAAAFEludmFsaWRSb3lhbHR5QW1vdW50AAAA1A==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
        mint_core: this.txFromJSON<Result<void>>,
        propose_roles: this.txFromJSON<Result<void>>,
        accept_roles: this.txFromJSON<Result<void>>,
        propose_fees: this.txFromJSON<Result<void>>,
        accept_fees: this.txFromJSON<Result<void>>,
        propose_limits: this.txFromJSON<Result<void>>,
        accept_limits: this.txFromJSON<Result<void>>,
        update_price: this.txFromJSON<Result<void>>,
        deposit_core: this.txFromJSON<Result<void>>,
        withdraw_request: this.txFromJSON<Result<void>>,
        update_withdrawal_minimum: this.txFromJSON<Result<void>>,
        process_deposits: this.txFromJSON<Result<void>>,
        return_funds: this.txFromJSON<Result<void>>,
        fulfill_withdrawal: this.txFromJSON<Result<void>>,
        accrue_management_fee: this.txFromJSON<Result<void>>,
        accept_price: this.txFromJSON<Result<void>>,
        reject_price: this.txFromJSON<Result<void>>,
        cancel_withdrawal: this.txFromJSON<Result<void>>,
        withdraw_unexpected_deposits: this.txFromJSON<Result<void>>,
        pause_vault: this.txFromJSON<Result<void>>,
        unpause_vault: this.txFromJSON<Result<void>>,
        emergency_withdraw: this.txFromJSON<Result<void>>,
        add_user_to_whitelist: this.txFromJSON<Result<void>>,
        propose_whitelist: this.txFromJSON<Result<void>>,
        accept_whitelist: this.txFromJSON<Result<void>>,
        remove_user_from_whitelist: this.txFromJSON<Result<void>>,
        swap_tokens: this.txFromJSON<Result<void>>,
        propose_cooldowns: this.txFromJSON<Result<void>>,
        accept_cooldowns: this.txFromJSON<Result<void>>,
        accept_allowlist_mint: this.txFromJSON<Result<void>>,
        cancel_allowlist_mint: this.txFromJSON<Result<void>>,
        write_vault_total_shares: this.txFromJSON<Result<void>>,
        total_idle: this.txFromJSON<u64>,
        total_shares: this.txFromJSON<u64>,
        is_paused: this.txFromJSON<boolean>,
        price: this.txFromJSON<u64>,
        asset_manager: this.txFromJSON<string>,
        accountant: this.txFromJSON<string>,
        whitelist_enabled: this.txFromJSON<boolean>,
        is_whitelisted: this.txFromJSON<boolean>,
        min_shares_to_mint: this.txFromJSON<u64>,
        get_withdraw_request: this.txFromJSON<readonly [u64, u64, u64, u64]>,
        theoretical_out: this.txFromJSON<u64>,
        total_withdrawals_pending: this.txFromJSON<u64>,
        shares_in_custody: this.txFromJSON<u64>,
        total_supply: this.txFromJSON<i128>,
        balance: this.txFromJSON<i128>,
        allowance: this.txFromJSON<i128>,
        transfer: this.txFromJSON<null>,
        transfer_from: this.txFromJSON<null>,
        approve: this.txFromJSON<null>,
        decimals: this.txFromJSON<u32>,
        name: this.txFromJSON<string>,
        symbol: this.txFromJSON<string>,
        query_asset: this.txFromJSON<string>,
        total_assets: this.txFromJSON<i128>,
        convert_to_shares: this.txFromJSON<i128>,
        convert_to_assets: this.txFromJSON<i128>,
        max_deposit: this.txFromJSON<i128>,
        preview_deposit: this.txFromJSON<i128>,
        deposit: this.txFromJSON<i128>,
        max_mint: this.txFromJSON<i128>,
        preview_mint: this.txFromJSON<i128>,
        mint: this.txFromJSON<i128>,
        max_withdraw: this.txFromJSON<i128>,
        preview_withdraw: this.txFromJSON<i128>,
        withdraw: this.txFromJSON<i128>,
        max_redeem: this.txFromJSON<i128>,
        preview_redeem: this.txFromJSON<i128>,
        redeem: this.txFromJSON<i128>
  }
}