const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const sql = require('./db/db');
const CRUD_operations = require("./db/CRUD_functions");
const path = require('path');
const fs = require('fs');
const stringify = require('csv-stringify').stringify;
const { parse } = require("csv-parse");
const CSVToJSON = require('csvtojson');
const CreateDB = require('./db/createDB');
const { get } = require("http");


//setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');
//app.use(express.static('static'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req, res)=>{
    res.redirect('/openingScreen');
});

app.listen(port, () => {
    console.log("Server is running on port " + port );
});


app.get('/CreateTableUsers',CreateDB.CreateUsersTable);
app.get('/CreateTableItems',CreateDB.CreateItemsTable);
app.get('/CreateTableQuotes',CreateDB.CreateQuotesTable);
app.get('/CreateTableUsersMessages',CreateDB.CreateUsersMessagesTable);

app.get("/InsertDataUsers", CreateDB.InsertDataToUsers);
app.get("/InsertDataItems", CreateDB.InsertDataToItems);
app.get("/InsertDataQuotes", CreateDB.InsertDataToQuotes);
app.get("/InsertDataUsersMessages", CreateDB.InsertDataToUsersMessages);

app.get('/ShowTableUsers', CreateDB.ShowUsersTable);
app.get('/ShowTableItems', CreateDB.ShowItemsTable);
app.get('/ShowTableQuotes', CreateDB.ShowQuotesTable);
app.get('/ShowTableUsersMessages', CreateDB.ShowUsersMessagesTable);

app.get('/DropTableUsers', CreateDB.DropUsersTable);
app.get('/DropTableItems', CreateDB.DropItemsTable);
app.get('/DropTableQuotes', CreateDB.DropQuotesTable);
app.get('/DropTableUsersMessages', CreateDB.DropUsersMessagesTable);

app.get('/aboutUs' , CreateDB.insertAbout);

app.get('/LoadTables' , (req, res)=>{
    res.render('LoadTables.pug');
});
app.get('/openingScreen' , (req, res)=>{
    res.render('openingScreen.pug');
});
/*
app.get('/aboutUs' , (req, res)=>{
    res.render('about.pug');
});
*/
app.get('/SignUp' , (req, res)=>{
    res.render('SignUp.pug');
});
app.get('/ContactUs' , (req, res)=>{
    res.render('ContactUs.pug');
});



app.post("/newUser", CRUD_operations.createNewUser); 

app.post("/sendMessage", CRUD_operations.sendNewMessage);

app.get("/logIn", CRUD_operations.userLogIn);

app.post("/uploadeNew", CRUD_operations.uploadeNewItem);

app.get("/showItemsBySearch", CRUD_operations.itemsBySearch);

app.post("/giveSugg", CRUD_operations.uploadSugg);