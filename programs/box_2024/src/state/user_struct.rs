use anchor_lang::prelude::*;

use crate::UserClaim;

// total 4200
#[account]
// #[derive(InitSpace)]
pub struct UserStruct {
    pub bump: u8,                //1
    pub authority: Pubkey,       //32
    pub boughts: Vec<UserClaim>, //4+ 44*100 = 4404
}

impl UserStruct {
    pub fn initialize(&mut self, authority: &Pubkey, bump: u8) -> Result<()> {
        self.authority = *authority;

        self.bump = bump;

        // self.boughts = Vec::with_capacity(50);
        self.boughts = vec![];

        // self.status = BoxStatus::Open;
        Ok(())
    }

    pub fn add_claims(&mut self, box_id: u8, mints: &Vec<Pubkey>) -> Result<()> {
        for mint in mints.iter() {
            self.add_claim(box_id, mint)?;
        }

        Ok(())
    }

    pub fn add_claim(&mut self, box_id: u8, mint: &Pubkey) -> Result<()> {
        msg!("Add claim");
        self.boughts.push(UserClaim {
            box_id,
            // id,
            mint: *mint,
            is_claim: false,
        });

        Ok(())
    }

    pub fn get_claim(&self, box_id: u8, mint: &Pubkey) -> (usize, bool) {
        for (i, user_claim) in self.boughts.iter().enumerate() {
            // msg!("user_claim: {:?}", user_claim);
            if user_claim.box_id == box_id && user_claim.mint == *mint && !user_claim.is_claim {
                return (i, true);
            }
        }
        (0, false)
    }

    // pub fn add_mints(&mut self, mints: Vec<Pubkey>) -> Result<()> {
    //     for mint in mints.iter() {
    //         self.add_mint(&mint)?;
    //     }
    //     Ok(())
    // }

    // fn add_mint(&mut self, mint: &Pubkey) -> Result<()> {
    //     self.boughts.push(*mint);
    //     Ok(())
    // }
}
