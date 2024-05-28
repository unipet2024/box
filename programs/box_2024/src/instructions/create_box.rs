use anchor_lang::prelude::*;

use crate::{
    AuthRole, AuthorityRole, BoxErrors, BoxStruct, CreationBoxEvent, Currency, UnipetBox,
    BOX_ACCOUNT, OPERATOR_ROLE, UNIPET_BOX_ACCOUNT,
};

#[derive(Accounts)]
#[instruction(
    name: String,
    starttime: i64,
    endtime: i64,
    currencies: Vec<Currency>,
    rates: Vec<u8>,
    nfts: Vec<Pubkey>
)]
pub struct CreateBox<'info> {
    #[account(
        mut,
        seeds = [UNIPET_BOX_ACCOUNT],
        bump = unipet_box.bump,
        constraint = unipet_box.operator.key() == operator_account.key() @ BoxErrors::OperatorAccountInvalid,
    )]
    pub unipet_box: Box<Account<'info, UnipetBox>>,

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
        init,
        payer=authority,
        space = 8 + 3300,
        seeds = [BOX_ACCOUNT, unipet_box.box_id.to_le_bytes().as_ref()],
        // seeds = [BOX_ACCOUNT],
        bump,
    )]
    pub box_account: Account<'info, BoxStruct>,
    pub system_program: Program<'info, System>,
}

pub fn create_box_handler(
    ctx: Context<CreateBox>,
    name: String,
    start_time: i64,
    end_time: i64,
    currencies: Vec<Currency>,
    rates: Vec<u8>,
    nfts: Vec<Pubkey>,
) -> Result<()> {
    let unipet_box = &mut ctx.accounts.unipet_box;
    let box_account = &mut ctx.accounts.box_account;
    let authority = &ctx.accounts.authority;

    //Check time
    require_gt!(end_time, start_time, BoxErrors::InvalidTime);

    //check holder
    // require_keys_neq!(holder, Pubkey::default(), BoxErrors::InputInvalid);

    let current = Clock::get()?.unix_timestamp;

    // require_gt!(starttime, current, BoxErrors::InvalidTime);

    let box_id = unipet_box.box_id;

    box_account.initialize(
        authority.key,
        box_id,
        name.clone(),
        start_time,
        end_time,
        &currencies,
        &rates,
        &nfts,
        ctx.bumps.box_account,
    )?;

    unipet_box.box_id = box_id + 1;

    let clock = Clock::get().unwrap();

    emit!(CreationBoxEvent {
        authority: authority.key(),
        id: box_id,
        name,
        start_time,
        end_time,
        currencies,
        slot: clock.slot,
        time: current
    });
    Ok(())
}
