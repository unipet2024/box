use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use anchor_spl::token::transfer;
use anchor_spl::token::Transfer;

use crate::{BoxErrors, BoxStruct, UserStruct, BOX_ACCOUNT, USER_ACCOUNT};

#[derive(Accounts)]
#[instruction(box_id: u8, id: u64)]
pub struct ClaimBox<'info> {
    #[account(
        // mut,
        seeds = [BOX_ACCOUNT, box_id.to_le_bytes().as_ref()],
        bump=box_acount.bump,
        constraint = box_acount.authority != Pubkey::default() @ BoxErrors::BoxClosed,
    )]
    pub box_acount: Account<'info, BoxStruct>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = box_acount,
    )]
    pub nft_box: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [USER_ACCOUNT, buyer.key.as_ref()],
        constraint = buyer_account.authority == buyer.key() @ BoxErrors::AccountInvalid,
        bump,
    )]
    pub buyer_account: Account<'info, UserStruct>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = buyer,
    )]
    pub nft_buyer: Account<'info, TokenAccount>,

    #[account(mut, signer)]
    pub buyer: Signer<'info>,

    pub mint: Account<'info, Mint>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn claim_handler(ctx: Context<ClaimBox>, box_id: u8, id: u64) -> Result<()> {
    let buyer_account = &mut ctx.accounts.buyer_account;
    // let buyer = &ctx.accounts.buyer;
    let mint = &ctx.accounts.mint;

    let claim_id = buyer_account.get_claim(box_id, id);
    require_neq!(claim_id, 0, BoxErrors::InputInvalid);

    require_keys_eq!(
        buyer_account.boughts[claim_id].mint,
        mint.key(),
        BoxErrors::InputInvalid
    );

    //transfer NFT  from box to buyer
    msg!("Transfer NFT to buyer");
    let seeds: &[&[u8]] = &[BOX_ACCOUNT, &[buyer_account.bump, box_id]];
    let signer = &[&seeds[..]];
    transfer(
        CpiContext::new(
            mint.to_account_info(),
            Transfer {
                from: ctx.accounts.nft_box.to_account_info(),
                to: ctx.accounts.nft_buyer.to_account_info(),
                authority: buyer_account.to_account_info(),
            },
        )
        .with_signer(signer),
        1,
    )?;

    //update buyer account
    buyer_account.boughts[claim_id].is_claim = true;

    Ok(())
}
