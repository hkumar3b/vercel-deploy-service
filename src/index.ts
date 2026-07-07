import { createClient } from "redis";
import { downloadS3, copyFinalDist } from "./aws.js";
import { buildProject } from "./utlis.js";

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

const main = async () => {
  while (true) {
    const response = await subscriber.brPop("build-queue", 10);
    if (response) {
      console.log(response);
      await downloadS3(`Output/${response.element}`);
      await buildProject(response.element);
      await copyFinalDist(response.element);

      publisher.hSet("staus", response.element, "deployed");
    }
  }
};
main();
