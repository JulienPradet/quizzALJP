import express from 'express'
import http from 'http'

const app = express()

app.set('view engine', 'ejs')
app.use('/public', express.static(__dirname+'/public'))

app.get('/favicon.ico', function(req, res) {})

app.get('/', function(req, res) {
  res.render('test')
})

const webServer = app.listen(3000, function() {
  var host = webServer.address().address
  var port = webServer.address().port

  console.log('Test client at http://%s:%s', host, port)
})
