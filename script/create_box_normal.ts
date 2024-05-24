import {
  program,
  operator_account,
  unipet_box_account,
  getBoxAccount,
} from "./helper";

import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const address0 = new PublicKey("11111111111111111111111111111111");
const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

export const create_box_normal = async () => {
  const starttime = Math.floor(new Date().getTime() / 1000);
  const endtime = starttime + 30 * 86400;
  const rates = [0, 100];
  let currencies = [
    { mint: address0, amount: new anchor.BN(1000000) },
    { mint: usdc, amount: new anchor.BN(1000000) },
  ];
  const box1_name = "BOX NORMAL";

  const box_account = getBoxAccount(1);

  console.log("--------------CREATE BOX NORMAL-----------------");
  try {
    await program.methods
      .createBox(
        box1_name,
        new anchor.BN(starttime),
        new anchor.BN(endtime),
        currencies,
        Buffer.from(rates),
        []
      )
      .accounts({
        unipetBox: unipet_box_account,
        operatorAccount: operator_account,
        boxAccount: box_account,
      })
      .rpc();
  } catch (error) {
    console.log(error);
  }

  let unipet_box_account_info = await program.account.unipetBox.fetch(
    unipet_box_account
  );
  console.log(unipet_box_account_info);
};
