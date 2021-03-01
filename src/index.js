import * as Filepond from 'filepond'
import 'reset-css/reset.css'
import 'filepond/dist/filepond.min.css'
import './index.scss'
import parseTorrent from 'parse-torrent'
import abtb from 'arraybuffer-to-buffer'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const root = document.querySelector('.root')
const input = document.querySelector('.filepond-root')

const filepond = Filepond.create(input)
filepond.setOptions({
  // allowMultiple: true
})
filepond.on('addfile', (e, file) => {
  if (e) {
    console.log('error')
    return
  }
  const reader = new FileReader()
  reader.readAsArrayBuffer(file.file)
  reader.addEventListener('loadend', e => {
    const obj = parseTorrent(abtb(reader.result))
    delete obj.announce
    const uri = parseTorrent.toMagnetURI(obj)
    appendList(uri)
  })
})

const list = document.createElement('ul')
const toWky = document.createElement('li')
const wkyUrl = 'https://h5-ocapp.onethingpcs.com/vPages/webapp/#/addTask'
toWky.innerHTML = `<a href="${wkyUrl}" target="_blank">open wky</a>`
list.append(toWky)
const listData = []

function appendList(uri) {
  listData.push(uri)
  const val = document.createElement('textarea')
  val.value = uri
  const copy = document.createElement('button')
  copy.innerText = 'copy'
  copy.addEventListener('click', () => {
    copyToClipboard(val)
    window.open(wkyUrl, '_blank')
  })
  const item = document.createElement('li')
  item.append(val)
  item.append(copy)
  list.append(item)
  if (listData.length === 1) {
    root.append(list)
  }
}

function copyToClipboard(element) {
  var temp = document.createElement("input")
  document.body.appendChild(temp)
  temp.value = element.value
  temp.select()
  document.execCommand("copy")
  temp.parentNode.removeChild(temp)
  Toastify({
    text: 'copied!',
    position: 'center'
  }).showToast()
}