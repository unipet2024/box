import {
  program,
  unipet_box_account,
  admin_account,
  operator_account,
} from "./helper";

export const init = async () => {
  // anchor.setProvider(provider);

  console.log("--------------INIT-----------------")
  try {
    await program.methods
      .initialize()
      .accounts({
        unipetBox: unipet_box_account,
        adminAccount: admin_account,
        operatorAccount: operator_account,
      })
      .rpc();
  } catch (error) {
    console.log(error);
  }

  let unipet_box_account_info = await program.account.unipetBox.fetch(
    unipet_box_account
  );
  console.log(unipet_box_account_info);
};
