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

declare_id!("3HqqDK1dSviUyVUSXrT4W76PEjAJGJpytRHgezvYiUsR");

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
        currency: Pubkey,
        amount: u64,
        rates: Vec<u8>,
        nfts: Vec<Pubkey>,
    ) -> Result<()> {
        create_box::create_box_handler(ctx, name, starttime, endtime, currency, amount, rates, nfts)
    }

    pub fn add_mints(ctx: Context<AddMint>, id: u8, nfts: Vec<Pubkey>) -> Result<()> {
        add_nfts::add_mints_handler(ctx, id, nfts)
    }

    pub fn buy_box_spl(ctx: Context<BuyBoxSPL>, box_id: u8) -> Result<()> {
        buy_box_spl::buy_box_spl_handler(ctx, box_id)
    }

    pub fn buy_box_sol(ctx: Context<BuyBoxSOL>, box_id: u8) -> Result<()> {
        buy_box_sol::buy_box_sol_handler(ctx, box_id)
    }
}
