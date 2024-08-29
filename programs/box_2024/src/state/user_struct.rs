use anchor_lang::prelude::*;
// use solana_program::system_program;
// use crate::id;
// use anchor_lang::system_program;
// use std::cmp::max;

// use crate::error::*;
use crate::UserClaim;

// total 11045
#[account]
// #[derive(InitSpace)]
pub struct UserStruct {
    pub authority: Pubkey, //32

    // #[max_len(200)]
    pub boughts: Vec<UserClaim>, //4 +42 * 200 = 8404
    pub counter: u16,            //2
    pub bump: u8,                //1
}

impl UserStruct {
    // pub const SIZE_WITHOUT_CLAIMS: usize = 8 + 32 + 4 + 2 + 1;

    pub fn initialize(&mut self, authority: &Pubkey, bump: u8) -> Result<()> {
        self.authority = *authority;
        self.counter = 1;

        self.bump = bump;

        self.boughts = vec![];
        // self.boughts = Vec::with_capacity(100); //100 * 42 = 4200
        // self.boughts = vec![
        //     UserClaim {
        //         box_id: 0,
        //         id: 0,
        //         mint: Pubkey::default(),
        //         is_claim: false,
        //     };
        //     100
        // ];

        // self.status = BoxStatus::Open;
        Ok(())
    }

    // pub fn add_claims(&mut self, box_id: u8, mints: &Vec<Pubkey>) -> Result<()> {
    //     msg!("Inside add claims ");
    //     for (_, mint) in mints.iter().enumerate() {
    //         msg!("mint: {:}", *mint);

    //         // self.boughts[self.counter as usize] = UserClaim {
    //         //     box_id,
    //         //     id: id + (index as u64),
    //         //     mint: *mint,
    //         //     is_claim: false,
    //         // };
    //         self.boughts.push(UserClaim {
    //             box_id,
    //             id: self.counter,
    //             mint: *mint,
    //             is_claim: false,
    //         });
    //         self.counter = self.counter + 1;
    //     }

    //     Ok(())
    // }

    pub fn add_claim(&mut self, box_id: u8, mint: &Pubkey) -> Result<()> {
        self.boughts.push(UserClaim {
            box_id,
            id: self.counter,
            mint: *mint,
            is_claim: false,
        });
        self.counter = self.counter + 1;

        Ok(())
    }

    pub fn get_claim(&self, box_id: u8, id: u16) -> (usize, bool) {
        for (i, user_claim) in self.boughts.iter().enumerate() {
            // msg!("user_claim: {:?}", user_claim);
            if user_claim.box_id == box_id && user_claim.id == id && !user_claim.is_claim {
                return (i, true);
            }
        }
        (0, false)
    }

    pub fn size(boughts_length: usize) -> usize {
        return 8 + 32 + 4 + boughts_length * UserClaim::SIZE + 1;
    }

    // pub fn realloc_if_needed<'a>(
    //     buyer_account: AccountInfo<'a>,
    //     boughts_length: usize,
    //     rent_payer: AccountInfo<'a>,
    //     system_program: AccountInfo<'a>,
    // ) -> Result<bool> {
    //     // Sanity checks
    //     require_keys_eq!(*buyer_account.owner, id(), BoxErrors::IllegalAccountOwner);

    //     let current_account_size = buyer_account.data.borrow().len();
    //     msg!("current_account_size: {}", current_account_size);

    //     let account_size_to_fit_members = UserStruct::size(boughts_length);
    //     msg!("account_size_to_fit_members: {}", current_account_size);

    //     // Check if we need to reallocate space.
    //     if current_account_size >= account_size_to_fit_members {
    //         msg!("No need realloc");
    //         return Ok(false);
    //     }

    //     msg!("start reallocing");
    //     let new_size = max(
    //         current_account_size + (20 * UserClaim::SIZE), // We need to allocate more space. To avoid doing this operation too often.
    //         account_size_to_fit_members,
    //     );
    //     // Reallocate more space.
    //     AccountInfo::realloc(&buyer_account, new_size, false)?;

    //     // If more lamports are needed, transfer them to the account.
    //     let rent_exempt_lamports = Rent::get().unwrap().minimum_balance(new_size).max(1);
    //     let top_up_lamports =
    //         rent_exempt_lamports.saturating_sub(buyer_account.to_account_info().lamports());

    //     if top_up_lamports > 0 {
    //         require_keys_eq!(
    //             *system_program.key,
    //             system_program::ID,
    //             BoxErrors::InvalidAccount
    //         );

    //         system_program::transfer(
    //             CpiContext::new(
    //                 system_program,
    //                 system_program::Transfer {
    //                     from: rent_payer,
    //                     to: buyer_account,
    //                 },
    //             ),
    //             top_up_lamports,
    //         )?;
    //     }

    //     msg!("end reallocing");
    //     Ok(true)
    // }

    // pub fn add_mints(&mut self, mints: Vec<Pubkey>) -> Result<()> {
    //     for mint in mints.iter() {
    //         self.add_mint(&mint)?;
    //     }
    //     Ok(())
    // }

    // fn add_mint(&mut self, mint: &Pubkey) -> Result<()> {
    //     self.boughts.push(*mint);
    //     Ok(())
    // }
}
