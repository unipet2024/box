import { program, getOperatorAccount, getBoxAccount } from "./helper";

const box_id = 3;
async function change_rates() {
  const operator_account = getOperatorAccount();
  const box_account = getBoxAccount(box_id);

  try {
    await program.methods
      .changeRates(box_id, Buffer.from([0, 10, 50, 90, 100]))
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
