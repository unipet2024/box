import {
  program,
  connection,
  owner,
  wallet,
  getBoxAccount,
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
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

async function buy_box() {
  const box_id = 3;
  const box_account = getBoxAccount(box_id);

  let buyer_account = getBuyerAccount(owner.publicKey);

  const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

  const box_usdc_account = await getAssociatedTokenAddress(
    usdc,
    box_account,
    true
  );
  console.log("BOX account usdc: ", box_usdc_account.toString());

  const user_usdc_account = await getAssociatedTokenAddress(
    usdc,
    owner.publicKey
  );

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
      .buyBoxSpl(box_id)
      .accounts({
        boxAccount: box_account,
        buyer: owner.publicKey,
        buyerAccount: buyer_account,
        currencyMint: usdc,
        currencyBox: box_usdc_account,
        currencyBuyer: user_usdc_account,
      })
      .signers([owner.payer])
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

  // let box_account_info = await program.account.boxStruct.fetch(box_account);
  // console.log(box_account_info);
}

buy_box();
