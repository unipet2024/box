import { BorshCoder, EventParser } from "@coral-xyz/anchor";
import { program, connection } from "./helper";

const eventParser = new EventParser(
  program.programId,
  new BorshCoder(program.idl)
);

const run = async () => {
  // Get transaction from its signature
  const tx = await connection.getTransaction(
    // "3H3Vo1HXV5sSfdg3FvLzdYEWRqpdvZLYJgexXRgDzGFVapp4m5gkCNav7gh3ohw4AsZzXq99dixzapdRQS8Pw5Vp",
    // "54RFdiJghaVS67goyWrgxoVcHke2s3Snh2UiJJG3zzwAJHYo7AEor44D3djbvae9LTYbUtwPrMcJsBQn13o7CeGP",
    "5gf55BTNaU5hToSYGDTm9QHapMF2WRdRgFfKJoCAWDG2wWMbHQaVYxHd9ehHKA4fqX2w9EUWow2v2PSRSZokcxT8",
    {
      commitment: "confirmed",
    }
  );

  const events = eventParser.parseLogs(tx.meta.logMessages);
  for (let event of events) {
    console.log(event);
  }
};

run();
