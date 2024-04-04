use anchor_lang::prelude::*;

use crate::BoxErrors;

// total 100
#[account]
// #[derive(InitSpace)]
pub struct BoxStruct {
    pub authority: Pubkey, //32
    pub id: u8,            //1
    pub name: String,      //4+50
    pub starttime: i64,    //4
    pub endtime: i64,      //4
    pub currency: Pubkey,  //32
    pub amount: u64,       //8
    pub rates: Vec<u8>,    // 4+ 1*10 = 14
    pub mints: Vec<Pubkey>, // 4 + 32*1000= 32000
    pub mints_purchased: Vec<Pubkey>,
    pub counter: u64, //8
    pub bump: u8,     //1
}

impl BoxStruct {
    pub fn initialize(
        &mut self,
        authority: &Pubkey,
        id: u8,
        name: String,
        starttime: i64,
        endtime: i64,
        currency: Pubkey,
        amount: u64,
        rates: Vec<u8>,
        mints: &Vec<Pubkey>,
        bump: u8,
    ) -> Result<()> {
        self.authority = *authority;
        self.id = id;
        self.name = name;
        self.starttime = starttime;
        self.endtime = endtime;
        self.currency = currency;
        self.amount = amount;

        self.set_rates(rates)?;
        self.set_mints(&mints)?;
        self.counter = 1;

        self.bump = bump;

        // self.status = BoxStatus::Open;
        Ok(())
    }

    fn set_mints(&mut self, mints: &Vec<Pubkey>) -> Result<()> {
        self.mints = vec![];

        for mint in mints.iter() {
            self.add_mint(&mint)?;
        }
        Ok(())
    }

    pub fn add_mints(&mut self, mints: Vec<Pubkey>) -> Result<()> {
        for mint in mints.iter() {
            self.add_mint(&mint)?;
        }
        Ok(())
    }

    fn add_mint(&mut self, mint: &Pubkey) -> Result<()> {
        self.mints.push(*mint);
        Ok(())
    }

    fn set_rates(&mut self, rates: Vec<u8>) -> Result<()> {
        require_eq!(self.check_rates(&rates), true, BoxErrors::RateInvalid);

        self.rates = rates;
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
