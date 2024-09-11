use anchor_lang::prelude::*;

use crate::{AuthRole, AuthorityRole, UnipetBox, ADMIN_ROLE, OPERATOR_ROLE, UNIPET_BOX_ACCOUNT};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space =8 + 250,
        seeds = [UNIPET_BOX_ACCOUNT],
        bump
    )]
    pub unipet_box: Box<Account<'info, UnipetBox>>,
    #[account(
        init,
        space = 8 + 170,
        payer = authority,
        seeds = [ADMIN_ROLE],
        bump,
    )]
    pub admin_account: Account<'info, AuthorityRole>,
    #[account(
        init,
        space = 8 + 170,
        payer = authority,
        seeds = [OPERATOR_ROLE],
        bump,
    )]
    pub operator_account: Account<'info, AuthorityRole>,

    #[account(mut, signer)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn init_handler(ctx: Context<Initialize>) -> Result<()> {
    let unipet_box = &mut ctx.accounts.unipet_box;
    let admin_account = &mut ctx.accounts.admin_account;
    let operator_account = &mut ctx.accounts.operator_account;

    unipet_box.init(
        admin_account.key(),
        operator_account.key(),
        ctx.bumps.unipet_box,
    )?;

    //SET ADMIN
    let authorities = vec![ctx.accounts.authority.key()];
    admin_account.initialize(&authorities, ctx.bumps.admin_account, AuthRole::Admin)?;
    operator_account.initialize(&authorities, ctx.bumps.operator_account, AuthRole::Operator)?;

    Ok(())
}
