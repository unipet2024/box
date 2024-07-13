import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { IDL } from "../target/types/box_2024";
import { Wallet } from "@coral-xyz/anchor";

import data from "../keys/dev/holder.json";

// import { setTimeout } from "timers/promises";

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
// Address of the deployed program.FVqBXTrZRY9532siwpbRd4WWvYnHSLbUhrz72eTVvWbJ
const programId = "FVqBXTrZRY9532siwpbRd4WWvYnHSLbUhrz72eTVvWbJ";
// Generate the program client from IDL.
const program = new anchor.Program(idl, programId, provider);

const address0 = new PublicKey("11111111111111111111111111111111");
const usdc = new PublicKey("BUJST4dk6fnM5G3FnhTVc3pjxRJE7w2C5YL9XgLbdsXW");

async function buy_box() {
  let owner = provider.wallet as Wallet;
  const payer = owner.payer;
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const box_id = 2;
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
