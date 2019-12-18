var path = require('path');
var express = require('express');
var app = express();

//serve the directories
app.use('/public', express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname,'/public/index.html'));
});
app.get('/practice', (req,res) => {
  res.sendFile(path.join(__dirname,'/public/pages/app.html'));
});
app.get('/spirals', (req,res) => {
  res.sendFile(path.join(__dirname,'/public/pages/spiral.html'));
});
app.get('/particles', (req,res) => {
  res.sendFile(path.join(__dirname,'/public/pages/particles.html'));
});
app.get('/visualizer', (req,res) => {
  res.sendFile(path.join(__dirname,'/public/pages/visualizer.html'));
});


app.listen(3000, () => console.log(`App is listening on port 3000!`));