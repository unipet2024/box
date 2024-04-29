use anchor_lang::prelude::*;
// use anchor_spl::{
//     associated_token::AssociatedToken,
//     token::{Mint, Token, TokenAccount},
// };

use solana_program::system_instruction;

// use anchor_spl::token::Transfer;
// use anchor_spl::token::{transfer, Transfer as SplTransfer};

use crate::{BoxErrors, BoxStruct, BuyBoxEvent, UserStruct, BOX_ACCOUNT, USER_ACCOUNT};

#[derive(Accounts)]
#[instruction(box_id: u8)]
pub struct BuyBoxSOL<'info> {
    #[account(
        mut,
        seeds = [BOX_ACCOUNT, box_id.to_le_bytes().as_ref()],
        bump=box_account.bump,
        constraint = box_account.creator != Pubkey::default() @ BoxErrors::BoxClosed,
        // constraint = box_account.get_currency_amount(Pubkey::default()) >0 @ BoxErrors::CurrencyNotSupport,
        constraint = box_account.mints.len() >0 @ BoxErrors::SoldOut,

    )]
    pub box_account: Box<Account<'info, BoxStruct>>,

    #[account(
        init_if_needed,
        space = 8 + 4200,
        payer=buyer,
        seeds = [USER_ACCOUNT, buyer.key.as_ref()],
        bump,
    )]
    pub buyer_account: Account<'info, UserStruct>,

    #[account(mut, signer)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn buy_box_sol_handler(ctx: Context<BuyBoxSOL>, box_id: u8) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let buyer_account = &mut ctx.accounts.buyer_account;
    let buyer = &ctx.accounts.buyer;

    let current = Clock::get()?.unix_timestamp;

    require_gte!(box_account.endtime, current, BoxErrors::BoxClosed);
    msg!("Current: {:}", current);
    msg!("Start: {:}", box_account.starttime);
    msg!("End: {:}", box_account.endtime);
    require_gte!(current, box_account.starttime, BoxErrors::BoxNotStartYet);

    let amount = box_account.get_currency_amount(Pubkey::default()) ;
    require_gt!(amount, 0 ,BoxErrors::CurrencyNotSupport);
    
    require_gte!(
        ctx.accounts.buyer.to_account_info().lamports(),
        amount,
        BoxErrors::InsufficientAmount
    );

    //transfer sol from buyer to box
    msg!("Transfer SOL from buyer to box");
    let transfer_instruction = system_instruction::transfer(
        buyer.key,
        box_account.to_account_info().key,
        amount,
    );

    // Invoke the transfer instruction
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            buyer.to_account_info(),
            box_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
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
        box_account.mints_purchased.push(mint);

        //update total
        total = total - 1;

        //update rand
        rand = (current % 1000000) as u64;
    }

    // require_eq!(1, 2);

    //update user struct
    //check is this is the first time buy, init
    if buyer_account.authority == Pubkey::default() {
        buyer_account.initialize(buyer.key, ctx.bumps.buyer_account)?;
    }
    buyer_account.add_claims(box_account.id, box_account.counter, &mint_unlocks)?;

    // //update box counter
    box_account.counter = box_account.counter + unlock as u64;

    emit!(BuyBoxEvent {
        box_id,
        id: box_account.counter,
        buyer: buyer.key(),
        mints: mint_unlocks,
        time: current
    });

    Ok(())
}
