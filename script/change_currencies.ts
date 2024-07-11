import * as anchor from "@coral-xyz/anchor";

import {
  program,
  operator_account,
  unipet_box_account,
  getBoxAccount,
} from "./helper";

import { PublicKey } from "@solana/web3.js";

// import { setTimeout } from "timers/promises";

let currencies = [
  {
    mint: new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW"), // USDC
    amount: new anchor.BN(1000000),
  },
];

async function change_currencies() {
  const box_account = getBoxAccount(5);

  let box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info);

  try {
    const tx = await program.methods
      .changeCurrencies(5, currencies)
      .accounts({
        operatorAccount: operator_account,
        boxAccount: box_account,
      })
      .rpc();

    console.log("https://explorer.solana.com/tx/" + tx + "?cluster=devnet");
  } catch (error) {
    console.log(error);
  }

  box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info);
}

change_currencies();
