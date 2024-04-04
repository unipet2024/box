use anchor_lang::prelude::*;

use crate::{ AuthRole, AuthorityRole, BoxErrors, BoxStatus, UnipetBox, ADMIN_ROLE, OPERATOR_ROLE, UNIPET_BOX_ACCOUNT};

#[derive(Accounts)]
pub struct AdminInstruction<'info> {
    #[account( 
        mut,
        seeds = [UNIPET_BOX_ACCOUNT],
        bump,
        constraint = market.admin == admin_account.key() @ BoxErrors::AdminAccountInvalid,
        constraint = market.operator == operator_account.key() @ BoxErrors::OperatorAccountInvalid,
    )]
    pub market: Box<Account<'info, UnipetBox>>,

    #[account(
        seeds = [ADMIN_ROLE], 
        bump=admin_account.bump,
        constraint = admin_account.authority == admin.key() @ BoxErrors::OnlyAdmin,
        constraint = admin_account.role == AuthRole::Admin @ BoxErrors::OnlyAdmin,
        constraint = admin_account.status == true @ BoxErrors::OnlyAdmin,
    )]
    pub admin_account:  Account<'info, AuthorityRole>,

    #[account(
        mut,
        seeds = [OPERATOR_ROLE], 
        bump=operator_account.bump,
        constraint = operator_account.role == AuthRole::Operator @ BoxErrors::OnlyOperator,
        constraint = operator_account.status == true @ BoxErrors::OnlyOperator,
    )]
    pub operator_account:  Account<'info, AuthorityRole>,

    #[account(mut, signer)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>, 
}

pub fn set_operator_handler(ctx: Context<AdminInstruction>, operator: Pubkey) -> Result<()> {
    let operator_account = &mut ctx.accounts.operator_account;

    require_keys_neq!(
        operator_account.authority,
        operator,
        BoxErrors::OperatorNotChange
    );

    operator_account.set_authority(operator);

    Ok(())
}

pub fn set_status_handler(ctx: Context<AdminInstruction>, status: BoxStatus) -> Result<()> {
    let market = &mut ctx.accounts.market;

    market.set_status(status);
    Ok(())
}