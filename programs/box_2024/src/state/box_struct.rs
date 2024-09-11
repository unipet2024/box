use anchor_lang::prelude::*;
// use solana_program::system_program;
use crate::id;
use anchor_lang::system_program;
use std::cmp::max;

use crate::{BoxErrors, Currency};

// total 100
#[account]
// #[derive(InitSpace)]
pub struct BoxStruct {
    pub bump: u8,                  //1
    pub id: u8,                    //1
    pub counter: u16,              //8
    pub starttime: i64,            //4
    pub endtime: i64,              //4
    pub creator: Pubkey,           //32
    pub rates: Vec<u8>,            // 4+ 1*10 = 14
    pub currencies: Vec<Currency>, //4 + 40*n
    pub ids: Vec<u16>,             // 4 + 2*300= 604
}

impl BoxStruct {
    pub fn size(rates_length: usize, currencies_length: usize, mints_lenth: usize) -> usize {
        return 8
            + 1 //bump
            + 1 //id
            + 2 // counter
            + 8 //starttime
            + 8 //endtime
            + 32 //creator
            + (4 + rates_length)
            + (4 + currencies_length * 40)
            + (4 + mints_lenth * 32);
    }
    pub fn initialize(
        &mut self,
        creator: &Pubkey,
        id: u8,
        // name: String,
        starttime: i64,
        endtime: i64,
        currencies: &Vec<Currency>,
        // amount: u64,
        rates: &Vec<u8>,
        // mints: &Vec<Pubkey>,
        // holder: &Pubkey,
        bump: u8,
    ) -> Result<()> {
        self.creator = *creator;
        self.id = id;
        // self.name = name;
        self.starttime = starttime;
        self.endtime = endtime;

        // self.amount = amount;
        // self.holder = *holder;

        self.set_currencies(&currencies)?;
        self.set_rates(&rates)?;
        self.ids = Vec::with_capacity(300);
        // self.counter = 1;

        self.bump = bump;

        // self.status = BoxStatus::Open;
        Ok(())
    }

    pub fn set_currencies(&mut self, currencies: &Vec<Currency>) -> Result<()> {
        self.currencies = vec![];

        for currency in currencies.iter() {
            self.add_currency(currency)?;
        }
        Ok(())
    }

    fn add_currency(&mut self, currency: &Currency) -> Result<()> {
        self.currencies.push(Currency {
            mint: currency.mint,
            amount: currency.amount,
        });
        Ok(())
    }

    pub fn get_currency_amount(&self, mint: Pubkey) -> u64 {
        for currency in self.currencies.iter() {
            if currency.mint == mint {
                return currency.amount;
            }
        }
        0
    }

    pub fn add_ids(&mut self, length: u16) -> Result<()> {
        for id in self.counter..(self.counter + length) {
            self.add_id(id)?;
        }

        self.counter = self.counter + length;
        Ok(())
    }

    pub fn add_id(&mut self, id: u16) -> Result<()> {
        self.ids.push(id);
        Ok(())
    }

    pub fn set_rates(&mut self, rates: &Vec<u8>) -> Result<()> {
        require_eq!(self.check_rates(&rates), true, BoxErrors::RateInvalid);

        self.rates = vec![];

        for rate in rates.iter() {
            self.rates.push(*rate);
        }
        Ok(())
    }

    fn check_rates(&self, rates: &Vec<u8>) -> bool {
        if rates.len() == 0 || rates[0] != 0 || rates[rates.len() - 1] != 100 {
            return false;
        }

        for i in 0..(rates.len() - 1) {
            if rates[i] >= rates[i + 1] {
                return false;
            }
        }

        true
    }

    pub fn realloc_if_needed<'a>(
        box_account: AccountInfo<'a>,
        rates_length: usize,
        currencies_length: usize,
        mints_lenth: usize,
        rent_payer: AccountInfo<'a>,
        system_program: AccountInfo<'a>,
    ) -> Result<bool> {
        // Sanity checks
        require_keys_eq!(*box_account.owner, id(), BoxErrors::IllegalAccountOwner);

        let current_account_size = box_account.data.borrow().len();
        msg!("current_account_size: {}", current_account_size);

        let account_size_to_fit_members =
            BoxStruct::size(rates_length, currencies_length, mints_lenth);
        msg!(
            "account_size_to_fit_members: {}",
            account_size_to_fit_members
        );

        // Check if we need to reallocate space.
        if current_account_size >= account_size_to_fit_members {
            msg!("No need realloc");
            return Ok(false);
        }

        msg!("start reallocing");
        let new_size = max(
            current_account_size + 10240, // We need to allocate more space. To avoid doing this operation too often.
            account_size_to_fit_members,
        );
        // Reallocate more space.
        AccountInfo::realloc(&box_account, new_size, false)?;

        // If more lamports are needed, transfer them to the account.
        let rent_exempt_lamports = Rent::get().unwrap().minimum_balance(new_size).max(1);
        let top_up_lamports =
            rent_exempt_lamports.saturating_sub(box_account.to_account_info().lamports());

        if top_up_lamports > 0 {
            require_keys_eq!(
                *system_program.key,
                system_program::ID,
                BoxErrors::InvalidAccount
            );

            system_program::transfer(
                CpiContext::new(
                    system_program,
                    system_program::Transfer {
                        from: rent_payer,
                        to: box_account,
                    },
                ),
                top_up_lamports,
            )?;
        }

        msg!("end reallocing");
        Ok(true)
    }
}
