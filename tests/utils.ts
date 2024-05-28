
export const getUnipetBoxAccount = (program) => {
    const UNIPET_BOX_ACCOUNT = "UNIPET_BOX_ACCOUNT";
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(UNIPET_BOX_ACCOUNT)],
      program.programId
    );
    console.log("unipet_box_account: ", mint.toString());
    return mint;
  };

  export const getOperatorAccount = (program) => {
    const OPERATOR_ROLE = "OPERATOR_ROLE";
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(OPERATOR_ROLE)],
      program.programId
    );
    console.log("operator_account: ", mint.toString());
    return mint;
  };

  export const getAdminAccount = (program) => {
    const ADMIN_ROLE = "ADMIN_ROLE";
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(ADMIN_ROLE)],
      program.programId
    );
    console.log("admin_account: ", mint.toString());

    return mint;
  };

  export  const getBoxAccount = (program, id) => {
    const BOX_ACCOUNT = "BOX_ACCOUNT";
    const [box_account] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(BOX_ACCOUNT),
        new anchor.BN(id).toArrayLike(Buffer, "le", 1),
      ],
      program.programId
    );
    console.log("box account: ", box_account.toString());

    return box_account;
  };