import { styleText } from "node:util"


export function logFile (type: 'log' | 'error' |'info' | 'list', message: string) {


  switch (type) {
    case 'log':
      console.log(`[${styleText('green', new Date().toLocaleDateString('RU-ru'))} - ${styleText('italic', new Date().toLocaleTimeString('RU-ru'))}] \t ${styleText('green', message)}`)
      return `[${styleText('green', new Date().toLocaleDateString('RU-ru'))} - ${styleText('italic', new Date().toLocaleTimeString('RU-ru'))}] \t ${styleText('green', message)}`
 
    case 'error':
      console.error(`[${styleText('red', new Date().toLocaleDateString('RU-ru'))} - ${styleText('italic', new Date().toLocaleTimeString('RU-ru'))}] \t ${styleText('red', message)}`)
      return `[${styleText('red', new Date().toLocaleDateString('RU-ru'))} - ${styleText('italic', new Date().toLocaleTimeString('RU-ru'))}] \t ${styleText('red', message)}`
 
    case 'info':

      console.info(`[${styleText('yellow', new Date().toLocaleDateString('RU-ru'))} - ${styleText('italic', new Date().toLocaleTimeString('RU-ru'))}] \t ${styleText('yellow', message)}`)
      return `[${styleText('yellow', new Date().toLocaleDateString('RU-ru'))} - ${styleText('italic', new Date().toLocaleTimeString('RU-ru'))}] \t ${styleText('yellow', message)}`

    case 'list':
      console.table(`${styleText('bold', message)}`)
      return `${styleText('bold', message)}`
  }     
}
