const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
var sql = require('./db');
const CRUD_operations = require("./CRUD_functions");
const path = require('path');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req, res)=>{
    res.redirect("views/openingScreen.html");
    //res.json({message:"Welcome to web course example application."});
});

app.listen(port, () => {
    console.log("Server is running on port " + port );
});

app.post("/newUser", CRUD_operations.createNewUser); //(path, handler)      we write path insdie " "

app.post("/sendMessage", CRUD_operations.sendNewMessage);

app.get("/logIn", CRUD_operations.userLogIn);

app.post("/uploadeNew", CRUD_operations.uploadeNewItem);

