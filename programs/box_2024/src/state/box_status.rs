use anchor_lang::prelude::*;
// use anchor_lang::Space;

#[derive(PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub enum BoxStatus {
    Waiting,
    Open,
    Close,
}
