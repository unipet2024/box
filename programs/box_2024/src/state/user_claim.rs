use anchor_lang::prelude::*;

// total 41
#[account]
pub struct UserClaim {
    // pub authority: Pubkey, //32
    pub box_id: u8,   //1
    pub id: u64,      //8
    pub mint: Pubkey, //32
    pub is_claim: bool, // 1
                      // pub bump: u8,       //1
}

// impl UserClaim {
//     pub fn initialize(
//         &mut self,
//         // authority: &Pubkey,
//         box_id: u8,
//         id: u64,
//         mint: &Pubkey,
//         // bump: u8,
//     ) -> Result<()> {
//         // self.authority = *authority;
//         self.box_id = box_id;
//         self.id = id;
//         self.mint = *mint;
//         self.is_claim = false;
//         // self.bump = bump;

//         Ok(())
//     }

//     pub fn set_claim(&mut self, is_claimed: bool) {
//         self.is_claim = is_claimed;
//     }
// }
