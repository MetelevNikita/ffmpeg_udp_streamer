
import dgram from 'node:dgram'
import { logFile } from '../log/logInstace.js';





const socket = dgram.createSocket('udp4')


socket.on('error', (error) => {
    console.error(error.message);
    socket.close();
})


export function socetSenderSCTE (section: Buffer) {

  return new Promise((resolve, reject) => {

      socket.send(section, 4444, '127.0.0.1', (error) => {
          if (error) {
            logFile('error', `SCTE35 cue not sending ${error.message}`)
            reject(error);
            return;
          }

          logFile('log', 'SCTE35 sedn cue DONE')
          resolve('Agreed SCTE35');
      })

  })

}


export function closeScteSocket() {
  socket.close();
}

