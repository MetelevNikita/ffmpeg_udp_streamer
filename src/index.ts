import { logFile } from "./log/logInstace.js"
import { styleText } from "node:util"
import { questionInstance } from "./module/qestionInstance.js"

// handler

import { getDirFiles } from "./handler/getDirFiles.js"

// 

import { createConcatFfmpegFile } from "./handler/createConcatFfmpegFile.js"
import { generateConcatFiles } from "./handler/generateConcatFiles.js"

// ffmpeg

import { ffprobeAnalyze } from "./streaming/ffprobe/ffprobe.js"
import { ffmpegStream } from "./streaming/ffmpeg/ffmpeg.js"
import { tspMuxer } from "./streaming/tsp/tsp.js"

// 

import path from "node:path"



async function main () {

  try {

    logFile('log', 'start program')

    const inputPath = await questionInstance('input', 'video_path', `${styleText('blue', '>>')} ${styleText('italic', 'insert video path')}`)

    console.log(inputPath)
    const dirs = await getDirFiles(inputPath.video_path)

    //probe


    let dataProbe = []


    for(let file of dirs) {

      if (file !== '.DS_Store') {
        const analyze = await ffprobeAnalyze(path.join(inputPath.video_path, file))

        const stream = analyze.streams as any
        // console.log('stream', stream)


        const data = {
          name: file,
          codec: stream[0].codec_long_name,
          width: stream[0].width,
          height: stream[0].height
        }

        dataProbe.push(data)
      }
    }


    console.log(dataProbe)




    //


   if (!dirs) {
      logFile('error', `error get files from dir`)
      process.exit(1)
    }

    const check = await questionInstance('confirm', 'is_continue', `${styleText('blue', '>>')} ${styleText('italic', 'do you have start media data')}`)

    if (!check.is_continue) {
      logFile('log', 'program stop work')
      process.exit(1)
    }



    const inputConcathPath = await questionInstance('input', 'concat_folder', 'insert concat folder')

    let concatFile;

    try {
      concatFile = await createConcatFfmpegFile(inputConcathPath.concat_folder)
    } catch (error: unknown) {
      logFile('error', `Cant read concat folder ${(error instanceof Error) ? error.message : error}`)
    }

    if (!concatFile) {
      return
    }

    for (let file of dirs) {

      if (file !== '.DS_Store') {
        await generateConcatFiles(concatFile, inputPath.video_path, file)
      }
      
    }

    logFile('info', 'concat file generate')


    const confirmStream  = await questionInstance('confirm', 'confirm_stream', 'start stream from url')


    if (!confirmStream.confirm_stream) {
      logFile('log', 'program stoped')
      process.exit(1)
    }

    const udpUrl = await questionInstance('input', 'url', 'url for output (udp://127.0.0.1:1234)')
    console.log('udp url ', udpUrl)

    const streaming = Promise.all([
      tspMuxer(udpUrl.url),
      ffmpegStream(path.join(concatFile))
    ])

    //




    //


    streaming.catch((error) => {
      console.error('Ошибка трансляции:', error)
    })

    await streaming




    logFile('log', 'program closed')
    process.exit(1)



        
    
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error(new Error(`Error start program ${error.message}`))
        process.exit(1)
    }     
  }




}



main().catch((error: unknown) => {
   
  if (error instanceof Error) {
    console.error(new Error(`Error start program ${error.message}`))
    process.exit(1)
  }


  console.error(new Error(`Unknow error ${error}`))
  process.exit(1)
})
