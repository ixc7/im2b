import microtime from 'microtime'
import im2b from './index.js'

console.log('\x1Bc\x1b[3J\nloading...')
const start = microtime.now()
console.log(await im2b('dont-shoot.jpg'))
console.log(`completed in ${(microtime.now() - start) / 1000} ms`)
