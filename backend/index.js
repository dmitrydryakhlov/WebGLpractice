var express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes');
const cors = require('cors');
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use(cors());
app.use(bodyParser.json());

app.use('/getProps', routes.getProps);
app.use('/triangulation', routes.triangulation);

app.listen(3000, function(){
    console.log(' listening on port 3000');
})