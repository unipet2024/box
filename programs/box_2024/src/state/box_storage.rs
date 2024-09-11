use anchor_lang::prelude::*;
// use solana_program::system_program;
use crate::id;
use anchor_lang::system_program;
use std::cmp::max;

use crate::BoxErrors;

// total 100
#[account]
// #[derive(InitSpace)]
pub struct BoxStorage {
    pub id: u8,
    pub bump: u8,           //1
    pub mints: Vec<Pubkey>, // 4 + 32*300= 3200
}

impl BoxStorage {
    pub fn size(mints_lenth: usize) -> usize {
        return 8 + 1 + 1 + (4 + mints_lenth * 32);
    }
    pub fn initialize(&mut self, id: u8, bump: u8) -> Result<()> {
        self.id = id;
        self.bump = bump;
        self.mints = Vec::with_capacity(300);

        Ok(())
    }

    pub fn add_mints(&mut self, mints: &Vec<Pubkey>) -> Result<()> {
        for mint in mints.iter() {
            self.add_mint(&mint)?;
        }
        Ok(())
    }

    pub fn add_mint(&mut self, mint: &Pubkey) -> Result<()> {
        self.mints.push(*mint);
        Ok(())
    }

    pub fn realloc_if_needed<'a>(
        box_account: AccountInfo<'a>,
        mints_lenth: usize,
        rent_payer: AccountInfo<'a>,
        system_program: AccountInfo<'a>,
    ) -> Result<bool> {
        // Sanity checks
        require_keys_eq!(*box_account.owner, id(), BoxErrors::IllegalAccountOwner);

        let current_account_size = box_account.data.borrow().len();
        msg!("current_account_size: {}", current_account_size);

        let account_size_to_fit_members = BoxStorage::size(mints_lenth);
        msg!(
            "account_size_to_fit_members: {}",
            account_size_to_fit_members
        );

        // Check if we need to reallocate space.
        if current_account_size >= account_size_to_fit_members {
            msg!("No need realloc");
            return Ok(false);
        }

        msg!("start reallocing");
        let new_size = max(
            current_account_size + 10240, // We need to allocate more space. To avoid doing this operation too often.
            account_size_to_fit_members,
        );
        // Reallocate more space.
        AccountInfo::realloc(&box_account, new_size, false)?;

        // If more lamports are needed, transfer them to the account.
        let rent_exempt_lamports = Rent::get().unwrap().minimum_balance(new_size).max(1);
        let top_up_lamports =
            rent_exempt_lamports.saturating_sub(box_account.to_account_info().lamports());

        if top_up_lamports > 0 {
            require_keys_eq!(
                *system_program.key,
                system_program::ID,
                BoxErrors::InvalidAccount
            );

            system_program::transfer(
                CpiContext::new(
                    system_program,
                    system_program::Transfer {
                        from: rent_payer,
                        to: box_account,
                    },
                ),
                top_up_lamports,
            )?;
        }

        msg!("end reallocing");
        Ok(true)
    }
}
