use anchor_lang::prelude::*;

use crate::UserClaim;

// total 4200
#[account]
// #[derive(InitSpace)]
pub struct UserStruct {
    pub authority: Pubkey,       //32
    pub boughts: Vec<UserClaim>, //4+ 110*100 = 11004
    pub bump: u8,                //1
}

impl UserStruct {
    pub fn initialize(&mut self, authority: &Pubkey, bump: u8) -> Result<()> {
        self.authority = *authority;

        self.bump = bump;

        self.boughts = vec![];

        // self.status = BoxStatus::Open;
        Ok(())
    }

    pub fn add_claims(&mut self, box_id: u8, id: u64, mints: &Vec<Pubkey>) -> Result<()> {
        for (index, mint) in mints.iter().enumerate() {
            self.add_claim(box_id, id + (index as u64), mint)?;
        }

        Ok(())
    }

    pub fn add_claim(&mut self, box_id: u8, id: u64, mint: &Pubkey) -> Result<()> {
        self.boughts.push(UserClaim {
            box_id,
            id,
            mint: *mint,
            is_claim: false,
        });

        Ok(())
    }

    pub fn get_claim(&self, box_id: u8, id: u64) -> (usize, bool) {
        for (i, user_claim) in self.boughts.iter().enumerate() {
            // msg!("user_claim: {:?}", user_claim);
            if user_claim.box_id == box_id && user_claim.id == id && !user_claim.is_claim {
                return (i, true);
            }
        }
        (0, false)
    }

    pub fn get_size(&self) -> usize {
        return 32 + 1 + 4 + ((self.boughts.len()) * 42);
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
