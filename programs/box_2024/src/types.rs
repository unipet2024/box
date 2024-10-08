use anchor_lang::prelude::*;

#[derive(PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub enum AuthRole {
    Admin,
    Operator,
}

#[derive(PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Clone, Debug, Copy)]
pub enum BoxStatus {
    Waiting,
    Open,
    Close,
}

#[derive(PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Clone, Debug, Copy, InitSpace)]
pub struct UserClaim {
    pub mint: Pubkey,
    pub authority: Pubkey, //32
    // pub box_id: u8,     //1
    // pub id: u16,        //8
    // pub mint: Pubkey,   //32
    pub is_claim: bool, // 1
}

impl UserClaim {
    pub const SIZE: usize = 1 + 8 + 32 + 1;
}

#[derive(PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Clone, Debug, Copy)]
pub struct Currency {
    pub mint: Pubkey, //32
    pub amount: u64,  // 8
}
