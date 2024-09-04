use anchor_lang::prelude::*;

use crate::{UserStruct, USER_ACCOUNT};

#[derive(Accounts)]
pub struct InitBuyer<'info> {
    #[account(
        init,
        space = 8 + 5000,
        payer=buyer,
        seeds = [USER_ACCOUNT, buyer.key.as_ref()],
        bump,
    )]
    pub buyer_account: Account<'info, UserStruct>,

    #[account(mut, signer)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn init_buyer_handle(ctx: Context<InitBuyer>) -> Result<()> {
    let buyer_account = &mut ctx.accounts.buyer_account;
    let buyer = &ctx.accounts.buyer;

    buyer_account.initialize(buyer.key, ctx.bumps.buyer_account)?;
    Ok(())
}
