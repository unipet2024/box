// import { program } from "./helper";
import { init } from "./init";
import { set_operator } from "./set_operator";
import { create_box_normal } from "./create_box_normal";
import { create_box_premium } from "./create_box_premium";

const deploy = async () => {
  try {
    await init();
    await set_operator();
    // await create_box_normal();
    // await create_box_premium();
  } catch (error) {
    console.log(error);
  }
};

deploy();
