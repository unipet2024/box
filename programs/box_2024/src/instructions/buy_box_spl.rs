use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

// use anchor_spl::token::Transfer;
use anchor_spl::token::{transfer, Transfer as SplTransfer};

use crate::{BoxErrors, BoxStruct, BuyBoxEvent, BOX_ACCOUNT};

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

    // #[account(
    //     init_if_needed,
    //     // space = UserStruct::size(20),
    //     // space = 8 + UserStruct::INIT_SPACE,
    //     space = 8 + 9000,
    //     payer=buyer,
    //     seeds = [USER_ACCOUNT, buyer.key.as_ref()],
    //     bump,
    // )]
    // pub buyer_account: Account<'info, UserStruct>,
    #[account(
        mut,
        associated_token::mint = currency_mint,
        associated_token::authority = buyer,
    )]
    pub currency_buyer: Box<Account<'info, TokenAccount>>,

    pub currency_mint: Box<Account<'info, Mint>>,

    #[account(mut, signer)]
    pub buyer: Signer<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn buy_box_spl_handler(ctx: Context<BuyBoxSPL>, box_id: u8) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    // let buyer_account = &mut ctx.accounts.buyer_account;
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

    //update user struct
    //check is this is the first time buy, init
    // if buyer_account.authority == Pubkey::default() {
    //     // msg!("Init buyer account");
    //     buyer_account.initialize(buyer.key, ctx.bumps.buyer_account)?;
    // }

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

    // msg!("Total: {:}", total);

    let mut unlock = (current % 100) as u8;
    // msg!("Unlock: {:}", unlock);

    for i in 0..box_account.rates.len() - 1 {
        if unlock >= box_account.rates[i] && unlock <= box_account.rates[i + 1] {
            unlock = (i + 1) as u8;
            break;
        }
    }

    if unlock as u64 > total {
        unlock = total as u8;
    }

    // msg!("Unlock: {:}", unlock);
    // require_eq!(1,2);

    // let mut rand = (current % 1000000) as u64;

    let mut mint_unlocks = vec![];

    // msg!("Get mint list");
    // let mut mint_index = 0;

    for _ in 0..unlock {
        let mint_index = (current as u64 % total) as usize;
        // let mint = box_account.mints[mint_index];

        //Add mint to list unlocks
        mint_unlocks.push(box_account.mints[mint_index]);

        // buyer_account.add_claim(box_account.id, &box_account.mints[mint_index])?;

        //remove mint from list mints
        // box_account.mints.remove(mint_index);
        // box_account.mints[mint_index].authority = buyer.key();

        //update total
        total = total - 1;

        //update rand
        // rand = (current % 1000000) as u64;
    }

    // require_eq!(1, 2);
    // msg!("Update user struct");

    msg!("Add claim: {:?}", mint_unlocks);

    //add mint to purchased mints
    box_account.add_purchase(&mint_unlocks, &buyer.key())?;

    // UserStruct::realloc_if_needed(
    //     buyer_account.to_account_info(),
    //     buyer_account.boughts.len() + (unlock as usize) + (100 as usize),
    //     ctx.accounts.buyer.to_account_info(),
    //     ctx.accounts.system_program.to_account_info(),
    // )?;

    // buyer_account.boughts.ca
    // let capacity = buyer_account.boughts.capacity();
    // let size_of_bought = std::mem::size_of::<UserClaim>();
    // msg!(
    //     "Capacity: {}, Size Of Bought: {}, Size: {}",
    //     capacity,
    //     size_of_bought,
    //     capacity * size_of_bought
    // );

    // buyer_account.add_claims(box_account.id, &mint_unlocks)?;

    msg!("set event");

    // update box counter
    // msg!("update box counter");
    // box_account.counter = box_account.counter + (unlock as u64);

    // let clock = Clock::get().unwrap();
    emit!(BuyBoxEvent {
        box_id,
        // id: box_account.counter,
        buyer: buyer.key(),
        mints: mint_unlocks,
        time: current // slot: clock.slot,
    });

    Ok(())
}
