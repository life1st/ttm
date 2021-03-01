import * as Filepond from 'filepond'
import 'reset-css/reset.css'
import 'filepond/dist/filepond.min.css'
import './index.scss'
import parseTorrent from 'parse-torrent'
import abtb from 'arraybuffer-to-buffer'

const root = document.querySelector('.root')
const input = document.querySelector('.filepond-root')

const filepond = Filepond.create(input)
filepond.on('addfile', (e, file) => {
  if (e) {
    console.log('error')
    return
  }
  console.log(file)
  const reader = new FileReader()
  reader.readAsArrayBuffer(file.file)
  reader.addEventListener('loadend', e => {
    const obj = parseTorrent(abtb(reader.result))
    delete obj.announce
    const uri = parseTorrent.toMagnetURI(obj)
    console.log(uri)
    const copy = document.createElement('input')
    copy.value = uri
    copy.select()
    document.execCommand("copy")
  })
  
  
  
})

// input.setAttribute('type', 'file')
// input.addEventListener('change', (e) => {
//   const file = e.target.files[0]
//   console.log(file)
  
//   console.log(reader)
  
//   reader.addEventListener('loadend', (e) => {
    
//     // console.log(magnet.encode(parseTorrent(abtb(reader.result))))
//     console.log(parseTorrent.toMagnetURI(parseTorrent(abtb(reader.result))))
//     // console.log(parseTorrent.toMagnetURI({infoHash: parseTorrent(abtb(reader.result)).infoHash}))
//     // console.log(parseTorrent(abtb(reader.result)))
//   })
// })