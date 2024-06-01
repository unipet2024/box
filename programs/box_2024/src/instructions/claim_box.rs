use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use anchor_spl::token::transfer;
use anchor_spl::token::Transfer;

use crate::{BoxErrors, BoxStruct, ClaimBoxEvent, UserStruct, BOX_ACCOUNT, USER_ACCOUNT};

#[derive(Accounts)]
#[instruction(box_id: u8, id: u64)]
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
        associated_token::mint = mint1,
        associated_token::authority = box_account,
    )]
    pub nft1_box: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint2,
        associated_token::authority = box_account,
    )]
    pub nft2_box: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint3,
        associated_token::authority = box_account,
    )]
    pub nft3_box: Box<Account<'info, TokenAccount>>,

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
        associated_token::mint = mint1,
        associated_token::authority = buyer,
    )]
    pub nft1_buyer: Box<Account<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer= buyer,
        associated_token::mint = mint2,
        associated_token::authority = buyer,
    )]
    pub nft2_buyer: Box<Account<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer= buyer,
        associated_token::mint = mint3,
        associated_token::authority = buyer,
    )]
    pub nft3_buyer: Box<Account<'info, TokenAccount>>,

    #[account(mut, signer)]
    pub buyer: Signer<'info>,

    ///CHECK: read only
    // pub holder: UncheckedAccount<'info>,
    pub mint1: Account<'info, Mint>,
    pub mint2: Account<'info, Mint>,
    pub mint3: Account<'info, Mint>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn claim_handler(ctx: Context<ClaimBox>, box_id: u8, id: u64) -> Result<()> {
    let buyer_account = &mut ctx.accounts.buyer_account;
    let box_account = &ctx.accounts.box_account;
    // let buyer = &ctx.accounts.buyer;
    let mint1 = &ctx.accounts.mint1;
    let mint2 = &ctx.accounts.mint2;
    let mint3 = &ctx.accounts.mint3;
    // msg!("BOX ID: {:}", box_id);
    // msg!("ID: {:}", id);

    let (claim_id, check) = buyer_account.get_claim(box_id, id);
    require_neq!(check, false, BoxErrors::InputInvalid);

    //transfer NFT  from box to buyer
    msg!("Transfer NFT to buyer");
    let seeds: &[&[u8]] = &[BOX_ACCOUNT, &[box_id], &[box_account.bump]];
    let signer = &[&seeds[..]];

    match buyer_account.boughts[claim_id].mints.len() {
        _ => {
            require_eq!(
                buyer_account.boughts[claim_id].mints[0],
                mint1.key(),
                BoxErrors::InputInvalid
            );

            transfer(
                CpiContext::new(
                    mint1.to_account_info(),
                    Transfer {
                        from: ctx.accounts.nft1_box.to_account_info(),
                        to: ctx.accounts.nft1_buyer.to_account_info(),
                        authority: box_account.to_account_info(),
                    },
                )
                .with_signer(signer),
                1,
            )?;
        }
        2 => {
            require_eq!(
                buyer_account.boughts[claim_id].mints[0],
                mint1.key(),
                BoxErrors::InputInvalid
            );
            require_eq!(
                buyer_account.boughts[claim_id].mints[1],
                mint2.key(),
                BoxErrors::InputInvalid
            );

            transfer(
                CpiContext::new(
                    mint1.to_account_info(),
                    Transfer {
                        from: ctx.accounts.nft1_box.to_account_info(),
                        to: ctx.accounts.nft1_buyer.to_account_info(),
                        authority: box_account.to_account_info(),
                    },
                )
                .with_signer(signer),
                1,
            )?;

            transfer(
                CpiContext::new(
                    mint2.to_account_info(),
                    Transfer {
                        from: ctx.accounts.nft2_box.to_account_info(),
                        to: ctx.accounts.nft2_buyer.to_account_info(),
                        authority: box_account.to_account_info(),
                    },
                )
                .with_signer(signer),
                1,
            )?;
        }
        3 => {
            require_eq!(
                buyer_account.boughts[claim_id].mints[0],
                mint1.key(),
                BoxErrors::InputInvalid
            );
            require_eq!(
                buyer_account.boughts[claim_id].mints[1],
                mint2.key(),
                BoxErrors::InputInvalid
            );
            require_eq!(
                buyer_account.boughts[claim_id].mints[2],
                mint3.key(),
                BoxErrors::InputInvalid
            );

            transfer(
                CpiContext::new(
                    mint1.to_account_info(),
                    Transfer {
                        from: ctx.accounts.nft1_box.to_account_info(),
                        to: ctx.accounts.nft1_buyer.to_account_info(),
                        authority: box_account.to_account_info(),
                    },
                )
                .with_signer(signer),
                1,
            )?;

            transfer(
                CpiContext::new(
                    mint2.to_account_info(),
                    Transfer {
                        from: ctx.accounts.nft2_box.to_account_info(),
                        to: ctx.accounts.nft2_buyer.to_account_info(),
                        authority: box_account.to_account_info(),
                    },
                )
                .with_signer(signer),
                1,
            )?;

            transfer(
                CpiContext::new(
                    mint3.to_account_info(),
                    Transfer {
                        from: ctx.accounts.nft3_box.to_account_info(),
                        to: ctx.accounts.nft3_buyer.to_account_info(),
                        authority: box_account.to_account_info(),
                    },
                )
                .with_signer(signer),
                1,
            )?;
        }
    }

    //update buyer account
    buyer_account.boughts[claim_id].is_claim = true;

    let lock = Clock::get().unwrap();
    emit!(ClaimBoxEvent {
        buyer: ctx.accounts.buyer.key(),
        box_id,
        id,
        time: lock.unix_timestamp,
        mints: buyer_account.boughts[claim_id].mints.clone(), //CHECK: mint.key().to_string() or mint.key().to_string(),
        slot: lock.slot,
    });

    Ok(())
}
