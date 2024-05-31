import { BorshCoder, EventParser } from "@coral-xyz/anchor";
import { program, connection } from "./helper";
import { PublicKey } from "@solana/web3.js";

const eventParser = new EventParser(
  program.programId,
  new BorshCoder(program.idl)
);

const run = async () => {
  const signatures = await connection.getSignaturesForAddress(
    new PublicKey("FYh8FdzipaoA5hWFH4P2UEiGYmgFbB1A35ELWjBLvo1f"),
    {}
  );

  for (const signature of signatures) {
    const tx = await connection.getTransaction(signature.signature, {
      commitment: "confirmed",
    });

    const events = eventParser.parseLogs(tx.meta.logMessages);
    for (let event of events) {
      console.log(event);
    }
  }
};

run();
