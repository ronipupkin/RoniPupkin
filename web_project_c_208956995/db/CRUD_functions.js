const sql = require('./db');
var path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const url = require('url');



const createNewUser = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "content cannot be empty"});
        return;
    }

    var currentdate = new Date();
    var dd = currentdate.getDate();
    var mm = currentdate.getMonth()+1; //January is 0 so need to add 1 to make it 1!
    var yyyy = currentdate.getFullYear();
    
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    }
    
    var hh = currentdate.getHours();
    var mi = currentdate.getMinutes();
    var ss = currentdate.getSeconds();

    currentdate = yyyy+'-'+mm+'-'+dd+' '+hh+':'+mi+':'+ss;

    sql.query("SELECT accountType FROM users where email like ?" , req.body.userEmail, (err, results, fields)=>{
        if (err) {
            console.log("ERROR1: " + err);
            res.status(400).send("Somthing is wrong with query" + err);
            return;
        }
        console.log(results);
        const NewUser = {
            "email": req.body.userEmail,
            "password": req.body.userPassword,
            "name": req.body.userName,
            "birthDate": req.body.userBirthDate, 
            "accountType": req.body.userAccountType,
            "uploadedOn": currentdate
        };
        console.log(NewUser);
        if(results.length == 0 || results[0].accountType != req.body.userAccountType){
            sql.query("INSERT INTO users SET ?", NewUser, (err, mysqlres)=>{
                if (err) {
                    console.log("ERROR2: ", err);
                    res.status(400).send({message: "error in creating an account1 " + err});
                    return;
                }
                console.log("New user created");
                
                res.render('openingScreen', {var1: NewUser.name, var2: ", you successfully registered! Now you can enter the site", varEmail: NewUser.email});
                return;
            } )
        } else {
            res.render('SignUp', {var1: "It looks like you already exists. Try to log in or Sign up with different details."});
        }
        return;
    });
   
    

}; 

const sendNewMessage = (req, res)=>{
    if (!req.body) {
        console.log(req.body.messageName);
        res.status(400).send({message: "content cannot be empty"});
        return;
    }
    var currentdate = new Date();
    var dd = currentdate.getDate();
    var mm = currentdate.getMonth()+1; //January is 0 so need to add 1 to make it 1!
    var yyyy = currentdate.getFullYear();
    
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    }
    
    var hh = currentdate.getHours();
    var mi = currentdate.getMinutes();
    var ss = currentdate.getSeconds();

    currentdate = yyyy+'-'+mm+'-'+dd+' '+hh+':'+mi+':'+ss;
    const NewMessage = {
        "userName": req.body.messageName,
        "userEmail": req.body.messageEmail,
        "message": req.body.messageText,
        "uploadedOn": currentdate
    };
    console.log(NewMessage);
    sql.query("INSERT INTO usersMessages SET ?", NewMessage, (err, mysqlres)=>{
        if (err) {
            console.log("ERROR: ", err);
            res.status(400).send({message: "error in creating new message " + err});
            return;
        }
        console.log("New message send");
        res.render('ContactUs', {var1: NewMessage.userName, var2: ", thank you for your message!"});
        return;
    } )

}; 

const userLogIn = (req, res)=>{
    if (!req.body) {
        console.log(req.body.messageName);
        res.status(400).send({message: "content cannot be empty"});
        return;
    }
    console.log(req.query);
    const checkUser = {
        "email": req.query.logInEmail,
        "password": req.query.logInPassword,
        "accountType": req.query.logInUserAccountType 
    };
    let data = [checkUser.email, checkUser.password, checkUser.accountType];
    console.log(checkUser);
    sql.query("select * from users where email = ? and password = ? and accountType = ?", data, (err, mysqlres)=>{
        if (err) {
            console.log("ERROR: ", err);
            res.status(400).send({message: "error in creating new message " + err});
            return;
        }
        if(mysqlres.length == 0){
            res.render('openingScreen', {var3: "We could not find the details you entered in the system, please try again"});
        } else {
            console.log(checkUser.accountType);
            if(checkUser.accountType == "SELL"){
                res.render('NewItem', {var1: checkUser.email});
            } else{ //accout type is BUY
                sql.query("select items.itemId, items.itemName, items.lastDate, items.category, items.picture, items.description, items.highestPrice, YEAR(items.lastDate) AS year_lastDate, MONTH(items.lastDate) AS month_lastDate, DAY(items.lastDate) AS day_lastDate, usersQuotes.quotationPrice, usersQuotes.userOfferEmail from items LEFT JOIN (select * from Quotes where userOfferEmail like ?) as usersQuotes on items.itemId = usersQuotes.itemId where lastDate >= CAST(CURRENT_TIMESTAMP AS DATE)", checkUser.email, (err, mysqlres2)=>{
                    if (err) {
                        console.log("ERROR: ", err);
                        res.status(400).send({message: "error in getting all items " + err});
                        return;
                    }
                    if(mysqlres2.length == 0){
                        console.log("There are no items");
                        res.render('GiveSugg', {itemsToShow: mysqlres2, var1: "There are no items to show. Please try again later", varEmail: checkUser.email});
                    } else {
                        console.log("found items");
                        res.render('GiveSugg', {itemsToShow: mysqlres2, varEmail: checkUser.email});
                    }
                    return;
                } )
            }
        }
        return;
    } )
};

const itemsBySearch = (req, res)=>{
    if (!req.body) {
        console.log(req.body.messageName);
        console.log("body is empty");
        res.status(400).send({message: "content cannot be empty"});
        return;
    }
    console.log(req.query);
    const search = req.query.Categories;
    if(search == "Show All"){
        sql.query("select items.itemId, items.itemName, items.lastDate, items.category, items.picture, items.description, items.highestPrice, YEAR(items.lastDate) AS year_lastDate, MONTH(items.lastDate) AS month_lastDate, DAY(items.lastDate) AS day_lastDate, usersQuotes.quotationPrice, usersQuotes.userOfferEmail from items LEFT JOIN (select * from Quotes where userOfferEmail like ?) as usersQuotes on items.itemId = usersQuotes.itemId where lastDate >= CAST(CURRENT_TIMESTAMP AS DATE)", req.query.usersEmailSugg, (err, mysqlres)=>{
            if (err) {
                console.log("ERROR: ", err);
                res.status(400).send({message: "error in getting all items " + err});
                return;
            }
            if(mysqlres.length == 0){
                console.log("There are no items");
                res.render('GiveSugg', {itemsToShow: mysqlres, var1: "There are no items matching your request: ", var2: search, varEmail: req.query.usersEmailSugg});
            } else {
                console.log("found items");
                res.render('GiveSugg', {itemsToShow: mysqlres, varEmail: req.query.usersEmailSugg, var3: "Category selected: ", var4: search});
            }
            
            return;
        } )
    }else{
        let data = [req.query.usersEmailSugg, search];
        sql.query("select items.itemId, items.itemName, items.lastDate, items.category, items.picture, items.description, items.highestPrice, YEAR(items.lastDate) AS year_lastDate, MONTH(items.lastDate) AS month_lastDate, DAY(items.lastDate) AS day_lastDate, usersQuotes.quotationPrice, usersQuotes.userOfferEmail from items LEFT JOIN (select * from Quotes where userOfferEmail like ?) as usersQuotes on items.itemId = usersQuotes.itemId where lastDate >= CAST(CURRENT_TIMESTAMP AS DATE) and category like ?", data, (err, mysqlres)=>{
            if (err) {
                console.log("ERROR: ", err);
                res.status(400).send({message: "error in getting items by search " + err});
                return;
            }
            if(mysqlres.length == 0){
                console.log("There are no items");
                res.render('GiveSugg', {itemsToShow: mysqlres, var1: "There are no items matching your request: ", var2: search, varEmail: req.query.usersEmailSugg});
            } else {
                console.log("found items");
                console.log(mysqlres);
                console.log(mysqlres[0]);
                res.render('GiveSugg', {itemsToShow: mysqlres, varEmail: req.query.usersEmailSugg, var3: "Category selected: ", var4: search});
            }
            return;
        } )
    }
    
};

const uploadeNewItem = (req, res)=>{
    if (!req.body) {
        console.log(req.body.messageName);
        res.status(400).send({message: "content cannot be empty"});
        return;
    }

    var currentdate = new Date();
    var dd = currentdate.getDate();
    var mm = currentdate.getMonth()+1; //January is 0 so need to add 1 to make it 1!
    var yyyy = currentdate.getFullYear();
    
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    }
    
    var hh = currentdate.getHours();
    var mi = currentdate.getMinutes();
    var ss = currentdate.getSeconds();

    currentdate = yyyy+'-'+mm+'-'+dd+' '+hh+':'+mi+':'+ss;

    console.log(req.body);

    if(req.body.ItemsPicture == ""){
        var pic = "../static/noPicture.png";
    } else {
        var pic = "../static/"+req.body.ItemsPicture;
    }
    
    if(req.body.ItenDescription == ""){
        var des = "---";
    } else {
        var des = req.body.ItenDescription;
    }

    const Item = {
        "userEmail": req.body.UsersEmail,
        "itemName": req.body.ItemsName,
        "lastDate": req.body.LastDate,
        "category": req.body.ItemCategory,
        "picture": pic,
        "description": des,
        "highestPrice": '0',
        "uploadedOn": currentdate
    }; 
    console.log(Item);
    
    sql.query("INSERT INTO items SET ?", Item, (err, mysqlres)=>{
        if (err) {
            console.log("ERROR: ", err);
            res.status(400).send({message: "error in creating new message " + err});
            return;
        }
        console.log("New item was added");
        res.render('NewItem', {var1: Item.userEmail, varS: "New item has been added"});
        return;
    } )

}

const uploadSugg = (req, res)=>{
    if (!req.body) {
        console.log(req.body.messageName);
        res.status(400).send({message: "content cannot be empty"});
        return;
    }

    var currentdate = new Date();
    var dd = currentdate.getDate();
    var mm = currentdate.getMonth()+1; //January is 0 so need to add 1 to make it 1!
    var yyyy = currentdate.getFullYear();
    
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    }
    
    var hh = currentdate.getHours();
    var mi = currentdate.getMinutes();
    var ss = currentdate.getSeconds();

    currentdate = yyyy+'-'+mm+'-'+dd+' '+hh+':'+mi+':'+ss;

    console.log(req.body);
    const quote = {
        "userOfferEmail": req.body.usersEmailSugg,
        "itemId": req.body.itemIdSugg,
        "quotationPrice": req.body.OfferPrice,
        "uploadedOn": currentdate
    }; 
    console.log(quote);
    let checkOffer = [quote.userOfferEmail, quote.itemId];
    sql.query("select * from Quotes where userOfferEmail like ? and itemId like ?", checkOffer, (err, mysqlres0)=>{ //check if this user gave a quote for this item before
        if (err) {
            console.log("ERROR: ", err);
            res.status(400).send({message: "error in checking offer " + err});
            return;
        }
        if(mysqlres0.length == 0){  //this is the first quote for this item
            sql.query("INSERT INTO Quotes SET ?", quote, (err, mysqlresult)=>{ //add to Quotes SQL table
                if (err) {
                    console.log("ERROR: ", err);
                    res.status(400).send({message: "error in creating new quotes " + err});
                    return;
                }
                console.log("New quotes was added");
                return;
            } )
            sql.query("SELECT itemId, quotationPrice FROM Quotes WHERE itemId = ? ORDER BY quotationPrice DESC Limit 1", quote.itemId, (err, mysqlres1)=>{
                if (err) {
                    console.log("ERROR: ", err);
                    res.status(400).send({message: "error in creating new quotes " + err});
                    return;
                }
                console.log("the sql result is: " + mysqlres1[0].quotationPrice);
        
                sql.query("select * from items where itemId = ?", mysqlres1[0].itemId, (err, mysqlres2)=>{
                    if (err) {
                        console.log("ERROR: ", err);
                        res.status(400).send({message: "error in getting item " + err});
                        return;
                    }
                    console.log("found item");
                    let data1 = [mysqlres1[0].quotationPrice ,mysqlres1[0].itemId];
                    sql.query("UPDATE items set highestPrice = ? where itemId = ?", data1, (err, mysqlres3)=>{ //update highest price for the item
                        if (err) {
                            console.log("ERROR: ", err);
                            res.status(400).send({message: "error in creating new quotes " + err});
                            return;
                        }
                        console.log("highest Price is: " + mysqlres1[0].quotationPrice);
                        return;
                    } )
                    //show the "GiveSugg" screen again
                    //I used LEFT JOIN to combine items table with quotes table (to get from quotes table only the rows where this user gave quotes to items before, to show on screen what is the last price the user offered for an item)
                    sql.query("select items.itemId, items.itemName, items.lastDate, items.category, items.picture, items.description, items.highestPrice, YEAR(items.lastDate) AS year_lastDate, MONTH(items.lastDate) AS month_lastDate, DAY(items.lastDate) AS day_lastDate, usersQuotes.quotationPrice, usersQuotes.userOfferEmail from items LEFT JOIN (select * from Quotes where userOfferEmail like ?) as usersQuotes on items.itemId = usersQuotes.itemId where lastDate >= CAST(CURRENT_TIMESTAMP AS DATE)", quote.userOfferEmail, (err, mysqlres4)=>{
                        if (err) {
                            console.log("ERROR: ", err);
                            res.status(400).send({message: "error in getting all items " + err});
                            return;
                        }
                        console.log("found items");
                        res.render('GiveSugg', {itemsToShow: mysqlres4, varEmail: quote.userOfferEmail});
                        return;
                    } )
                    return;
                } )
        
                return;
            } )
        } else { //if this is not the first quote this user gives for this item
            let data2 = [quote.quotationPrice, quote.uploadedOn, quote.userOfferEmail, quote.itemId];
            console.log(data2);
            sql.query("UPDATE Quotes SET quotationPrice = ?, uploadedOn = ? where userOfferEmail = ? and itemId = ?", data2, (err, mysqlres5)=>{ //update quotation price
                if (err) {
                    console.log("ERROR: ", err);
                    res.status(400).send({message: "error in updating quote " + err});
                    return;
                }
                console.log(mysqlres5[0]);
                return;
            } )

            sql.query("SELECT itemId, quotationPrice FROM Quotes WHERE itemId = ? ORDER BY quotationPrice DESC Limit 1", quote.itemId, (err, mysqlres6)=>{
                if (err) {
                    console.log("ERROR: ", err);
                    res.status(400).send({message: "error in creating new quotes " + err});
                    return;
                }
                console.log("the sql result is: " + mysqlres6[0].quotationPrice);
        
                sql.query("select * from items where itemId = ?", mysqlres6[0].itemId, (err, mysqlres2)=>{
                    if (err) {
                        console.log("ERROR: ", err);
                        res.status(400).send({message: "error in getting item " + err});
                        return;
                    }
                    console.log("found item");
                    let data1 = [mysqlres6[0].quotationPrice ,mysqlres6[0].itemId];
                    sql.query("UPDATE items set highestPrice = ? where itemId = ?", data1, (err, mysqlres3)=>{ //update highest price for the item
                        if (err) {
                            console.log("ERROR: ", err);
                            res.status(400).send({message: "error in creating new quotes " + err});
                            return;
                        }
                        console.log("highest Price is: " + mysqlres6[0].quotationPrice);
                        return;
                    } )
                    //show the "GiveSugg" screen again
                    //I used LEFT JOIN to combine items table with quotes table (to get from quotes table only the rows where this user gave quotes to items before, to show on screen what is the last price the user offered for an item)
                    sql.query("select items.itemId, items.itemName, items.lastDate, items.category, items.picture, items.description, items.highestPrice, YEAR(items.lastDate) AS year_lastDate, MONTH(items.lastDate) AS month_lastDate, DAY(items.lastDate) AS day_lastDate, usersQuotes.quotationPrice, usersQuotes.userOfferEmail from items LEFT JOIN (select * from Quotes where userOfferEmail like ?) as usersQuotes on items.itemId = usersQuotes.itemId where lastDate >= CAST(CURRENT_TIMESTAMP AS DATE)", quote.userOfferEmail, (err, mysqlres6)=>{
                        if (err) {
                            console.log("ERROR: ", err);
                            res.status(400).send({message: "error in getting all items " + err});
                            return;
                        }
                        console.log("found items");
                        res.render('GiveSugg', {itemsToShow: mysqlres6, varEmail: quote.userOfferEmail});
                        return;
                    } )
                    return;
                } )
        
                return;
            } )
        }

        return;
    } )
    
}

module.exports = {createNewUser, sendNewMessage, userLogIn, uploadeNewItem, itemsBySearch, uploadSugg};
