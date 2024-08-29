use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use anchor_spl::token::transfer;
use anchor_spl::token::Transfer;

use crate::{BoxErrors, BoxStruct, ClaimBoxEvent, UserStruct, BOX_ACCOUNT, USER_ACCOUNT};

#[derive(Accounts)]
#[instruction(box_id: u8, id: u16)]
pub struct ClaimBox<'info> {
    #[account(
        // mut,
        seeds = [BOX_ACCOUNT, box_id.to_le_bytes().as_ref()],
        bump=box_account.bump,
        constraint = box_account.creator != Pubkey::default() @ BoxErrors::BoxClosed,
        // constraint = box_account.holder == holder.key() @ BoxErrors::InputInvalid,
    )]
    pub box_account: Box<Account<'info, BoxStruct>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = box_account,
    )]
    pub nft_box: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [USER_ACCOUNT, buyer.key.as_ref()],
        constraint = buyer_account.authority == buyer.key() @ BoxErrors::AccountInvalid,
        bump,
    )]
    pub buyer_account: Box<Account<'info, UserStruct>>,

    #[account(
        init_if_needed,
        payer= buyer,
        associated_token::mint = mint,
        associated_token::authority = buyer,
    )]
    pub nft_buyer: Box<Account<'info, TokenAccount>>,

    #[account(mut, signer)]
    pub buyer: Signer<'info>,

    ///CHECK: read only
    // pub holder: UncheckedAccount<'info>,
    pub mint: Account<'info, Mint>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn claim_handler(ctx: Context<ClaimBox>, box_id: u8, id: u16) -> Result<()> {
    let buyer_account = &mut ctx.accounts.buyer_account;
    let box_account = &ctx.accounts.box_account;
    // let buyer = &ctx.accounts.buyer;
    let mint = &ctx.accounts.mint;
    // msg!("BOX ID: {:}", box_id);
    // msg!("ID: {:}", id);

    let (claim_id, check) = buyer_account.get_claim(box_id, id);
    require_neq!(check, false, BoxErrors::InputInvalid);

    require_keys_eq!(
        buyer_account.boughts[claim_id].mint,
        mint.key(),
        BoxErrors::InputInvalid
    );

    //transfer NFT  from box to buyer
    msg!("Transfer NFT to buyer");
    let seeds: &[&[u8]] = &[BOX_ACCOUNT, &[box_id], &[box_account.bump]];
    let signer = &[&seeds[..]];
    transfer(
        CpiContext::new(
            mint.to_account_info(),
            Transfer {
                from: ctx.accounts.nft_box.to_account_info(),
                to: ctx.accounts.nft_buyer.to_account_info(),
                authority: box_account.to_account_info(),
            },
        )
        .with_signer(signer),
        1,
    )?;

    //update buyer account
    buyer_account.boughts[claim_id].is_claim = true;

    let lock = Clock::get().unwrap();
    emit!(ClaimBoxEvent {
        buyer: ctx.accounts.buyer.key(),
        box_id,
        id,
        time: lock.unix_timestamp,
        mint: mint.key(), //CHECK: mint.key().to_string() or mint.key().to_string(),
        slot: lock.slot,
    });

    Ok(())
}
