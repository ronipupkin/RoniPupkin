const sql = require('./db');
var path = require('path');

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
            console.log("ERROR IS: " + err);
            res.status(400).send("Somthing is wrong with query" + err);
            return;
        }
        console.log(results);
        if(results.length == 0){
            const NewUser = {
                "email": req.body.userEmail,
                "password": req.body.userPassword,
                "name": req.body.userName,
                "birthDate": req.body.userBirthDate, 
                "accountType": req.body.userAccountType,
                "uploadedOn": currentdate
            };
            console.log(NewUser);
            sql.query("INSERT INTO users SET ?", NewUser, (err, mysqlres)=>{
                if (err) {
                    console.log("ERROR: ", err);
                    res.status(400).send({message: "error in creating an account1 " + err});
                    return;
                }
                console.log("New user created");
                res.redirect("views/openingScreen.html");
                alert("you did it1");
                return;
            } )
        } else if(results[0].accountType != req.body.userAccountType){
            const NewUser = {
                "email": req.body.userEmail,
                "password": req.body.userPassword,
                "name": req.body.userName,
                "birthDate": req.body.userBirthDate, 
                "accountType": req.body.userAccountType,
                "uploadedOn": currentdate
            };
            console.log(NewUser);
            sql.query("INSERT INTO users SET ?", NewUser, (err, mysqlres)=>{
                if (err) {
                    console.log("ERROR: ", err);
                    res.status(400).send({message: "error in creating an account2 " + err});
                    return;
                }
                console.log("New user created");
                res.redirect("views/openingScreen.html"); //אחרי שמצליחים אולי להעביר לעמוד אחר ולא ישר לעמוד פתיחה בחזרה.
                //alert("you did it2");
                return;
            } )
        } else {
            //alert("already exists");
            res.redirect("views/SignUp.html"); //לא מצליחה להקפיץ הודעה למשתמש עם alert
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
        res.redirect("views/ContactUs.html");
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
            //changeDisplayForNote("block");
            //res.redirect("views/openingScreen.html");
            res.sendfile(path.join(__dirname,"./public/views/openingScreen.html"));
        } else {
            //changeDisplayForNote("none");
            console.log(checkUser.accountType);
            if(checkUser.accountType == "SELL"){
                //res.redirect("views/NewItem.html");
                res.sendfile(path.join(__dirname,"./public/views/NewItem.html"));
            } else{
                //res.redirect("views/GiveSugg.html");
                res.sendfile(path.join(__dirname,"./public/views/GiveSugg.html"));
            }
        }
        return;
    } )
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
    const Item = {
        "userEmail": "anat@gmail.com",
        "itemName": req.body.ItemsName,
        "lastDate": req.body.LastDate,
        "category": req.body.ItemCategory,
        "picture": req.body.ItemsPicture,
        "description": req.body.ItenDescription,
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
        res.sendfile(path.join(__dirname,"./public/views/NewItem.html"));
        return;
    } )

}

module.exports = {createNewUser, sendNewMessage, userLogIn, uploadeNewItem};


function changeDisplayForNote(dis){
    if(dis == "block"){
        document.getElementById('SignIn_note').style.display = block;
    } else if(dis == "none") {
        document.getElementById('SignIn_note').style.display = none;
    }
}