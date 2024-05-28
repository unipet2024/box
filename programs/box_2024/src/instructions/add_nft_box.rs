use crate::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount, Transfer},
};




#[derive(Accounts)]
#[instruction(id: u8)]
pub struct OperatorAddNftBox<'info> {
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
        bump = box_account.bump,
        // constraint = box_account.authority == authority.key() @ BoxErrors::OnlyOperator,
    )]
    pub box_account: Account<'info, BoxStruct>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint,
        associated_token::authority = box_account,
    )]
    pub box_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = authority,
    )]
    pub authority_ata: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    #[account(mut, signer)]
    pub authority: Signer<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handle_add_nft_to_box(ctx: Context<OperatorAddNftBox>, id: u8) -> Result<()> {
    let box_account = &mut ctx.accounts.box_account;
    let box_ata = &mut ctx.accounts.box_ata;
    let authority_ata = &mut ctx.accounts.authority_ata;
    let authority = &ctx.accounts.authority;
    let mint = &ctx.accounts.mint;
    let token_program = &ctx.accounts.token_program;

    //transfer nft from authority to box
   //transfer NFT to market
   msg!("Transfer NFT to market");
   anchor_spl::token::transfer(
       CpiContext::new(
           token_program.to_account_info(),
           Transfer {
               from: authority_ata.to_account_info(),
               to: box_ata.to_account_info(),
               authority: ctx.accounts.authority.to_account_info(),
           },
       ),
       1,
   )?;

    box_account.add_mint(&mint.key())?;

    let clock = Clock::get().unwrap();
    emit!(AddNftBoxEvent {
        authority: authority.key(),
        id,
        mint: mint.key(),
        time: clock.unix_timestamp,
        slot:clock.slot
    });


    Ok(())
   
}