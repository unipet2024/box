import {
  program,
  operator_account,
  unipet_box_account,
  getBoxAccount,
  getBoxStorage,
} from "./helper";

import * as anchor from "@coral-xyz/anchor";

import { PublicKey } from "@solana/web3.js";

const address0 = new PublicKey("11111111111111111111111111111111");
const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

export const create_box_premium = async () => {
  const starttime = Math.floor(new Date().getTime() / 1000);
  const endtime = starttime + 30 * 86400;
  const rates = [0, 60, 90, 100];
  let currencies = [
    // { mint: address0, amount: new anchor.BN(1000000) },
    { mint: usdc, amount: new anchor.BN(1000000) },
  ];
  // const box1_name = "BOX PREMIUM";
  const box_id = 7;
  const box_account = getBoxAccount(box_id);
  const box_storage = getBoxStorage(box_id);

  console.log("--------------CREATE BOX PREMIUM-----------------");
  // try {
  //   await program.methods
  //     .createBox(
  //       // box1_name,
  //       new anchor.BN(starttime),
  //       new anchor.BN(endtime),
  //       currencies,
  //       Buffer.from(rates)
  //     )
  //     .accounts({
  //       unipetBox: unipet_box_account,
  //       operatorAccount: operator_account,
  //       boxAccount: box_account,
  //       boxStorage: box_storage,
  //     })
  //     .rpc();
  // } catch (error) {
  //   console.log(error);
  // }

  let unipet_box_account_info = await program.account.unipetBox.fetch(
    unipet_box_account
  );
  console.log(unipet_box_account_info);

  let box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info);

  let box_storage_info = await program.account.boxStorage.fetch(box_storage);
  console.log(box_storage_info);
};

create_box_premium();
