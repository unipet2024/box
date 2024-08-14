import { program, getOperatorAccount, getBoxAccount } from "./helper";
import { BN } from "@coral-xyz/anchor";

const box_id = 3;
async function change_rates() {
  const operator_account = getOperatorAccount();
  const box_account = getBoxAccount(box_id);

  try {
    await program.methods
      .changeTime(box_id, new BN(1720955474), new BN(1793547474))
      .accounts({
        operatorAccount: operator_account,
        boxAccount: box_account,
      })
      .rpc();
  } catch (error) {
    console.log(error);
  }

  let box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info.rates);
}

change_rates();
