import express from 'express'
import http from 'http'
import io from 'socket.io'
import easyrtc from 'easyrtc'

const app = express()

console.log(__dirname+'/../public')
app.set('view engine', 'ejs')
app.use('/public', express.static(__dirname+'/../public'))

app.get('/favicon.ico', function(req, res) {})

app.get('/', function(req, res) {
  res.render('index')
})

const webServer = app.listen(3000, function() {
  var host = webServer.address().address
  var port = webServer.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
