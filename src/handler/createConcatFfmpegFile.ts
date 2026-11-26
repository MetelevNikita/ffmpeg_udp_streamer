import { writeFile, access, mkdir } from "node:fs/promises"
import { logFile } from "../log/logInstace.js"
import path from 'path'



export async function createConcatFfmpegFile (concatPath: string) {

    const pathResolve = path.join(concatPath) ?? null

    console.log('path resolve ', pathResolve)

    if (!pathResolve) {
      logFile('error', 'path not resolve')
      process.exit(1)
    }

    try {
      await access(pathResolve)
    } catch (error) {
      await mkdir(pathResolve) 
    }

    let dayFile = `${new Date().toLocaleDateString('RU-ru')}-concat.txt`


    try {
      await access(path.join(pathResolve, dayFile))
      logFile('log', 'file is exist')
    } catch (error) {
      await writeFile(path.join(pathResolve, dayFile), '', {encoding: 'utf-8'})
      logFile('log', 'file not exist, create')
    }


    return path.join(pathResolve, dayFile)

}