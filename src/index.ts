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
      try {
        await downloadS3(`Output/${response.element}`);
        const success = await buildProject(response.element);
        if (success) {
          await copyFinalDist(response.element);
          await publisher.hSet("status", response.element, "deployed");
        } else {
          console.error(`Build failed for project: ${response.element}`);
          await publisher.hSet("status", response.element, "failed");
        }
      } catch (error) {
        console.error(`Error deploying project: ${response.element}`, error);
        await publisher.hSet("status", response.element, "failed");
      }
    }
  }
};
main();
