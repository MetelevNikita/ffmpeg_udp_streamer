import { access, readdir } from "node:fs/promises";
import path from "path";
import { logFile } from "../log/logInstace.js";

export async function getDirFiles(input: string) {
  const inputPath = path.resolve(input) ?? null;

  if (!inputPath) {
    return logFile("error", "not a folder, check again");
  }

  try {
    await access(inputPath);
    logFile("info", "folder is exist, continue");
  } catch (error) {
    logFile(
      "error",
      `folder not exist ${error instanceof Error ? error.message : error}`,
    );
    process.exit(1);
  }

  //

  let dir;

  try {
    dir = await readdir(inputPath);
    logFile("info", "data in folder is correct");
    console.table(dir);
    return dir;
  } catch (error) {
    logFile("error", "error read dir");
    process.exit(1);
  }
}
