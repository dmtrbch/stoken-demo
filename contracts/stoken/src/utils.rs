use crate::constants::*;
use crate::errors::STokenCoreError;
use core::cmp::Ordering;

/// Calculate price deviation in basis points
///
/// # Arguments
/// * `old_price` - Previous price value
/// * `new_price` - New price value
///
/// # Returns
/// * `Result<u32, STokenCoreError>` - Absolute deviation in basis points
pub fn calculate_price_deviation(old_price: u64, new_price: u64) -> Result<u32, STokenCoreError> {
    if old_price == 0 || new_price == 0 {
        return Err(STokenCoreError::InvalidPrice);
    }

    let deviation = if new_price > old_price {
        new_price
            .checked_sub(old_price)
            .ok_or(STokenCoreError::MathOverflow)?
    } else {
        old_price
            .checked_sub(new_price)
            .ok_or(STokenCoreError::MathOverflow)?
    };

    // deviation_bps = (deviation * BPS_PRECISION) / old_price
    let deviation_bps = (deviation as u128)
        .checked_mul(BPS_PRECISION as u128)
        .ok_or(STokenCoreError::MathOverflow)?
        .checked_div(old_price as u128)
        .ok_or(STokenCoreError::MathOverflow)?;

    // Cap deviation at u32::MAX to prevent overflow
    let deviation_bps = if deviation_bps > u32::MAX as u128 {
        u32::MAX
    } else {
        deviation_bps as u32
    };

    Ok(deviation_bps)
}

/// Calculate management fee shares to mint
///
/// # Arguments
/// * `total_supply` - Current total S-Token supply
/// * `management_fee_bps_per_year` - Annual management fee in basis points
/// * `time_elapsed_seconds` - Time elapsed since last fee accrual in seconds
///
/// # Returns
/// * `Result<u64>` - Shares to mint for management fee
pub fn calculate_management_fee(
    total_supply: u64,
    management_fee_bps_per_year: u32,
    time_elapsed_seconds: u64,
) -> Result<u64, STokenCoreError> {
    if management_fee_bps_per_year > MAX_MANAGEMENT_FEE_BPS_PER_YEAR {
        return Err(STokenCoreError::InvalidFee);
    }

    if management_fee_bps_per_year == 0 || time_elapsed_seconds == 0 || total_supply == 0 {
        return Ok(0);
    }

    // Calculate the fee rate for the elapsed time period
    // fee_rate = (management_fee_bps_per_year * time_elapsed_seconds) / (BPS_PRECISION * SECONDS_PER_YEAR)
    let fee_rate_numerator = (management_fee_bps_per_year as u128)
        .checked_mul(time_elapsed_seconds as u128)
        .ok_or(STokenCoreError::MathOverflow)?;

    let fee_rate_denominator = (BPS_PRECISION as u128)
        .checked_mul(SECONDS_PER_YEAR as u128)
        .ok_or(STokenCoreError::MathOverflow)?;

    // fee_shares = (total_supply * fee_rate_numerator) / (fee_rate_denominator + fee_rate_numerator)
    // This formula ensures the fee is calculated as a percentage of the total value
    let fee_shares_numerator = (total_supply as u128)
        .checked_mul(fee_rate_numerator)
        .ok_or(STokenCoreError::MathOverflow)?;

    let fee_shares_denominator = fee_rate_denominator
        .checked_add(fee_rate_numerator)
        .ok_or(STokenCoreError::MathOverflow)?;

    let fee_shares = fee_shares_numerator
        .checked_div(fee_shares_denominator)
        .ok_or(STokenCoreError::MathOverflow)?;

    let fee_shares = u64::try_from(fee_shares).map_err(|_| STokenCoreError::MathOverflow)?;

    Ok(fee_shares)
}

/// Validate fee parameters
///
/// # Arguments
/// * `deposit_fee_bps` - Deposit fee in basis points
/// * `withdraw_fee_bps` - Withdrawal fee in basis points
/// * `management_fee_bps_per_year` - Annual management fee in basis points
///
/// # Returns
/// * `Result<()>` - Validation result
pub fn validate_fees(
    deposit_fee_bps: u32,
    withdraw_fee_bps: u32,
    management_fee_bps_per_year: u32,
) -> Result<(), STokenCoreError> {
    if deposit_fee_bps > MAX_FEE_BPS {
        return Err(STokenCoreError::InvalidFee);
    }
    if withdraw_fee_bps > MAX_FEE_BPS {
        return Err(STokenCoreError::InvalidFee);
    }
    if management_fee_bps_per_year > MAX_MANAGEMENT_FEE_BPS_PER_YEAR {
        return Err(STokenCoreError::InvalidFee);
    }
    Ok(())
}

/// Validate new limit parameters
///
/// # Arguments
/// * `max_total_shares` - Maximum total shares (None means no limit)
/// * `max_shares_per_user` - Maximum shares per user (None means no limit)  
/// * `max_total_idle` - Maximum total idle funds (None means no limit)
///
/// # Returns
/// * `Result<()>` - Validation result
pub fn validate_new_limits(
    max_total_shares: Option<u64>,
    max_shares_per_user: Option<u64>,
    max_total_idle: Option<u64>,
    min_shares_to_mint: Option<u64>,
) -> Result<(), STokenCoreError> {
    // Validate max_total_shares doesn't exceed maximum allowed value
    if let Some(total_shares) = max_total_shares {
        if total_shares > MAX_ALLOWED_TOTAL_SHARES {
            return Err(STokenCoreError::LimitExceedsMaximum);
        }
    }

    // Validate max_shares_per_user doesn't exceed maximum allowed value
    if let Some(shares_per_user) = max_shares_per_user {
        if shares_per_user > MAX_ALLOWED_SHARES_PER_USER {
            return Err(STokenCoreError::LimitExceedsMaximum);
        }
    }

    // Validate max_total_idle doesn't exceed maximum allowed value
    if let Some(total_idle) = max_total_idle {
        if total_idle > MAX_ALLOWED_TOTAL_IDLE {
            return Err(STokenCoreError::LimitExceedsMaximum);
        }
    }

    // Validate min_shares_to_mint doesn't exceed maximum allowed value
    if let Some(min_shares) = min_shares_to_mint {
        if min_shares > MAX_ALLOWED_MIN_SHARES_TO_MINT {
            return Err(STokenCoreError::LimitExceedsMaximum);
        }
    }

    // Check that user share limit doesn't exceed total share limit
    if let (Some(total_limit), Some(user_limit)) = (max_total_shares, max_shares_per_user) {
        if user_limit > total_limit {
            return Err(STokenCoreError::InvalidLimit);
        }
    }

    // Check that minimum shares to mint doesn't exceed user limit
    if let (Some(user_limit), Some(min_shares)) = (max_shares_per_user, min_shares_to_mint) {
        if min_shares > user_limit {
            return Err(STokenCoreError::InvalidLimit);
        }
    }

    Ok(())
}

/// Check if deposit would exceed maximum total idle limit
/// Note: This check is only performed for deposits, not when asset manager returns funds
///
/// # Arguments
/// * `current_total_idle` - Current idle funds in the vault
/// * `deposit_amount` - Amount being deposited
/// * `max_total_idle` - Maximum idle funds allowed
///
/// # Returns
/// * `Result<()>` - Validation result
pub fn check_max_total_idle_for_deposit(
    current_total_idle: u64,
    deposit_amount: u64,
    max_total_idle: u64,
) -> Result<(), STokenCoreError> {
    if max_total_idle == u64::MAX {
        return Ok(()); // No limit set
    }

    let new_total_idle = current_total_idle
        .checked_add(deposit_amount)
        .ok_or(STokenCoreError::MathOverflow)?;

    if new_total_idle > max_total_idle {
        return Err(STokenCoreError::MaxTotalIdleExceeded);
    }

    Ok(())
}

/// Convert underlying asset amount to S-Token shares (decimal-aware)
///
/// # Arguments
/// * `amount_underlying` - Amount of underlying asset
/// * `price` - Current S-Token price (fixed-point, 1e6 = 1 unit of underlying)
/// * `underlying_mint` - The underlying token mint account decimals
/// * `shares_mint` - The shares token mint account decimals
///
/// # Returns
/// * `Result<u64>` - Amount of shares to mint
pub fn amount_to_shares_with_decimals(
    amount_underlying: u64,
    price: u64,
    underlying_mint_decimals: u32,
    shares_mint_decimals: u32,
) -> Result<u64, STokenCoreError> {
    amount_to_shares_core(
        amount_underlying,
        price,
        underlying_mint_decimals,
        shares_mint_decimals,
    )
}

/// Core logic for converting underlying asset amount to S-Token shares
///
/// # Arguments
/// * `amount_underlying` - Amount of underlying asset
/// * `price` - Current S-Token price (fixed-point, 1e6 = 1 unit of underlying)
/// * `underlying_decimals` - Decimals of the underlying token
/// * `shares_decimals` - Decimals of the shares token
///
/// # Returns
/// * `Result<u64>` - Amount of shares to mint
pub fn amount_to_shares_core(
    amount_underlying: u64,
    price: u64,
    underlying_decimals: u32,
    shares_decimals: u32,
) -> Result<u64, STokenCoreError> {
    if price == 0 {
        return Err(STokenCoreError::InvalidPrice);
    }
    if amount_underlying == 0 {
        return Err(STokenCoreError::InvalidAmount);
    }

    // Normalize for decimal differences
    let normalized_amount = if shares_decimals >= underlying_decimals {
        let decimal_diff = shares_decimals - underlying_decimals;
        (amount_underlying as u128)
            .checked_mul(10_u128.pow(decimal_diff as u32))
            .ok_or(STokenCoreError::MathOverflow)?
    } else {
        let decimal_diff = underlying_decimals - shares_decimals;
        (amount_underlying as u128)
            .checked_div(10_u128.pow(decimal_diff as u32))
            .ok_or(STokenCoreError::MathOverflow)?
    };

    // shares = (normalized_amount * PRICE_PRECISION) / price
    let shares = normalized_amount
        .checked_mul(PRICE_PRECISION as u128)
        .ok_or(STokenCoreError::MathOverflow)?
        .checked_div(price as u128)
        .ok_or(STokenCoreError::MathOverflow)?;

    let shares = u64::try_from(shares).map_err(|_| STokenCoreError::MathOverflow)?;

    if shares == 0 {
        return Err(STokenCoreError::ZeroAmountCalculated);
    }

    Ok(shares)
}

/// Apply fee to an amount (in shares) with improved precision using banker's rounding
///
/// # Arguments
/// * `amount` - Base amount in shares
/// * `fee_bps` - Fee in basis points
///
/// # Returns
/// * `Result<(u64, u64)>` - (amount_after_fee, fee_amount)
pub fn apply_fee(amount: u64, fee_bps: u32) -> Result<(u64, u64), STokenCoreError> {
    if fee_bps > MAX_FEE_BPS {
        return Err(STokenCoreError::InvalidFee);
    }

    if fee_bps == 0 {
        return Ok((amount, 0));
    }

    // fee_amount = (amount * fee_bps) / BPS_PRECISION with banker's rounding
    let fee_amount_scaled = (amount as u128)
        .checked_mul(fee_bps as u128)
        .ok_or(STokenCoreError::MathOverflow)?;

    // Implement banker's rounding (round to even)
    let quotient = fee_amount_scaled / BPS_PRECISION as u128;
    let remainder = fee_amount_scaled % BPS_PRECISION as u128;
    let half_precision = (BPS_PRECISION as u128) / 2;

    let fee_amount = match remainder.cmp(&half_precision) {
        Ordering::Greater => {
            // Round up
            quotient + 1
        }
        Ordering::Less => {
            // Round down
            quotient
        }
        Ordering::Equal => {
            // Exactly half - round to even (banker's rounding)
            if quotient % 2 == 0 {
                quotient
            } else {
                quotient + 1
            }
        }
    };

    let fee_amount = u64::try_from(fee_amount).map_err(|_| STokenCoreError::MathOverflow)?;

    // Apply minimum fee threshold if fee would be non-zero but less than threshold
    let fee_amount = if fee_amount == 0 && fee_bps > 0 && amount >= MIN_FEE_THRESHOLD {
        MIN_FEE_THRESHOLD
    } else {
        fee_amount
    };

    let amount_after_fee = amount
        .checked_sub(fee_amount)
        .ok_or(STokenCoreError::MathOverflow)?;

    Ok((amount_after_fee, fee_amount))
}

/// Check if operation would exceed maximum total shares limit
///
/// # Arguments
/// * `current_total_shares` - Current total shares in the vault
/// * `additional_shares` - Shares being added by the operation
/// * `max_total_shares` - Maximum total shares allowed
///
/// # Returns
/// * `Result<()>` - Validation result
pub fn check_max_total_shares(
    current_total_shares: u64,
    additional_shares: u64,
    max_total_shares: u64,
) -> Result<(), STokenCoreError> {
    if max_total_shares == u64::MAX {
        return Ok(()); // No limit set
    }

    let new_total_shares = current_total_shares
        .checked_add(additional_shares)
        .ok_or(STokenCoreError::MathOverflow)?;

    if new_total_shares > max_total_shares {
        return Err(STokenCoreError::MaxTotalSharesExceeded);
    }

    Ok(())
}

/// Check if operation would exceed maximum shares per user limit
///
/// # Arguments
/// * `user_current_shares` - User's current share balance
/// * `additional_shares` - Shares being added for the user
/// * `max_shares_per_user` - Maximum shares allowed per user
///
/// # Returns
/// * `Result<()>` - Validation result
pub fn check_max_shares_per_user(
    user_current_shares: u64,
    additional_shares: u64,
    max_shares_per_user: u64,
) -> Result<(), STokenCoreError> {
    if max_shares_per_user == u64::MAX {
        return Ok(()); // No limit set
    }

    let new_user_shares = user_current_shares
        .checked_add(additional_shares)
        .ok_or(STokenCoreError::MathOverflow)?;

    if new_user_shares > max_shares_per_user {
        return Err(STokenCoreError::MaxSharesPerUserExceeded);
    }

    Ok(())
}

/// Apply basis points to an amount (simple calculation without rounding)
///
/// # Arguments
/// * `amount` - Base amount
/// * `bps` - Basis points to apply
///
/// # Returns
/// * `Result<u64>` - Amount calculated as (amount * bps) / 10000
pub fn apply_basis_points(amount: u64, bps: u32) -> Result<u64, STokenCoreError> {
    if bps == 0 {
        return Ok(0);
    }

    let result = (amount as u128)
        .checked_mul(bps as u128)
        .ok_or(STokenCoreError::MathOverflow)?
        .checked_div(10000u128)
        .ok_or(STokenCoreError::MathOverflow)?;

    Ok(u64::try_from(result).map_err(|_| STokenCoreError::MathOverflow)?)
}

/// Convert S-Token shares to underlying asset amount (decimal-aware)
///
/// # Arguments
/// * `shares` - Amount of shares to convert
/// * `price` - Current S-Token price (fixed-point, 1e6 = 1 unit of underlying)
/// * `underlying_mint` - The underlying token mint account
/// * `shares_mint` - The shares token mint account
///
/// # Returns
/// * `Result<u64>` - Amount of underlying tokens
pub fn shares_to_amount_with_decimals(
    shares: u64,
    price: u64,
    underlying_mint_decimals: u32,
    shares_mint_decimals: u32,
) -> Result<u64, STokenCoreError> {
    shares_to_amount_core(
        shares,
        price,
        underlying_mint_decimals,
        shares_mint_decimals,
    )
}

/// Core logic for converting S-Token shares to underlying asset amount
///
/// # Arguments
/// * `shares` - Amount of shares to convert
/// * `price` - Current S-Token price (fixed-point, 1e6 = 1 unit of underlying)
/// * `underlying_decimals` - Decimals of the underlying token
/// * `shares_decimals` - Decimals of the shares token
///
/// # Returns
/// * `Result<u64>` - Amount of underlying tokens
pub fn shares_to_amount_core(
    shares: u64,
    price: u64,
    underlying_decimals: u32,
    shares_decimals: u32,
) -> Result<u64, STokenCoreError> {
    if price == 0 {
        return Err(STokenCoreError::InvalidPrice);
    }
    if shares == 0 {
        return Err(STokenCoreError::InvalidAmount);
    }

    // amount = (shares * price) / PRICE_PRECISION
    let amount_normalized = (shares as u128)
        .checked_mul(price as u128)
        .ok_or(STokenCoreError::MathOverflow)?
        .checked_div(PRICE_PRECISION as u128)
        .ok_or(STokenCoreError::MathOverflow)?;

    // Adjust for decimal differences
    let amount = if underlying_decimals >= shares_decimals {
        let decimal_diff = underlying_decimals - shares_decimals;
        amount_normalized
            .checked_mul(10_u128.pow(decimal_diff as u32))
            .ok_or(STokenCoreError::MathOverflow)?
    } else {
        let decimal_diff = shares_decimals - underlying_decimals;
        amount_normalized
            .checked_div(10_u128.pow(decimal_diff as u32))
            .ok_or(STokenCoreError::MathOverflow)?
    };

    let amount = u64::try_from(amount).map_err(|_| STokenCoreError::MathOverflow)?;
    if amount == 0 {
        return Err(STokenCoreError::ZeroAmountCalculated);
    }

    Ok(amount)
}

// Helper for safe u128 mul/div with u64 inputs and output
pub fn mul_div_u64_to_u64(a: u64, b: u64, denom: u64) -> Result<u64, STokenCoreError> {
    if denom == 0 {
        return Err(STokenCoreError::InvalidPrice);
    }

    let v = (a as u128)
        .checked_mul(b as u128)
        .ok_or(STokenCoreError::MathOverflow)?
        .checked_div(denom as u128)
        .ok_or(STokenCoreError::MathOverflow)?;
    Ok(u64::try_from(v).map_err(|_| STokenCoreError::MathOverflow)?)
}

// Helper function to calculate split fee tokens for source and destination vaults
pub fn calculate_split_fee_tokens(
    fee_amount: u64,
    source_price: u64,
    dest_price: u64,
) -> Result<(u64, u64), STokenCoreError> {
    if fee_amount == 0 {
        return Ok((0, 0));
    }

    // Split fee amount equally between source and destination
    let source_fee_amount = fee_amount / 2;
    let dest_fee_amount = fee_amount - source_fee_amount; // Handle odd numbers

    let source_fee_tokens = mul_div_u64_to_u64(
        source_fee_amount,
        crate::constants::PRICE_PRECISION,
        source_price,
    )?;

    let dest_fee_tokens = mul_div_u64_to_u64(
        dest_fee_amount,
        crate::constants::PRICE_PRECISION,
        dest_price,
    )?;

    Ok((source_fee_tokens, dest_fee_tokens))
}
