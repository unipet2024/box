import {
  getBoxAccount,
  getBoxStorage,
  operator_account,
  program,
} from "./helper";

async function change_rates() {
  const box_id = 6;
  const box_account = getBoxAccount(box_id);
  const box_storage = getBoxStorage(box_id);

  try {
    await program.methods
      .changeRates(box_id, Buffer.from([0, 1, 2, 100]))
      .accounts({
        operatorAccount: operator_account,
        boxAccount: box_account,
        boxStorage: box_storage,
      })
      .rpc();
  } catch (error) {
    console.log(error);
  }

  let box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info);
}

change_rates();
