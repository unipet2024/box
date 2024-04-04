use anchor_lang::prelude::*;

#[event]
pub struct CreationBoxEvent {
    pub authority: Pubkey,
    pub id: u8,
    pub name: String,
    pub starttime: i64,   //4
    pub endtime: i64,     //4
    pub currency: Pubkey, //32
    pub amount: u64,      //8
    pub time: i64,
}

#[event]
pub struct AddNftsBoxEvent {
    pub authority: Pubkey,
    pub id: u8,
    pub time: i64,
}

#[event]
pub struct CloseBoxEvent {
    pub authority: Pubkey,
    pub id: u8,
    pub time: i64,
}

#[event]
pub struct BuyBoxEvent {
    pub box_id: u8,
    pub id: u64,
    pub buyer: Pubkey,
    pub mints: Vec<Pubkey>,
    pub time: i64,
}
