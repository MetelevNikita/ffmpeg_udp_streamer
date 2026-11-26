import { spawn } from "node:child_process"
import { logFile } from "../../log/logInstace.js"


export async function tspMuxer (udp: string) {


    const command = [
        '-v',
        '-I', 'ip', '1234',
        '-P', 'pmt',
        '--service', '1',
        '--add-programinfo-id', '0x43554549',
        '--add-pid', '600/0x86',
        '-P', 'spliceinject',
        '--service', '1',
        '--udp', '4444',
        '-O', 'ip', udp,
        '--ttl', '16'
      ] as string[]


  return await new Promise((resolve, reject) => {

      const tsp = spawn('tsp', command, {
        stdio: ['ignore', 'ignore', 'pipe']
      })

      tsp.stderr.on('data', (data) => {
        logFile('info', data.toString())
      })

      //

      const stop = () => {
        tsp.kill('SIGTERM')
      }

      process.once('SIGINT', stop)
      process.once('SIGTERM', stop)

      tsp.once('error', reject)


      tsp.once('close', (code: number, signal: any) => {
        process.off('SIGINT', stop)
        process.off('SIGTERM', stop)

        if (code === 0) {
          resolve(`TSDuck завершился: code=${code}, signal=${signal}`)
        } else {
          reject(new Error(
            `TSDuck завершился: code=${code}, signal=${signal}`
          ))
        }
      })


  })


}