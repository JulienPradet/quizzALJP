import express from 'express'

const app = express()

console.log(__dirname+'/../dist/public')
app.set('view engine', 'ejs')
app.use('/public', express.static(__dirname+'/../public'))

app.get('/favicon.ico', function(req, res) {})

app.get('/', function(req, res) {
  res.render('index')
})

const server = app.listen(3000, function() {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
