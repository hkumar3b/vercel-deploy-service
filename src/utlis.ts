import { exec } from "child_process";
import path from "path";

export const buildProject = (id: string) => {
  return new Promise((resolve) => {
    const child = exec(
      `cd ${path.join(__dirname, `Output/${id}`)}&& npm install && (npm run build || npx tsc)`,
    );

    child.stdout?.on("data", function (data) {
      console.log("stdout: " + data);
    });
    child.stderr?.on("data", function (data) {
      console.log("stderr: " + data);
    });
    child.on("close", function (code) {
      resolve("");
    });
  });
};
