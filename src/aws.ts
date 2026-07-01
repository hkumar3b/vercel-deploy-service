import { S3 } from "aws-sdk";
import path from "node:path";
import fs from "fs";
import "dotenv/config";

export const downloadS3 = async (prefix: string) => {
  console.log(prefix);
  const allFiles = await s3
    .listObjectsV2({
      Bucket: "vercel",
      Prefix: prefix,
    })
    .promise();

  const allPromises =
    allFiles.Contents?.map(async ({ Key }) => {
      return new Promise(async (resolve) => {
        if (!Key) {
          resolve("");
          return;
        }
        const finalOutputPath = path.join(__dirname, Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }
        s3.getObject({
          Bucket: "vercel",
          Key,
        })
          .createReadStream()
          .pipe(outputFile)
          .on("finish", () => {
            resolve("");
          });
      });
    }) || [];
  console.log("awaiting");

  await Promise.all(allPromises?.filter((x) => x !== undefined));

  console.log(allFiles);
};

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID!,
  secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  endpoint: process.env.ENDPOINT!,
});
