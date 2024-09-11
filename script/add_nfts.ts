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
  getBoxStorage,
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
  const box_id = 6;
  const box_account = getBoxAccount(box_id);
  const box_storage = getBoxStorage(box_id);
  //MINT

  let mint_list = [];
  for (let i = 0; i < 1; i++) {
    // const mintNew = await createMint(
    //   connection,
    //   payer,
    //   owner.publicKey,
    //   null,
    //   0
    // );
    // console.log(`MINT ${i} : ${mintNew.toString()}`);
    const mintNew = new anchor.web3.Keypair();
    mint_list.push(mintNew.publicKey);

    // let mint_box = await getOrCreateAssociatedTokenAccount(
    //   connection,
    //   payer,
    //   mintNew,
    //   box_account,
    //   true
    // );

    // await mintTo(connection, owner.payer, mintNew, mint_box.address, payer, 1);
  }

  const operator_account = getOperatorAccount();

  try {
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 1000000,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1,
    });
    const addHeap = ComputeBudgetProgram.requestHeapFrame({
      bytes: 1000,
    });

    const instruction = await program.methods
      .addMints(box_id, mint_list)
      .accounts({
        operatorAccount: operator_account,
        boxAccount: box_account,
        boxStorage: box_storage,
      })
      .instruction();
    const transaction = new Transaction()
      // .add(addHeap)
      .add(modifyComputeUnits)
      .add(addPriorityFee)
      .add(instruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      wallet,
    ]);
    console.log(signature);
    const result = await connection.getParsedTransaction(signature);
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  let box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info.ids);

  let box_storage_info = await program.account.boxStorage.fetch(box_storage);
  console.log(box_storage_info.mints.length);
}

add_nfts();
