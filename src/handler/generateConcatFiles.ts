
import { appendFile } from "node:fs/promises";
import { logFile } from "../log/logInstace.js";
import path from "node:path";



export async function generateConcatFiles (pathToConcatFile: string, pathToFilesFolder: string, file: string) {

  try {

    await appendFile(
      pathToConcatFile,
      `file ${path.join(pathToFilesFolder, file)}\n`
    )
    
  } catch (error: unknown) {
    logFile('error', `error append files into .txt file ${(error instanceof Error) ? error.message : error}`)
  }


}