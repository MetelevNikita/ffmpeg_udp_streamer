import { spawn } from "node:child_process"




export async function ffprobeAnalyze (videoPath: string): Promise<any> {


  const command = [
    '-v', 'error',
    '-show_format',
    '-show_streams',
    '-of', 'json',
    videoPath,
  ] as string[]

  let res = ''


  return new Promise((resolve, reject) => {

    const analyze = spawn('ffprobe', command, {stdio: ['pipe']})

    analyze.stdout.on('data', (data: Buffer) => {
      res+=data
    }).setEncoding('utf-8')

    analyze.stderr.on('data', (data: Buffer) => {
      console.log('error ', data)
    }).setEncoding('utf-8')

    // 


    analyze.on('close', (code: number, signal: any) => {
      try {
        if (code === 0) {

          resolve(JSON.parse(res))
        } else {
          reject(new Error(
            signal
              ? `Процесс завершён сигналом ${signal}`
              : `Процесс завершился с кодом ${code}`,
          ));
        }
        
      } catch (error) {
        reject(new Error(
          signal
            ? `Процесс завершён сигналом ${signal}`
            : `Процесс завершился с кодом ${code}`,
        ));
      }

    })

    analyze.on('error', (error) => {
      reject(`error analyze probe ${error.message}`)
    })


  })


} 