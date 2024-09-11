import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { IDL } from "../target/types/box_2024";
import { Wallet } from "@coral-xyz/anchor";
// import { setTimeout } from "timers/promises";

import { PublicKey, Keypair, Connection, clusterApiUrl } from "@solana/web3.js";
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
export const wallet = Keypair.fromSecretKey(
  Uint8Array.from([
    60, 31, 216, 134, 68, 78, 5, 54, 175, 135, 221, 227, 168, 70, 131, 114, 133,
    65, 139, 93, 195, 126, 28, 32, 17, 15, 252, 196, 1, 237, 44, 57, 8, 134, 50,
    123, 56, 199, 184, 99, 61, 162, 196, 68, 143, 51, 117, 64, 26, 54, 84, 218,
    154, 157, 209, 231, 34, 3, 251, 190, 216, 153, 90, 113,
  ])
);

import bs58 from "bs58";

function base58ToKeypair(base58PrivateKey: string): Keypair {
  try {
    const privateKeyBuffer = bs58.decode(base58PrivateKey);
    return Keypair.fromSecretKey(privateKeyBuffer);
  } catch (error) {
    throw new Error("Invalid base58 private key.");
  }
}

// const base58PrivateKey =
//   "5LpkoJndJ9YR6oupvjPC9LqZ8nWnaBZ7ZyBLzMLeEnKXnfw5Ap55sqMYE3jbgh8gbn4uAU79qEGQRtPyiggWHRdd"; // Replace with actual base58 private key
// export const wallet = base58ToKeypair(base58PrivateKey);
// console.log(`Public Key: ${wallet.publicKey.toBase58()}`); //prints the base58-encoded public key
// console.log(`Private Key (Base58): ${wallet.secretKey.toString()}`); // prints the base58-encoded private key

export const provider = new AnchorProvider(
  connection,
  new Wallet(wallet),
  anchor.AnchorProvider.defaultOptions()
);
const idl = IDL;
// Address of the deployed program.
const programId = "CgiGkh9SCX36F7Xv3zkHYj7gxns4do21vaRA8Qv37rvR";
// Generate the program client from IDL.
export const program = new anchor.Program(idl, programId, provider);

anchor.setProvider(provider);

export const owner = provider.wallet as Wallet;
export const payer = owner.payer;

export const getUnipetBoxAccount = () => {
  const UNIPET_BOX_ACCOUNT = "UNIPET_BOX_ACCOUNT";
  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(UNIPET_BOX_ACCOUNT)],
    program.programId
  );
  console.log("unipet_box_account: ", mint.toString());
  return mint;
};

export const getOperatorAccount = () => {
  const OPERATOR_ROLE = "OPERATOR_ROLE";
  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(OPERATOR_ROLE)],
    program.programId
  );
  console.log("operator_account: ", mint.toString());
  return mint;
};

export const getAdminAccount = () => {
  const ADMIN_ROLE = "ADMIN_ROLE";
  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(ADMIN_ROLE)],
    program.programId
  );
  console.log("admin_account: ", mint.toString());

  return mint;
};

export const getBoxAccount = (id) => {
  const BOX_ACCOUNT = "BOX_ACCOUNT";
  const [box_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(BOX_ACCOUNT), new anchor.BN(id).toArrayLike(Buffer, "le", 1)],
    program.programId
  );
  console.log("BOX account ", id, " : ", box_account.toString());

  return box_account;
};

export const getBoxStorage = (id) => {
  const BOX_STORAGE = "BOX_STORAGE";
  const [box_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(BOX_STORAGE), new anchor.BN(id).toArrayLike(Buffer, "le", 1)],
    program.programId
  );
  console.log("BOX storage ", id, " : ", box_account.toString());

  return box_account;
};

export const getBuyerAccount = (buyer) => {
  const BOX_ACCOUNT = "USER_ACCOUNT";
  const [box_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(BOX_ACCOUNT), buyer.toBuffer()],
    program.programId
  );

  return box_account;
};

export const unipet_box_account = getUnipetBoxAccount();
export const admin_account = getAdminAccount();
export const operator_account = getOperatorAccount();
