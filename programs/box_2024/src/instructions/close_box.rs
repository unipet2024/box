use anchor_lang::prelude::*;

use crate::{
    AuthRole, AuthorityRole, BoxErrors, BoxStruct, CloseBoxEvent, BOX_ACCOUNT, OPERATOR_ROLE
};

#[derive(Accounts)]
#[instruction(id: u8)]
pub struct CloseBox<'info> {
    #[account(
        seeds = [OPERATOR_ROLE],
        bump = operator_account.bump,
        constraint = operator_account.is_authority(authority.key) == true @ BoxErrors::OnlyOperator,
        constraint = operator_account.role == AuthRole::Operator @ BoxErrors::OnlyOperator,
        constraint = operator_account.status == true @ BoxErrors::OnlyOperator,
    )]
    pub operator_account: Account<'info, AuthorityRole>,

    #[account(mut, signer)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        close = authority,
        seeds = [BOX_ACCOUNT, id.to_le_bytes().as_ref()],
        bump=box_acount.bump, 
    )]
    pub box_acount: Account<'info, BoxStruct>,
    pub system_program: Program<'info, System>,
}

pub fn close_box_handler(
    ctx: Context<CloseBox>,
    id: u8
) -> Result<()> {

    //

    emit!(CloseBoxEvent {
        authority: ctx.accounts.authority.key(),
        id,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}
