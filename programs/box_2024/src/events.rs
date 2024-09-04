use anchor_lang::prelude::*;

use crate::{AuthRole, BoxStatus, Currency};

#[event]
pub struct SetAuthorityEvent {
    pub admin: Pubkey,
    pub role: AuthRole,
    pub operators: Vec<Pubkey>,
    pub time: i64,
}

#[event]
pub struct SetStatusEvent {
    pub admin: Pubkey,
    pub status: BoxStatus,
    pub time: i64,
}

#[event]
pub struct CreationBoxEvent {
    pub authority: Pubkey,
    pub id: u8,
    // pub name: String,
    pub start_time: i64,           //4
    pub end_time: i64,             //4
    pub currencies: Vec<Currency>, //32
    pub time: i64,
    pub slot: u64,
}

#[event]
pub struct AddNftsBoxEvent {
    pub authority: Pubkey,
    pub id: u8,
    pub mints: Vec<Pubkey>,
    pub time: i64,
    pub slot: u64,
}

#[event]
pub struct AddNftBoxEvent {
    pub authority: Pubkey,
    pub id: u8,
    pub mint: Pubkey,
    pub time: i64,
    pub slot: u64,
}
#[event]
pub struct ChangRateBoxEvent {
    pub authority: Pubkey,
    pub id: u8,
    pub rates: Vec<u8>,
    pub time: i64,
}

#[event]
pub struct CloseBoxEvent {
    pub authority: Pubkey,
    pub id: u8,
    pub time: i64,
    pub slot: u64,
}

#[event]
pub struct BuyBoxEvent {
    pub box_id: u8,
    // pub id: u64,
    pub buyer: Pubkey,
    pub mints: Vec<Pubkey>,
    pub time: i64,
    pub slot: u64,
}

#[event]
pub struct ClaimBoxEvent {
    pub buyer: Pubkey,
    pub box_id: u8,
    // pub id: u64,
    pub mint: Pubkey,
    pub time: i64,
    pub slot: u64,
}
