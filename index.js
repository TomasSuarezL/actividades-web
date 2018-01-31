var express = require('express'), app = express(), bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
// var todoRoutes = require('./routes/todos');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/static'));

app.get('/', function(req,res){
   res.sendFile("index.html"); 
});

app.get('/deportista/:deportistaId', function(req,res){
    res.sendFile("/views/deportista.html",{root: __dirname});
 });

// app.use('/api/todos', todoRoutes);

app.listen(PORT , function(){
    console.log("APP IS RUNNING ON PORT "+ PORT);
});
