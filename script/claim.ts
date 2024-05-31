import { getAssociatedTokenAddress } from "@solana/spl-token";
import { getBoxAccount, program, provider } from "./helper";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
// const address0 = new PublicKey("11111111111111111111111111111111");
// const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

async function claim() {
  const claimer = new PublicKey("GeYNaiuvHU3aq4WUhGcR5W1kYsdUcudUgNqJVt5aM5tv");
  const MINT = new PublicKey("H3G1zaoUyS6bi1JGLYmaCR29utH2xKUoEXdhzdDACauS");

  const buyer_account = getBuyerAccount(claimer.toBuffer());
  // const buyer_account_info
  const box_account = getBoxAccount(1);

  const nft_box = await getAssociatedTokenAddress(MINT, box_account, true);
  console.log("NFT BOX:", nft_box.toString());

  const nft_buyer = await getAssociatedTokenAddress(MINT, claimer);
  console.log("NFT Buyer:", nft_buyer.toString());

  let buyer_account_info = await program.account.userStruct.fetch(
    buyer_account
  );

  console.log(buyer_account_info);

  // try {
  //   await program.methods
  //     .claim(1, new anchor.BN(25))
  //     .accounts({
  //       boxAccount: box_account,
  //       nftBox: nft_box,
  //       buyerAccount: buyer_account,
  //       nftBuyer: nft_buyer,
  //       mint: MINT,
  //       buyer: claimer
  //     })
  //     .rpc();
  // } catch (error) {
  //   console.log(error);
  // }
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
