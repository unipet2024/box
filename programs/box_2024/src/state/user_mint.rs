use anchor_lang::prelude::*;

// use crate::UserClaim;

// total 130
#[account]
pub struct UserMint {
    pub bump: u8,           //1
    pub authority: Pubkey,  //32
    pub mints: Vec<Pubkey>, //4+ 44*100 = 4404
    pub claimed: bool //1
}

impl UserMint {
    pub fn initialize(&mut self, authority: &Pubkey, bump: u8, mints: &Vec<Pubkey>) -> Result<()> {
        self.authority = *authority;
        self.bump = bump;
        self.mints = vec![];
        for mint in mints.iter() {
            self.mints.push(*mint);
        }
        Ok(())
    }
}
