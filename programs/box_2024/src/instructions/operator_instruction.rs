use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::*;
use crate::events::*;
use crate::state::*;
use crate::types::*;

#[derive(Accounts)]
#[instruction(id: u8)]
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
        seeds = [BOX_ACCOUNT, id.to_le_bytes().as_ref()],
        bump=box_account.bump
    )]
    pub box_account: Account<'info, BoxStruct>,

    #[account(
        mut,
        seeds = [BOX_STORAGE, id.to_le_bytes().as_ref()],
        bump = box_storage.bump,
    )]
    pub box_storage: Account<'info, BoxStorage>,

    #[account(mut, signer)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn add_mints_handler(
    ctx: Context<OperatorInstruction>,
    id: u8,
    mints: Vec<Pubkey>,
) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let box_storage = &mut ctx.accounts.box_storage;

    let authority = &ctx.accounts.authority;

    // BoxStruct::realloc_if_needed(
    //     box_account.to_account_info(),
    //     box_account.rates.len(),
    //     box_account.currencies.len(),
    //     box_account.mints.len() + mints.len(),
    //     authority.to_account_info(),
    //     ctx.accounts.system_program.to_account_info(),
    // )?;

    box_storage.add_mints(&mints)?;
    box_account.add_ids(mints.len() as u16)?;

    let clock = Clock::get().unwrap();
    emit!(AddNftsBoxEvent {
        authority: authority.key(),
        id,
        mints,
        time: clock.unix_timestamp,
        slot: clock.slot
    });

    Ok(())
}

pub fn change_rate_handler(
    ctx: Context<OperatorInstruction>,
    id: u8,
    rates: Vec<u8>,
) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let authority = &ctx.accounts.authority;

    box_account.set_rates(&rates)?;

    emit!(ChangRateBoxEvent {
        authority: authority.key(),
        id,
        rates,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}
