import { spawn } from "node:child_process"
import { logFile } from "../../log/logInstace.js"
import { styleText } from "node:util"


export async function ffmpegStream (pathToFile: string) {


  const url = `udp://127.0.0.1:1234`
  const urlParse = new URL(url)

  urlParse.searchParams.set('pkt_size', '1316')
  urlParse.searchParams.set('ttl', '1')

  console.log(`url parse `, urlParse)

  const command = [
    '-re',
    '-f', 'concat',
    '-safe', '0',
    '-i', pathToFile,
    '-s', '1920x1080',
    '-r', '25',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-pix_fmt', 'yuv420p',
    '-maxrate', '6000000',
    '-bufsize', '12000000',
    '-wpredp', '0',
    '-g', '60',
    '-muxrate', '12000000',
    '-mpegts_service_id', '1',
    '-f', 'mpegts',
    urlParse.toString()
  ]

  return new Promise((resolve, reject) => {

    const stream = spawn('ffmpeg', command)

    stream.stderr.on('data', (data) => {
        const text = data.toString();

        if (text.includes('frame=')) {
          process.stdout.write(styleText('green', `\r\x1b[2K${text.trim()}`));
        }
    })

    stream.on('close', (code, signal) => {
            if (code === 0) {
            resolve(`FFmpeg завершился: code=${code}, signal=${signal}`);
          } else {
            reject(new Error(
              `FFmpeg завершился: code=${code}, signal=${signal}`
            ));
          }
    })

    stream.on('error', (error) => {
      logFile('error', `ERROR streaming ${error.message}`)
      reject(`ERROR streaming ${error.message}`)
    })


    // 


    const stop = () => {
      stream.kill('SIGTERM');
    };

    process.once('SIGINT', stop);  // Ctrl+C
    process.once('SIGTERM', stop);

    stream.once('close', () => {
      process.off('SIGINT', stop);
      process.off('SIGTERM', stop);
    });


    // 


  })


}


