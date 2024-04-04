pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod events;

use anchor_lang::prelude::*;

pub use constants::*;
pub use error::*;
pub use instructions::*;
pub use state::*;
pub use events::*;

declare_id!("72FjLwoRaTuaCeWUWBFYGLZo53tx99Wvb3FmE8jyhaqb");

#[program]
pub mod box_2024 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::init_handler(ctx)
    }

    pub fn set_operator(ctx: Context<AdminInstruction>, operator: Pubkey) -> Result<()> {
        admin_instruction::set_operator_handler(ctx, operator)
    }

    pub fn set_status(ctx: Context<AdminInstruction>, status: BoxStatus) -> Result<()> {
        admin_instruction::set_status_handler(ctx, status)
    }
}
