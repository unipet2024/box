use anchor_lang::prelude::*;

#[error_code]
pub enum BoxErrors {
    #[msg("Box closed")]
    BoxClosed,

    #[msg("Box not start yet")]
    BoxNotStartYet,

    #[msg("Sold out")]
    SoldOut,

    #[msg("Currency not support")]
    CurrencyNotSupport,

    #[msg("Account invalid")]
    AccountInvalid,

    #[msg("Admin account invalid")]
    AdminAccountInvalid,

    #[msg("Operator account invalid")]
    OperatorAccountInvalid,

    #[msg("Only admin")]
    OnlyAdmin,

    #[msg("Only Operator")]
    OnlyOperator,

    #[msg("Operator not change")]
    OperatorNotChange,

    #[msg("Input invalid")]
    InputInvalid,

    #[msg("Rate Invalid")]
    RateInvalid,

    #[msg("Insufficient amount")]
    InsufficientAmount,

    #[msg("Only owner")]
    OnlyOwner,

    #[msg("Invalid time")]
    InvalidTime,
}

impl From<BoxErrors> for ProgramError {
    fn from(e: BoxErrors) -> Self {
        ProgramError::Custom(e as u32)
    }
}
