use anchor_lang::prelude::*;

use crate::BoxStatus;

// total 230
#[account]
pub struct UnipetBox {

    pub box_id: u8,    
    pub bump: u8,     //1
    pub admin: Pubkey,     //32
    pub operator: Pubkey,  //32
    pub status: BoxStatus, // 1
}

impl UnipetBox {
    pub fn init(&mut self, admin: Pubkey, operator: Pubkey, bump: u8) -> Result<()> {
        self.admin = admin;
        self.operator = operator;
        self.box_id = 1;
        self.bump = bump;
        self.status = BoxStatus::Waiting;

        Ok(())
    }

    pub fn set_status(&mut self, status: BoxStatus) {
        self.status = status;
    }

    // pub fn get_box_id(&self) -> u8 {
    //     self.box_id
    // }

    // pub fn increase_box_id(&mut self) {
    //     self.box_id = self.box_id + 1;
    // }
}
