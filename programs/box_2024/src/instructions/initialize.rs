use anchor_lang::prelude::*;

use crate::{ AuthRole, AuthorityRole, UnipetBox, ADMIN_ROLE, OPERATOR_ROLE, UNIPET_BOX_ACCOUNT};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,  
        payer = authority, 
        space =8 + 250,
        seeds = [UNIPET_BOX_ACCOUNT],
        bump
    )]
    pub unipet_box: Box<Account<'info, UnipetBox>>,
    #[account(
        init_if_needed,
        space = 60,
        payer = authority,
        seeds = [ADMIN_ROLE], 
        bump,
    )]
    pub admin_account:  Account<'info, AuthorityRole>,
    #[account(
        init_if_needed,
        space = 60,
        payer = authority,
        seeds = [OPERATOR_ROLE], 
        bump,
    )]
    pub operator_account:  Account<'info, AuthorityRole>,

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
    admin_account.initialize(
        ctx.accounts.authority.key(),
        ctx.bumps.admin_account,
        AuthRole::Admin,
    )?;

    //SET OPERATOR ROLE FOR ADMIN
    operator_account.initialize(
        ctx.accounts.authority.key(),
        ctx.bumps.operator_account,
        AuthRole::Operator,
    )?;

    Ok(())
}
