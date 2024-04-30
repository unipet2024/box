import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { IDL } from "../target/types/box_2024";
import { Wallet } from "@coral-xyz/anchor";

import data from "../keys/dev/holder.json";

// import { setTimeout } from "timers/promises";

import { PublicKey, Keypair, Connection, clusterApiUrl } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const wallet = Keypair.fromSecretKey(
  Uint8Array.from([
    60, 31, 216, 134, 68, 78, 5, 54, 175, 135, 221, 227, 168, 70, 131, 114, 133,
    65, 139, 93, 195, 126, 28, 32, 17, 15, 252, 196, 1, 237, 44, 57, 8, 134, 50,
    123, 56, 199, 184, 99, 61, 162, 196, 68, 143, 51, 117, 64, 26, 54, 84, 218,
    154, 157, 209, 231, 34, 3, 251, 190, 216, 153, 90, 113,
  ])
);
console.log("Wallet:", wallet.publicKey.toString());

new Wallet(wallet);

const provider = new AnchorProvider(
  connection,
  new Wallet(wallet),
  anchor.AnchorProvider.defaultOptions()
);
// console.log("Provider: ", provider);

const idl = IDL;
// Address of the deployed program.88R4EnKBkAZ746qLeMDVmvYL4DfeyYmt4TawJchzT2vL
const programId = "88R4EnKBkAZ746qLeMDVmvYL4DfeyYmt4TawJchzT2vL";
// Generate the program client from IDL.
const program = new anchor.Program(idl, programId, provider);

const address0 = new PublicKey("11111111111111111111111111111111");
const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

async function buy_box() {
  let owner = provider.wallet as Wallet;
  const payer = owner.payer;
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  // const unipet_box_account = getUnipetBoxAccount();
  // const admin_account = getAdminAccount();
  // const operator_account = getOperatorAccount();

  const starttime = Math.floor(new Date().getTime() / 1000);
  const endtime = starttime + 30 * 86400;
  const rates = [0, 50, 90, 100];
  const box1_name = "BOX 1";
  const price = 1000000;

  const box_account = getBoxAccount(3);

  let buyer_account = getBuyerAccount(owner.publicKey);

  const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

  const box_usdc_account = await getOrCreateAssociatedTokenAccount(
    connection,
    owner.payer,
    usdc,
    box_account,
    true
  );
  console.log("BOX account usdc: ", box_usdc_account.address.toString());

  const user_usdc_account = await getAssociatedTokenAddress(
    usdc,
    owner.publicKey
  );

  try {
    await program.methods
      .buyBoxSpl(3)
      .accounts({
        boxAccount: box_account,
        buyer: owner.publicKey,
        buyerAccount: buyer_account,
        currencyMint: usdc,
        currencyBox: box_usdc_account.address,
        currencyBuyer: user_usdc_account,
      })
      .signers([owner.payer])
      .rpc();
  } catch (error) {
    console.log(error);
  }

  let box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info);
}

const getBoxAccount = (id) => {
  const BOX_ACCOUNT = "BOX_ACCOUNT";
  const [box_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(BOX_ACCOUNT), new anchor.BN(id).toArrayLike(Buffer, "le", 1)],
    program.programId
  );
  console.log("box account: ", box_account.toString());

  return box_account;
};

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

const getBuyerAccount = (user) => {
  const USER_ACCOUNT = "USER_ACCOUNT";
  const [buyer] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(USER_ACCOUNT), user.toBuffer()],
    program.programId
  );
  // console.log("admin_account: ", mint.toString());

  return buyer;
};

buy_box();
