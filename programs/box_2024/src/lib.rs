pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;
pub mod types;

use anchor_lang::prelude::*;

pub use constants::*;
pub use error::*;
pub use events::*;
pub use instructions::*;
pub use state::*;
pub use types::*;

declare_id!("88R4EnKBkAZ746qLeMDVmvYL4DfeyYmt4TawJchzT2vL");

#[program]
pub mod box_2024 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::init_handler(ctx)
    }

    pub fn set_authority(
        ctx: Context<AdminInstruction>,
        role: AuthRole,
        operators: Vec<Pubkey>,
    ) -> Result<()> {
        admin_instruction::set_authority_handler(ctx, role, operators)
    }

    pub fn set_status(ctx: Context<AdminInstruction>, status: BoxStatus) -> Result<()> {
        admin_instruction::set_status_handler(ctx, &status)
    }

    pub fn create_box(
        ctx: Context<CreateBox>,
        name: String,
        starttime: i64,
        endtime: i64,
        currencies: Vec<Currency>,
        rates: Vec<u8>,
        nfts: Vec<Pubkey>,
    ) -> Result<()> {
        create_box::create_box_handler(ctx, name, starttime, endtime, currencies, rates, nfts)
    }

    pub fn add_mints(ctx: Context<OperatorInstruction>, id: u8, nfts: Vec<Pubkey>) -> Result<()> {
        operator_instruction::add_mints_handler(ctx, id, nfts)
    }

    pub fn change_rates(ctx: Context<OperatorInstruction>, id: u8, rates: Vec<u8>) -> Result<()> {
        operator_instruction::change_rate_handler(ctx, id, rates)
    }

    pub fn buy_box_spl(ctx: Context<BuyBoxSPL>, box_id: u8) -> Result<()> {
        buy_box_spl::buy_box_spl_handler(ctx, box_id)
    }

    pub fn buy_box_sol(ctx: Context<BuyBoxSOL>, box_id: u8) -> Result<()> {
        buy_box_sol::buy_box_sol_handler(ctx, box_id)
    }

    pub fn claim(ctx: Context<ClaimBox>, box_id: u8, id: u64) -> Result<()> {
        claim_box::claim_handler(ctx, box_id, id)
    }
}
