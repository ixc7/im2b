import app from 'canvas'
const { Image, createCanvas } = app

const getChar = input => {
  let nonZero = false
  let total = 4

  for (let i = 0; i < input.length; i+= 1) {
    if (input[i] != 0) {
      nonZero = true
      break
    }
  }

  if (nonZero) total = (
    (input[0] << 0) + 
    (input[1] << 1) + 
    (input[2] << 2) + 
    (input[4] << 3) + 
    (input[5] << 4) + 
    (input[6] << 5) + 
    (input[3] << 6) + 
    (input[7] << 7)
  )
  
  return String.fromCharCode(0x2800 + total)
}

const main = (imageURL = '', asciiWidth = process.stdout.columns || 30, options = {}) => {
  let ascii = ''
  if (!options.colors) options.colors = {
    red: 1,
    green: 1,
    blue: 1
  }

  return new Promise((resolve, reject) => {
    const canvas = createCanvas()
    const img = new Image()

    img.onload = () => {
      let width = img.width
      let height = img.height

      if (img.width != asciiWidth * 2) {
        width = asciiWidth * 2
        height = (width * img.height) / img.width
      }

      canvas.width = width - (width % 2)
      canvas.height = height - (height % 4)

      let ctx = canvas.getContext('2d')

      ctx.fillStyle = '#FFFFFF'
      ctx.mozImageSmoothingEnabled = false
      ctx.webkitImageSmoothingEnabled = false
      ctx.msImageSmoothingEnabled = false
      ctx.imageSmoothingEnabled = false

      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      for (let imgy = 0; imgy < canvas.height; imgy += 4) {
        for (let imgx = 0; imgx < canvas.width; imgx += 2) {
          const current = [0, 0, 0, 0, 0, 0, 0, 0]
          let cindex = 0
          
          for (let x = 0; x < 2; x += 1) {
            for (let y = 0; y < 4; y += 1) {
              const cell = ctx.getImageData(imgx + x, imgy + y, 1, 1).data
              const avg = (
                cell[0] / options.colors.red + 
                cell[1] / options.colors.green + 
                cell[2] / options.colors.blue
              ) / 3
              // inverted.
              // if (avg < 128) current[cindex] = 1
              
              if (avg > 128) current[cindex] = 1
              cindex += 1
            }
          }

          ascii += getChar(current)
        }

        ascii += options.lineSeparator || '\n'
      }

      resolve(ascii)
    }

    img.onerror = error => reject(error)
    
    img.src = imageURL
  })
}

export default main
