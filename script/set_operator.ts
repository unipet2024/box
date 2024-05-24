import { PublicKey } from "@solana/web3.js";
import {
  program,
  admin_account,
  operator_account,
  unipet_box_account,
} from "./helper";

export const set_operator = async () => {
  let operator_list = [
    new PublicKey("2z6bJQHscXWHNQAB8Q3YA1RiKg2QBn84Uax3FSANtvDU"),
    new PublicKey("aGwtDcFXg9FMJ43axF1x1wqeVjPSLHeVGhmgEGgWn16"),
  ];

  console.log("--------------SET OPERATOR-----------------");
  try {
    await program.methods
      .setAuthority({ operator: {} }, operator_list)
      .accounts({
        adminAccount: admin_account,
        operatorAccount: operator_account,
        unipetBox: unipet_box_account,
      })
      .rpc();
  } catch (error) {
    console.log(error);
  }

  let operator_account_info = await program.account.authorityRole.fetch(
    operator_account
  );
  console.log(operator_account_info);
};
