import * as anchor from "@coral-xyz/anchor";

import {
  program,
  connection,
  owner,
  payer,
  wallet,
  getBoxAccount,
  getOperatorAccount,
  getBuyerAccount,
} from "./helper";

import {
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
  ComputeBudgetProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createMint,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

async function add_nfts() {
  const box_id = 7;
  const box_account = getBoxAccount(box_id);
  //MINT

  let mint_list = [];
  for (let i = 0; i < 10; i++) {
    const mintNew = await createMint(
      connection,
      payer,
      owner.publicKey,
      null,
      0
    );
    console.log(`MINT ${i} : ${mintNew.toString()}`);
    mint_list.push(mintNew);

    let mint_box = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintNew,
      box_account,
      true
    );

    await mintTo(connection, owner.payer, mintNew, mint_box.address, payer, 1);
  }

  const operator_account = getOperatorAccount();

  try {
    await program.methods
      .addMints(box_id, mint_list)
      .accounts({
        operatorAccount: operator_account,
        boxAccount: box_account,
      })
      .rpc();
  } catch (error) {
    console.log(error);
  }

  let box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info);
}

add_nfts();
