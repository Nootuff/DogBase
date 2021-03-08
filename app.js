const express = require('express');
const ejs = require('ejs');
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "/views"))
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render("index.ejs");
    });

    app.get("/show", function(req, res){
        res.render("show.ejs");
        });
    



app.listen(3000, function () {
    console.log("Live on http://localhost:3000" ); //String template literal, accuratley shows the port you are serving on Heroku or local. 
});