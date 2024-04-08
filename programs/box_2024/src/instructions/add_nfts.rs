use anchor_lang::prelude::*;

use crate::{
    AddNftsBoxEvent, AuthRole, AuthorityRole, BoxErrors, BoxStruct, BOX_ACCOUNT, OPERATOR_ROLE,
};

#[derive(Accounts)]
#[instruction(id: u8)]
pub struct AddMint<'info> {
    #[account(
        seeds = [OPERATOR_ROLE],
        bump = operator_account.bump,
        constraint = operator_account.is_authority(authority.key) == true @ BoxErrors::OnlyOperator,
        constraint = operator_account.role == AuthRole::Operator @ BoxErrors::OnlyOperator,
        constraint = operator_account.status == true @ BoxErrors::OnlyOperator,
    )]
    pub operator_account: Account<'info, AuthorityRole>,

    #[account(
        mut,
        seeds = [BOX_ACCOUNT, id.to_le_bytes().as_ref()],
        bump=box_acount.bump,
        // constraint = box_acount.authority == authority.key() @ BoxErrors::OnlyOperator,
    )]
    pub box_acount: Account<'info, BoxStruct>,

    #[account(mut, signer)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn add_mints_handler(ctx: Context<AddMint>, id: u8, mints: Vec<Pubkey>) -> Result<()> {
    let box_account = &mut ctx.accounts.box_acount;
    let authority = &ctx.accounts.authority;

    box_account.add_mints(mints)?;

    // TODO: thêm logic check isApproved
    // mint NFT cho holder
    // từ holder approve nft cho box

    emit!(AddNftsBoxEvent {
        authority: authority.key(),
        id,
        time: Clock::get()?.unix_timestamp
    });

    Ok(())
}
