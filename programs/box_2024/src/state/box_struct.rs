use anchor_lang::prelude::*;

use crate::{BoxErrors, Currency};

// total 100
#[account]
// #[derive(InitSpace)]
pub struct BoxStruct {
    pub bump: u8, //1
    pub id: u8,  //1
    pub counter: u64, //8
    pub starttime: i64,            //4
    pub endtime: i64,              //4
    pub creator: Pubkey,           //32
                     //1
    pub name: String,              //4+50
    pub rates: Vec<u8>,     // 4+ 1*10 = 14
    pub currencies: Vec<Currency>, //4 + 40*n
    // pub amount: u64,               //8
    pub mints: Vec<Pubkey>, // 4 + 32*100= 3200
    pub mints_purchased: Vec<Pubkey>,
    // pub holder: Pubkey, //32

}

impl BoxStruct {
    pub fn initialize(
        &mut self,
        creator: &Pubkey,
        id: u8,
        name: String,
        starttime: i64,
        endtime: i64,
        currencies: &Vec<Currency>,
        // amount: u64,
        rates: &Vec<u8>,
        mints: &Vec<Pubkey>,
        // holder: &Pubkey,
        bump: u8,
    ) -> Result<()> {
        self.creator = *creator;
        self.id = id;
        self.name = name;
        self.starttime = starttime;
        self.endtime = endtime;

        // self.amount = amount;
        // self.holder = *holder;

        self.set_currencies(&currencies)?;
        self.set_rates(&rates)?;
        self.set_mints(&mints)?;
        self.counter = 1;

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

    fn set_mints(&mut self, mints: &Vec<Pubkey>) -> Result<()> {
        self.mints = vec![];

        for mint in mints.iter() {
            self.add_mint(&mint)?;
        }
        Ok(())
    }

    pub fn add_mints(&mut self, mints: &Vec<Pubkey>) -> Result<()> {
        for mint in mints.iter() {
            self.add_mint(&mint)?;
        }
        Ok(())
    } 

    pub fn add_mint(&mut self, mint: &Pubkey) -> Result<()> {
        self.mints.push(*mint);
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
}
