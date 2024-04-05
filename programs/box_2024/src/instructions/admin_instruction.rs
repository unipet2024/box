use anchor_lang::prelude::*;

use crate::{ AuthRole, AuthorityRole, BoxErrors, BoxStatus, SetAuthorityEvent, SetStatusEvent, UnipetBox, ADMIN_ROLE, OPERATOR_ROLE, UNIPET_BOX_ACCOUNT};

#[derive(Accounts)]
pub struct AdminInstruction<'info> {
    #[account( 
        mut,
        seeds = [UNIPET_BOX_ACCOUNT],
        bump,
        constraint = unipet_box.admin == admin_account.key() @ BoxErrors::AdminAccountInvalid,
        constraint = unipet_box.operator == operator_account.key() @ BoxErrors::OperatorAccountInvalid,
    )]
    pub unipet_box: Box<Account<'info, UnipetBox>>,

    #[account(
        mut,
        seeds = [ADMIN_ROLE], 
        bump=admin_account.bump,
        constraint = admin_account.is_authority(admin.key) == true @ BoxErrors::OnlyAdmin,
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

pub fn set_authority_handler(ctx: Context<AdminInstruction>, role: AuthRole, operators: Vec<Pubkey>) -> Result<()> {
    match role {
        AuthRole::Operator => set_operator_handler(ctx, operators),
        AuthRole::Admin => set_admin_handler(ctx, operators),
    }
}

fn set_operator_handler(ctx: Context<AdminInstruction>, operators: Vec<Pubkey>) -> Result<()> {
    let operator_account = &mut ctx.accounts.operator_account;

    for operator in operators.iter(){
        msg!("{:},", *operator)
    }

    operator_account.set_authorities(&operators)?;

    emit!(SetAuthorityEvent{
        admin: ctx.accounts.admin.key(),
        role: AuthRole::Operator,
        operators,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}

fn set_admin_handler(ctx: Context<AdminInstruction>, admins: Vec<Pubkey>) -> Result<()> {
    let admin_account = &mut ctx.accounts.admin_account;

    admin_account.set_authorities(&admins)?;

    emit!(SetAuthorityEvent{
        admin: ctx.accounts.admin.key(),
        role: AuthRole::Admin,
        operators: admins,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}

pub fn set_status_handler(ctx: Context<AdminInstruction>, status: &BoxStatus) -> Result<()> {
    let unipet_box = &mut ctx.accounts.unipet_box;

    unipet_box.set_status(*status);

    emit!(SetStatusEvent{
        admin: ctx.accounts.admin.key(),
        status: *status,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}