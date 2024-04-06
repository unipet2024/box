import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { IDL } from "../target/types/box_2024";
import { Wallet } from "@coral-xyz/anchor";

import data from "../keys/dev/holder.json";

// import { setTimeout } from "timers/promises";

import { PublicKey, Keypair, Connection, clusterApiUrl } from "@solana/web3.js";
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
// Address of the deployed program.
const programId = "3HqqDK1dSviUyVUSXrT4W76PEjAJGJpytRHgezvYiUsR";
// Generate the program client from IDL.
const program = new anchor.Program(idl, programId, provider);

const address0 = new PublicKey("11111111111111111111111111111111");
// const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

async function create_box() {
  let owner = provider.wallet as Wallet;
  const payer = owner.payer;
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const box_holder = new PublicKey(
    "ESAaePH3mJjw9zZxnLGfnR1jVdnA7ieq2YaYeu8NcKum"
  );

  const unipet_box_account = getUnipetBoxAccount();
  // const admin_account = getAdminAccount();
  const operator_account = getOperatorAccount();

  const starttime = Math.floor(new Date().getTime() / 1000);
  const endtime = starttime + 30 * 86400;
  const rates = [0, 50, 90, 100];
  const box1_name = "BOX 1";
  const price = 1000000;

  const box_acount = getBoxAccount(2);

  try {
    await program.methods
      .createBox(
        box1_name,
        new anchor.BN(starttime),
        new anchor.BN(endtime),
        address0,
        new anchor.BN(price),
        Buffer.from(rates),
        [],
        box_holder
      )
      .accounts({
        unipetBox: unipet_box_account,
        operatorAccount: operator_account,
        boxAcount: box_acount,
      })
      .rpc();
  } catch (error) {
    console.log(error);
  }

  let unipet_box_account_info = await program.account.unipetBox.fetch(
    unipet_box_account
  );
  console.log(unipet_box_account_info);
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

create_box();
