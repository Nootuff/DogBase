const express = require('express');
const ejs = require('ejs');
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "/views"))
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render("home.ejs");
    });

    app.get("/show", function(req, res){
        res.render("show.ejs");
        });
    



app.listen(3000, function () {
    console.log("Put http://localhost:3000 into the url bar to see your new app" ); //String template literal, accuratley shows the port you are serving on Heroku or local. 
});