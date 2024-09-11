use anchor_lang::prelude::*;

use crate::UserClaim;

// total 4200
#[account]
// #[derive(InitSpace)]
pub struct UserStruct {
    pub bump: u8,                //1
    pub authority: Pubkey,       //32
    pub boughts: Vec<UserClaim>, //4+ 4*100 = 404
}

impl UserStruct {
    pub fn initialize(&mut self, authority: &Pubkey, bump: u8) -> Result<()> {
        self.authority = *authority;

        self.bump = bump;

        // self.boughts = Vec::with_capacity(50);
        self.boughts = Vec::with_capacity(100);

        // self.status = BoxStatus::Open;
        Ok(())
    }

    pub fn add_ids(&mut self, box_id: u8, ids: &Vec<u16>) -> Result<()> {
        for id in ids.iter() {
            self.add_id(box_id, *id)?;
        }

        Ok(())
    }

    pub fn add_id(&mut self, box_id: u8, id: u16) -> Result<()> {
        msg!("Add claim");
        self.boughts.push(UserClaim {
            box_id,
            id,
            is_claim: false,
        });

        Ok(())
    }

    pub fn get_claim(&self, box_id: u8, id: u16) -> (usize, bool) {
        for (i, user_claim) in self.boughts.iter().enumerate() {
            // msg!("user_claim: {:?}", user_claim);
            if user_claim.box_id == box_id && user_claim.id == id && !user_claim.is_claim {
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
