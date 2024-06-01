import { BorshCoder, EventParser } from "@coral-xyz/anchor";
import { program, connection } from "./helper";
import { PublicKey } from "@solana/web3.js";
import { use } from "chai";

const eventParser = new EventParser(
  program.programId,
  new BorshCoder(program.idl)
);

const run = async () => {
  // const signatures = await connection.getSignaturesForAddress(
  //   new PublicKey("FYh8FdzipaoA5hWFH4P2UEiGYmgFbB1A35ELWjBLvo1f"),
  //   {}
  // );

  // for (const signature of signatures) {
  //   const tx = await connection.getTransaction(signature.signature, {
  //     commitment: "confirmed",
  //   });

  //   const events = eventParser.parseLogs(tx.meta.logMessages);
  //   for (let event of events) {
  //     if (event.name == "BuyBoxEvent") {
  //       console.log(signature.signature);
  //       console.log(event);
  //     }
  //   }
  // }

  const user = new PublicKey("8myYvaTtnAdyZQ7AmBEU6TFuQa7p8ULXZgi72v8gmJKE");
  const buyer_user = getBuyerAccount(user);

  const buyer_user_info = await program.account.userStruct.fetch(buyer_user);

  buyer_user_info

  console.log(buyer_user_info);
};

const getBuyerAccount = (user) => {
  const USER_ACCOUNT = "USER_ACCOUNT";
  const [buyer] = PublicKey.findProgramAddressSync(
    [Buffer.from(USER_ACCOUNT), user.toBuffer()],
    program.programId
  );
  console.log("buyer account: ", buyer.toString());

  return buyer;
};

run();

// '8myYvaTtnAdyZQ7AmBEU6TFuQa7p8ULXZgi72v8gmJKE'
