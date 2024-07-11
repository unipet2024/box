import { program, operator_account, getBoxAccount } from "./helper";

export const close_box = async () => {
  const box_account = getBoxAccount(4);

  let box_account_info = await program.account.boxStruct.fetch(box_account);
  console.log(box_account_info);

  console.log("--------------CREATE BOX NORMAL-----------------");
  try {
    await program.methods
      .closeBox(4)
      .accounts({
        operatorAccount: operator_account,
        boxAccount: box_account,
      })
      .rpc();
  } catch (error) {
    console.log(error);
  }

  // box_account_info = await program.account.boxStruct.fetch(box_account);
  // console.log(box_account_info);
};

close_box();
