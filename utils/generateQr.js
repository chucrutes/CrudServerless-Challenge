const QRCode = require('qrcode');

// QRCode.toDataURL('I am a pony!')
//   .then(url => {
//     console.log(url)
//   })
//   .catch(err => {
//     console.error(err)
//  })

// With async/await
const generateQR = async data => {
  try {
    return await QRCode.toDataURL(data)
  } catch (err) {
    return err
  }
}

module.exports = generateQR