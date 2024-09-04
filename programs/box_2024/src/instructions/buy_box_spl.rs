use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

// use anchor_spl::token::Transfer;
use anchor_spl::token::{transfer, Transfer as SplTransfer};

use crate::{BoxErrors, BoxStruct, BuyBoxEvent, UserStruct, BOX_ACCOUNT, USER_ACCOUNT};

#[derive(Accounts)]
#[instruction(box_id: u8)]
pub struct BuyBoxSPL<'info> {
    #[account(
        mut,
        seeds = [BOX_ACCOUNT, box_id.to_le_bytes().as_ref()],
        bump = box_account.bump,
        constraint = box_account.creator != Pubkey::default() @ BoxErrors::BoxClosed,
        // constraint = box_account.currency == currency_mint.key() @ BoxErrors::CurrencyNotSupport,
        constraint = box_account.mints.len() >0 @ BoxErrors::SoldOut,

    )]
    pub box_account: Box<Account<'info, BoxStruct>>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = currency_mint,
        associated_token::authority = box_account
    )]
    pub currency_box: Box<Account<'info, TokenAccount>>,

    #[account(
        // init_if_needed,
        // space = 8 + 5000,
        // payer=buyer,
        mut,
        seeds = [USER_ACCOUNT, buyer.key.as_ref()],
        bump,
    )]
    pub buyer_account: Account<'info, UserStruct>,

    #[account(
        mut,
        associated_token::mint = currency_mint,
        associated_token::authority = buyer,
    )]
    pub currency_buyer: Account<'info, TokenAccount>,

    pub currency_mint: Account<'info, Mint>,

    #[account(mut, signer)]
    pub buyer: Signer<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn buy_box_spl_handler(ctx: Context<BuyBoxSPL>, box_id: u8) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let buyer_account = &mut ctx.accounts.buyer_account;
    let buyer = &ctx.accounts.buyer;

    let current = Clock::get()?.unix_timestamp;

    require_gte!(box_account.endtime, current, BoxErrors::BoxClosed);
    // msg!("Current: {:}", current);
    // msg!("Start: {:}", box_account.starttime);
    // msg!("End: {:}", box_account.endtime);
    require_gte!(current, box_account.starttime, BoxErrors::BoxNotStartYet);

    let amount = box_account.get_currency_amount(ctx.accounts.currency_mint.key());
    require_gt!(amount, 0, BoxErrors::CurrencyNotSupport);

    require_gte!(
        ctx.accounts.currency_buyer.amount,
        amount,
        BoxErrors::InsufficientAmount
    );

    //transfer currency from buyer to box
    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SplTransfer {
                authority: buyer.to_account_info(),
                from: ctx.accounts.currency_buyer.to_account_info(),
                to: ctx.accounts.currency_box.to_account_info(),
            },
        ),
        amount,
    )?;

    //get random
    let mut total = box_account.mints.len() as u64;

    msg!("Total: {:}", total);

    let mut unlock = (current % 100) as u8;
    msg!("Unlock: {:}", unlock);

    for i in 0..box_account.rates.len() - 1 {
        if unlock >= box_account.rates[i] && unlock <= box_account.rates[i + 1] {
            unlock = (i + 1) as u8;
            break;
        }
    }

    if unlock as u64 > total {
        unlock = total as u8;
    }
    msg!("Unlock: {:}", unlock);
    // require_eq!(1,2);

    let mut rand = (current % 1000000) as u64;

    let mut mint_unlocks = vec![];

    for i in 0..unlock {
        msg!("-----------------------");
        msg!("Rand: {:}", rand);
        msg!("I: {:}", i);

        let mint_index = (rand % total) as usize;
        let mint = box_account.mints[mint_index];

        msg!("{:} : {:}", mint_index, mint);

        //Add mint to list unlocks
        mint_unlocks.push(mint);

        //remove mint from list mints
        box_account.mints.remove(mint_index);

        //add mint to purchased mints
        // box_account.mints_purchased.push(mint);

        //update total
        total = total - 1;

        //update rand
        rand = (current % 1000000) as u64;
    }

    // require_eq!(1, 2);

    //update user struct
    //check is this is the first time buy, init
    msg!("Init user");
    if buyer_account.authority == Pubkey::default() {
        buyer_account.initialize(buyer.key, ctx.bumps.buyer_account)?;
    }
    msg!("Add claim");
    buyer_account.add_claims(box_account.id, &mint_unlocks)?;

    // //update box counter
    // box_account.counter = box_account.counter + unlock as u64;

    let clock = Clock::get().unwrap();
    emit!(BuyBoxEvent {
        box_id,
        // id: box_account.counter,
        buyer: buyer.key(),
        mints: mint_unlocks,
        time: clock.unix_timestamp,
        slot: clock.slot,
    });

    Ok(())
}
