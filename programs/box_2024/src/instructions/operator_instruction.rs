use anchor_lang::prelude::*;

use crate::{
    AddNftsBoxEvent, AuthRole, AuthorityRole, BoxErrors, BoxStruct, ChangCurrencyBoxEvent, ChangRateBoxEvent, ChangTimeBoxEvent, Currency, BOX_ACCOUNT, OPERATOR_ROLE
};

#[derive(Accounts)]
#[instruction(id: u8, mints: Vec<Pubkey>)]
pub struct AddMints<'info> {
    #[account(
        seeds = [OPERATOR_ROLE],
        bump = operator_account.bump,
        constraint = operator_account.is_authority(authority.key) == true @ BoxErrors::OnlyOperator,
        constraint = operator_account.role == AuthRole::Operator @ BoxErrors::OnlyOperator,
        constraint = operator_account.status == true @ BoxErrors::OnlyOperator,
    )]
    pub operator_account: Account<'info, AuthorityRole>,

    #[account(
        mut,
        seeds = [BOX_ACCOUNT, id.to_le_bytes().as_ref()],
        bump=box_account.bump,
        realloc = 8 + box_account.get_size() + mints.len()*32,
        realloc::zero = false,
        realloc::payer = authority,
    )]
    pub box_account: Account<'info, BoxStruct>,

    #[account(mut, signer)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn add_mints_handler(ctx: Context<AddMints>, id: u8, mints: Vec<Pubkey>) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let authority = &ctx.accounts.authority;

    box_account.add_mints(&mints)?;

    // box_account.

    emit!(AddNftsBoxEvent {
        authority: authority.key(),
        id,
        mints,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(box_id: u8)]
pub struct OperatorInstruction<'info> {
    #[account(
        seeds = [OPERATOR_ROLE],
        bump = operator_account.bump,
        constraint = operator_account.is_authority(authority.key) == true @ BoxErrors::OnlyOperator,
        constraint = operator_account.role == AuthRole::Operator @ BoxErrors::OnlyOperator,
        constraint = operator_account.status == true @ BoxErrors::OnlyOperator,
    )]
    pub operator_account: Account<'info, AuthorityRole>,

    #[account(
        mut,
        seeds = [BOX_ACCOUNT, box_id.to_le_bytes().as_ref()],
        bump = box_account.bump, 
    )]
    pub box_account: Account<'info, BoxStruct>,

    #[account(mut, signer)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
pub fn change_rate_handler(
    ctx: Context<OperatorInstruction>,
    box_id: u8,
    rates: Vec<u8>,
) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let authority = &ctx.accounts.authority;

    box_account.set_rates(&rates)?;

    emit!(ChangRateBoxEvent {
        authority: authority.key(),
        box_id,
        rates,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}

pub fn change_currencies_handler(
    ctx: Context<OperatorInstruction>,
    box_id: u8,
    currencies: Vec<Currency>,
) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let authority = &ctx.accounts.authority;

    box_account.set_currencies(&currencies)?;

    emit!(ChangCurrencyBoxEvent {
        authority: authority.key(),
        box_id,
        currencies,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}

pub fn change_time_handler(
    ctx: Context<OperatorInstruction>,
    box_id: u8,
    starttime: i64,
    endtime: i64
) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let authority = &ctx.accounts.authority;

    require_gt!(endtime, starttime, BoxErrors::InvalidTime);
    box_account.set_time(starttime, endtime)?;

    emit!(ChangTimeBoxEvent {
        authority: authority.key(),
        box_id,
        starttime,
        endtime,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}
