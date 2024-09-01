import { getAssociatedTokenAddress } from "@solana/spl-token";
import { getBoxAccount, program, wallet, connection } from "./helper";
import {
  PublicKey,
  ComputeBudgetProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SystemProgram } from "@coral-xyz/anchor";
// const address0 = new PublicKey("11111111111111111111111111111111");
// const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

async function claim() {
  const claimer = wallet.publicKey;
  const MINT = new PublicKey("5EjjDLW4oVSneMzGPhFSFZwhPmCtX4DWPXEJyy3LJPAW");

  const buyer_account = getBuyerAccount(claimer.toBuffer());
  // const buyer_account_info
  let box_id = 1;
  const box_account = getBoxAccount(box_id);

  const nft_box = await getAssociatedTokenAddress(MINT, box_account, true);
  console.log("NFT BOX:", nft_box.toString());

  const nft_buyer = await getAssociatedTokenAddress(MINT, claimer);
  console.log("NFT Buyer:", nft_buyer.toString());

  let buyer_account_info = await program.account.userStruct.fetch(
    buyer_account
  );

  buyer_account_info.boughts.map((data) => {
    return {
      ...data,
      id: data.id.toNumber(),
      mint: data.mint.toString(),
    };
  });

  let len = buyer_account_info.boughts.length;
  console.log(buyer_account_info.boughts[len - 1]);

  try {
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 1000000,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1,
    });

    const instruction = await program.methods
      .claim(box_id)
      .accounts({
        boxAccount: box_account,
        nftBox: nft_box,
        // buyerAccount: buyer_account,
        nftBuyer: nft_buyer,
        mint: MINT,
        buyer: claimer,
      })
      .signers([wallet])
      .instruction();

    const transaction = new Transaction()
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
}

const getBuyerAccount = (buyer) => {
  const USER_ACCOUNT = "USER_ACCOUNT";
  const [buyer_account] = PublicKey.findProgramAddressSync(
    [Buffer.from(USER_ACCOUNT), buyer],
    program.programId
  );
  console.log("buyer_account: ", buyer_account.toString());

  return buyer_account;
};

claim();
