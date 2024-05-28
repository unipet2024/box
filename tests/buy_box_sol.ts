import * as anchor from "@coral-xyz/anchor";
import { Program, Wallet } from "@coral-xyz/anchor";
import { Box2024 } from "../target/types/box_2024";
import { assert } from "chai";

import { setTimeout } from "timers/promises";

import {
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmRawTransaction,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";

import {
  createMint,
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  createAccount,
  approve,
} from "@solana/spl-token";

const address0 = new PublicKey("11111111111111111111111111111111");

describe("box_2024_sol", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Box2024 as Program<Box2024>;
  const owner = provider.wallet as Wallet;
  const payer = owner.payer;
  let conn = program.provider.connection;

  // it("test buy box sol! ", async () => {
  //   const unipet_box_account = getUnipetBoxAccount();
  //   const admin_account = getAdminAccount();
  //   const operator_account = getOperatorAccount();
  //   const box_holder = new anchor.web3.Keypair();

  //   await airdrop(conn, owner, box_holder.publicKey);

  //   await program.methods
  //     .initialize()
  //     .accounts({
  //       unipetBox: unipet_box_account,
  //       adminAccount: admin_account,
  //       operatorAccount: operator_account,
  //     })
  //     .rpc();

  //   let unipet_box_account_info = await program.account.unipetBox.fetch(
  //     unipet_box_account
  //   );

  //   assert.equal(unipet_box_account_info.boxId, 1);

  //   const starttime = Math.floor(new Date().getTime() / 1000 - 1000);
  //   const endtime = starttime + 5000;
  //   const rates = [0, 50, 90, 100];
  //   const box1_name = "BOX 1";
  //   const price = 100;

  //   const box_acount = getBoxAccount(1);

  //   try {
  //     await program.methods
  //       .createBox(
  //         box1_name,
  //         new anchor.BN(starttime),
  //         new anchor.BN(endtime),
  //         address0,
  //         new anchor.BN(price),
  //         Buffer.from(rates),
  //         [],
  //         box_holder.publicKey
  //       )
  //       .accounts({
  //         unipetBox: unipet_box_account,
  //         operatorAccount: operator_account,
  //         boxAcount: box_acount,
  //       })
  //       .rpc();
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   console.log("------------Check box id after creating-------------");
  //   unipet_box_account_info = await program.account.unipetBox.fetch(
  //     unipet_box_account
  //   );

  //   assert.equal(unipet_box_account_info.boxId, 2);

  //   console.log("------------Check box-------------");
  //   let box_account_info = await program.account.boxStruct.fetch(box_acount);
  //   // console.log(box_account_info);
  //   assert.equal(box_account_info.name, box1_name);
  //   assert.equal(box_account_info.amount.toNumber(), price);
  //   assert.equal(box_account_info.currency.toString(), address0.toString());
  //   assert.equal(box_account_info.endtime.toNumber(), endtime);
  //   assert.equal(box_account_info.starttime.toNumber(), starttime);
  //   assert.equal(box_account_info.counter.toNumber(), 1);
  //   assert.equal(box_account_info.id, 1);
  //   assert.deepEqual([...box_account_info.rates], rates);

  //   console.log("------------Create NFT-------------");

  //   console.log("--------------Buyer 1--------------");
  //   const buyer1 = await create_user();
  //   console.log("--------------Buyer 2--------------");
  //   const buyer2 = await create_user();
  //   console.log("--------------Buyer 3--------------");
  //   const buyer3 = await create_user();

  //   let mint_list = [];
  //   let mints_box_account = {};
  //   let mints_buyer1 = {};
  //   let mints_buyer2 = {};
  //   let mints_buyer3 = {};
  //   let mints_holder = {}

  //   for (let i = 0; i < 10; i++) {
  //     const mintNew = await createMint(conn, payer, owner.publicKey, null, 0);
  //     console.log("mint: ", mintNew.toString());
  //     mint_list.push(mintNew);

  //     let mint_box = await getOrCreateAta(conn, payer, mintNew, box_acount);
  //     let mint_holder = await getOrCreateAta(
  //       conn,
  //       payer,
  //       mintNew,
  //       box_holder.publicKey
  //     );

  //     let mint_buyer1 = await getAta(mintNew, buyer1.user.publicKey);
  //     let mint_buyer2 = await getAta(mintNew, buyer2.user.publicKey);
  //     let mint_buyer3 = await getAta(mintNew, buyer3.user.publicKey);

  //     approve(
  //       conn,
  //       box_holder, // holder
  //       mint_holder.address, //holder ata
  //       box_acount, // box 
  //       box_holder.publicKey, //holder pubkey
  //       1 // NFT = 1
  //     );

  //     mints_box_account[mintNew.toString()] = mint_box;
  //     mints_buyer1[mintNew.toString()] = mint_buyer1;
  //     mints_buyer2[mintNew.toString()] = mint_buyer2;
  //     mints_buyer3[mintNew.toString()] = mint_buyer3;
  //     mints_holder[mintNew.toString()] = mint_holder

  //     // await mintTo(conn, owner.payer, mintNew, mint_box.address, payer, 1);
  //     await mintTo(conn, owner.payer, mintNew, mint_holder.address, payer, 1);
  //   }

  //   await program.methods
  //     .addMints(1, mint_list)
  //     .accounts({
  //       operatorAccount: operator_account,
  //       boxAcount: box_acount,
  //     })
  //     .rpc();

  //   box_account_info = await program.account.boxStruct.fetch(box_acount);
  //   assert.deepEqual(box_account_info.mints, mint_list);

  //   // console.log(box_account_info);

  //   console.log("--------------Buyer 1 buy box 1--------------");
  //   let box_balance_before = await conn.getBalance(box_acount);
  //   try {
  //     await program.methods
  //       .buyBoxSol(1)
  //       .accounts({
  //         boxAcount: box_acount,
  //         buyer: buyer1.user.publicKey,
  //         buyerAccount: buyer1.buyer_account,
  //       })
  //       .signers([buyer1.user])
  //       .rpc();
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   box_account_info = await program.account.boxStruct.fetch(box_acount);

  //   let buyer1_account_info = await program.account.userStruct.fetch(
  //     buyer1.buyer_account
  //   );

  //   assert.equal(
  //     buyer1_account_info.authority.toString(),
  //     buyer1.user.publicKey.toString()
  //   );

  //   let box_balance = await conn.getBalance(box_acount);

  //   assert.equal(box_balance_before + 100, box_balance);

  //   console.log(buyer1_account_info.boughts);

  //   // console.log(box_account_info);
  //   console.log("-----------Box counter---------------");
  //   console.log(box_account_info.counter.toNumber());

  //   console.log("-----------Box purchased---------------");
  //   console.log(box_account_info.mintsPurchased);

  //   console.log("-----------Box mints---------------");
  //   console.log(box_account_info.mints);

  //   console.log("-----------Buyer 1 claim---------------");

  //   let buyer1_claims = buyer1_account_info.boughts;

  //   for (let i = 0; i < buyer1_claims.length; i++) {
  //     console.log(
  //       "=====> Buyer 1 claim box id = ",
  //       buyer1_claims[i].boxId,
  //       " id = ",
  //       buyer1_claims[i].id.toNumber(),
  //       " mint = ",
  //       buyer1_claims[i].mint.toString()
  //     );

  //     if (!buyer1_claims[i].isClaim) {
  //       let mint = buyer1_claims[i].mint;

  //       try {
  //         await program.methods
  //           .claim(buyer1_claims[i].boxId, buyer1_claims[i].id)
  //           .accounts({
  //             mint: mint,
  //             boxAcount: box_acount,
  //             buyer: buyer1.user.publicKey,
  //             buyerAccount: buyer1.buyer_account,
  //             nftHolder: mints_holder[mint.toString()].address,
  //             nftBuyer: mints_buyer1[mint.toString()],
  //             holder: box_holder.publicKey
  //           })
  //           .signers([buyer1.user])
  //           .rpc();

  //         let buyer1_nft_balance_after = await conn.getTokenAccountBalance(
  //           mints_buyer1[mint.toString()]
  //         );

  //         console.log(
  //           "Balance after claim : ",
  //           buyer1_nft_balance_after.value.amount
  //         );
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  //   /*
  //   console.log("--------------Buyer 2 buy box 1--------------");
  //   try {
  //     await program.methods
  //       .buyBoxSol(1)
  //       .accounts({
  //         boxAcount: box_acount,
  //         buyer: buyer2.user.publicKey,
  //         buyerAccount: buyer2.buyer_account,
  //       })
  //       .signers([buyer2.user])
  //       .rpc();
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   box_account_info = await program.account.boxStruct.fetch(box_acount);

  //   box_balance = await conn.getBalance(box_acount);

  //   assert.equal(box_balance_before + 200, box_balance);

  //   let buyer2_account_info = await program.account.userStruct.fetch(
  //     buyer2.buyer_account
  //   );

  //   assert.equal(
  //     buyer2_account_info.authority.toString(),
  //     buyer2.user.publicKey.toString()
  //   );

  //   console.log("-----------Buyer 2 claim---------------");
  //   console.log(buyer2_account_info.boughts);

  //   // console.log(box_account_info);
  //   console.log("-----------Box counter---------------");
  //   console.log(box_account_info.counter.toNumber());

  //   console.log("-----------Box purchased---------------");
  //   console.log(box_account_info.mintsPurchased);

  //   console.log("-----------Box mints---------------");
  //   console.log(box_account_info.mints);

  //   console.log("--------------Buyer 3 buy box 1--------------");
  //   try {
  //     await program.methods
  //       .buyBoxSol(1)
  //       .accounts({
  //         boxAcount: box_acount,
  //         buyer: buyer3.user.publicKey,
  //         buyerAccount: buyer3.buyer_account,
  //       })
  //       .signers([buyer3.user])
  //       .rpc();
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   box_account_info = await program.account.boxStruct.fetch(box_acount);

  //   box_balance = await conn.getBalance(box_acount);

  //   assert.equal(box_balance_before + 300, box_balance);

  //   let buyer3_account_info = await program.account.userStruct.fetch(
  //     buyer3.buyer_account
  //   );

  //   assert.equal(
  //     buyer3_account_info.authority.toString(),
  //     buyer3.user.publicKey.toString()
  //   );

  //   console.log("-----------Buyer 3 claim---------------");
  //   console.log(buyer3_account_info.boughts);

  //   // console.log(box_account_info);
  //   console.log("-----------Box counter---------------");
  //   console.log(box_account_info.counter.toNumber());

  //   console.log("-----------Box purchased---------------");
  //   console.log(box_account_info.mintsPurchased);

  //   console.log("-----------Box mints---------------");
  //   console.log(box_account_info.mints);
  //   */
  // });

  // it('test init', async () => {
  //   const unipet_box_account = getUnipetBoxAccount();
  //   const admin_account = getAdminAccount();
  //   const operator_account = getOperatorAccount();

  //   try {
  //     await program.methods
  //       .initialize()
  //       .accounts({
  //         unipetBox: unipet_box_account,
  //         adminAccount: admin_account,
  //         operatorAccount: operator_account,
  //       })
  //       .rpc();
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   let unipet_box_account_info = await program.account.unipetBox.fetch(
  //     unipet_box_account
  //   );
  //   console.log(unipet_box_account_info);
  // // });
  // it('should create box normal', async () => {
  //   const unipet_box_account = getUnipetBoxAccount();
  //   const operator_account = getOperatorAccount();

  // const starttime = Math.floor(new Date().getTime() / 1000);
  // const endtime = starttime + 30 * 86400;
  // const rates = [0, 50, 90, 100];
  // let currencies = [
  //   { mint: address0, amount: new anchor.BN(1000000) },
  //   {
  //     mint: new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW"),
  //     amount: new anchor.BN(1000000),
  //   },
  // ];
  // const box1_name = "BOX NORMAL";

  // const box_account = getBoxAccount(1);

  // try {
  //   await program.methods
  //     .createBox(
  //       box1_name,
  //       new anchor.BN(starttime),
  //       new anchor.BN(endtime),
  //       currencies,
  //       Buffer.from(rates),
  //       []
  //     )
  //     .accounts({
  //       unipetBox: unipet_box_account,
  //       operatorAccount: operator_account,
  //       boxAccount: box_account,
  //     })
  //     .rpc();
  // } catch (error) {
  //   console.log(error);
  // }

  // let unipet_box_account_info = await program.account.unipetBox.fetch(
  //   unipet_box_account
  // );
  // console.log(unipet_box_account_info);

  // })
  // it('should create box premium', async () => {
  //   const unipet_box_account = getUnipetBoxAccount();
  //   // const admin_account = getAdminAccount();
  //   const operator_account = getOperatorAccount();
  
  //   const starttime = Math.floor(new Date().getTime() / 1000);
  //   const endtime = starttime + 30 * 86400;
  //   const rates = [0, 50, 90, 100];
  //   let currencies = [
  //     { mint: address0, amount: new anchor.BN(1000000) },
  //     {
  //       mint: new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW"),
  //       amount: new anchor.BN(1000000),
  //     },
  //   ];
  //   const box1_name = "BOX PREMIUN";
  
  //   const box_account = getBoxAccount(2);
  
  //   try {
  //     await program.methods
  //       .createBox(
  //         box1_name,
  //         new anchor.BN(starttime),
  //         new anchor.BN(endtime),
  //         currencies,
  //         Buffer.from(rates),
  //         []
  //       )
  //       .accounts({
  //         unipetBox: unipet_box_account,
  //         operatorAccount: operator_account,
  //         boxAccount: box_account,
  //       })
  //       .rpc();
  //   } catch (error) {
  //     console.log(error);
  //   }
  
  //   let box_account_info = await program.account.boxStruct.fetch(box_account);
  //   console.log(box_account_info);

  // })

  it('should set operator', async () => {

  const unipet_box_account = getUnipetBoxAccount();
  const admin_account = getAdminAccount();
  const operator_account = getOperatorAccount();
    let operator_list = [
      new PublicKey("2z6bJQHscXWHNQAB8Q3YA1RiKg2QBn84Uax3FSANtvDU"),
      new PublicKey("aGwtDcFXg9FMJ43axF1x1wqeVjPSLHeVGhmgEGgWn16"),
      new PublicKey("aGwtDcFXg9FMJ43axF1x1wqeVjPSLHeVGhmgEGgWn16"),
    ];
  
    try {
      await program.methods
        .setAuthority({ operator: {} }, operator_list)
        .accounts({
          adminAccount: admin_account,
          operatorAccount: operator_account,
          unipetBox: unipet_box_account,
          // admin: wallet.publicKey,
        })
        // .signers([admin2])
        .rpc();
    } catch (error) {
      console.log(error);
    }
  
  })


  // it("test buy box sol! ", async () => {
  //   const unipet_box_account = getUnipetBoxAccount();
  //   const admin_account = getAdminAccount();
  //   const operator_account = getOperatorAccount();
  //   const box_holder = new anchor.web3.Keypair();



  //   let unipet_box_account_info = await program.account.unipetBox.fetch(unipet_box_account);



  //   const box_acount = getBoxAccount(2);
  //   const box_account_info = await program.account.authorityRole.fetch(operator_account);
  //   console.log(JSON.stringify(box_account_info));
    

    
  // })

  const getUnipetBoxAccount = () => {
    const UNIPET_BOX_ACCOUNT = "UNIPET_BOX_ACCOUNT";
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(UNIPET_BOX_ACCOUNT)],
      program.programId
    );
    console.log("unipet_box_account: ", mint.toString());
    return mint;
  };

  const getOperatorAccount = () => {
    const OPERATOR_ROLE = "OPERATOR_ROLE";
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(OPERATOR_ROLE)],
      program.programId
    );
    console.log("operator_account: ", mint.toString());
    return mint;
  };

  const getAdminAccount = () => {
    const ADMIN_ROLE = "ADMIN_ROLE";
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(ADMIN_ROLE)],
      program.programId
    );
    console.log("admin_account: ", mint.toString());

    return mint;
  };

  const getBoxAccount = (id) => {
    const BOX_ACCOUNT = "BOX_ACCOUNT";
    const [box_account] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(BOX_ACCOUNT),
        new anchor.BN(id).toArrayLike(Buffer, "le", 1),
      ],
      program.programId
    );
    console.log("box account: ", box_account.toString());

    return box_account;
  };

  const getBuyerAccount = (user) => {
    const USER_ACCOUNT = "USER_ACCOUNT";
    const [buyer_account] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(USER_ACCOUNT), user.publicKey.toBuffer()],
      program.programId
    );
    // console.log("buyer account: ", buyer_account);

    return buyer_account;
  };

  async function create_user() {
    const buyer1 = new anchor.web3.Keypair();
    console.log("Buyer : ", buyer1.publicKey.toString());

    await airdrop(conn, owner, buyer1.publicKey);

    const buyer1_account = getBuyerAccount(buyer1);
    console.log("Buyer 1 account: ", buyer1_account.toString());

    return {
      user: buyer1,
      buyer_account: buyer1_account,
    };
  }
});

async function airdrop(con, from, to) {
  let transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: LAMPORTS_PER_SOL,
    })
  );

  // Sign transaction, broadcast, and confirm
  await sendAndConfirmTransaction(con, transaction, [from.payer]);
}

async function getAta(mint, user) {
  return await getAssociatedTokenAddress(mint, user);
}

async function createAta(conn, payer, mint, to) {
  return await createAssociatedTokenAccount(conn, payer, mint, to);
}

async function getOrCreateAta(conn, payer, mint1, acc) {
  return await getOrCreateAssociatedTokenAccount(conn, payer, mint1, acc, true);
}
