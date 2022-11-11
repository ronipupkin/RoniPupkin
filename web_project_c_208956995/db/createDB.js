var SQL = require('./db');
const path = require('path');
const csv=require('csvtojson');




//create tables
const CreateUsersTable = (req,res)=> {
    var Q1 = "CREATE TABLE users (email varchar(255) NOT NULL, password varchar(255) NOT NULL, name varchar(255) NOT NULL, birthDate Date NOT NULL, accountType varchar(4) NOT NULL, uploadedOn datetime NOT NULL, PRIMARY KEY (`email`, `accountType`))";
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating users table"});
            return;
        }
        console.log('created users table');
        res.send("users table created");
        return;
    })      
}

const CreateItemsTable = (req,res)=> {
    var Q2 = "CREATE TABLE items (itemId int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, userEmail varchar(255) NOT NULL,itemName varchar(12) NOT NULL, lastDate Date NOT NULL, category varchar(100) NOT NULL, picture nvarchar(100), description varchar(24), highestPrice real NOT NULL,uploadedOn datetime NOT NULL, FOREIGN KEY (userEmail) REFERENCES users (email))";
    SQL.query(Q2,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating items table"});
            return;
        }
        console.log('created items table');
        res.send("items table created");
        return;
    })      
}

const CreateQuotesTable = (req,res)=> {
    var Q3 = "CREATE TABLE Quotes (userOfferEmail varchar(255) NOT NULL, itemId int(11) NOT NULL, quotationPrice int NOT NULL, uploadedOn datetime NOT NULL, PRIMARY KEY (userOfferEmail, itemId), FOREIGN KEY (userOfferEmail) REFERENCES users (email), FOREIGN KEY (itemId) REFERENCES items (itemId))";
    SQL.query(Q3,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating quotes table"});
            return;
        }
        console.log('created quotes table');
        res.send("Quotes table created");
        return;
    })      
}

const CreateUsersMessagesTable = (req,res)=> {
    var Q4 = "CREATE TABLE usersMessages (messageId int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, userName varchar(255) NOT NULL, userEmail varchar(255) NOT NULL, message varchar(1000) NOT NULL, uploadedOn datetime NOT NULL)";
    SQL.query(Q4,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating usersMessages table"});
            return;
        }
        console.log('created usersMessages table');
        res.send("usersMessages table created");
        return;
    })      
}


const insertAbout = (req, res)=>{
    const csvFilePath= path.join(__dirname, "aboutUsText.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj.TEXT);

    res.render('about.pug', {var1: jsonObj});
    })
    
    
};

//insert
const InsertDataToUsers = (req,res)=>{
    var Q5 = "INSERT INTO users SET ?";
    const csvFilePath= path.join(__dirname, "usersData.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewUserEntry = {
            "email": element.email,
            "password": element.password,
            "name": element.name,
            "birthDate": element.birthDateYear + "-" + element.birthDateMonth + "-" + element.birthDateDay,
            "accountType": element.accountType,
            "uploadedOn": element.uploadedOnYear + "-" + element.uploadedOnMonth + "-" + element.uploadedOnDay + " " + element.uploadedOnTime
        }
        SQL.query(Q5, NewUserEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data into users table", err);
            }
            console.log("created row sucssefuly in users table " + mysqlres);
        });
    });
    })
    res.send("data read in users table");
};

const InsertDataToItems = (req,res)=>{
    var Q6 = "INSERT INTO items SET ?";
    const csvFilePath= path.join(__dirname, "itemsData.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewItemEntry = {
            "userEmail": element.userEmail,
            "itemName": element.itemName,
            "lastDate": element.lastDateYear + "-" + element.lastDateMonth + "-" + element.lastDateDay,
            "category": element.category,
            "picture": element.picture,
            "description": element.description,
            "highestPrice": element.highestPrice,
            "uploadedOn": element.uploadedOnYear + "-" + element.uploadedOnMonth + "-" + element.uploadedOnDay + " " + element.uploadedOnTime
        }
        console.log("try insert item: " + NewItemEntry);
        SQL.query(Q6, NewItemEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data into items table", err);
            }
            console.log("created row sucssefuly in items table " + mysqlres);
        });
    });
    })
    res.send("data read in items table");
};

const InsertDataToQuotes = (req,res)=>{
    var Q7 = "INSERT INTO Quotes SET ?";
    const csvFilePath= path.join(__dirname, "quotesData.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewQuoteEntry = {
            "userOfferEmail": element.userOfferEmail	,
            "itemId": element.itemId,
            "quotationPrice": element.quotationPrice,
            "uploadedOn": element.uploadedOnYear + "-" + element.uploadedOnMonth + "-" + element.uploadedOnDay + " " + element.uploadedOnTime
        }
        SQL.query(Q7, NewQuoteEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data into Quotes table", err);
            }
            console.log("created row sucssefuly in Quotes table");
        });
    });
    })
    res.send("data read in Quotes table");
};

const InsertDataToUsersMessages = (req,res)=>{
    var Q8 = "INSERT INTO usersMessages SET ?";
    const csvFilePath= path.join(__dirname, "usersMessagesData.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewUsersMessagesEntry = {
            "userName": element.userName,
            "userEmail": element.userEmail,
            "message": element.message,
            "uploadedOn": element.uploadedOnYear + "-" + element.uploadedOnMonth + "-" + element.uploadedOnDay + " " + element.uploadedOnTime
        }
        SQL.query(Q8, NewUsersMessagesEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data into usersMessages table", err);
            }
            console.log("created row sucssefuly in usersMessages table");
        });
    });
    })
    res.send("data read in usersMessages table");
};

//show
const ShowUsersTable = (req,res)=>{
    var Q9 = "SELECT * FROM users";
    SQL.query(Q9, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing users table ", err);
            res.send("error in showing users table ");
            return;
        }
        console.log("showing users table");
        res.send(mySQLres);
        return;
    })
};

const ShowItemsTable = (req,res)=>{
    var Q10 = "SELECT * FROM items";
    SQL.query(Q10, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing items table ", err);
            res.send("error in showing items table ");
            return;
        }
        console.log("showing items table");
        res.send(mySQLres);
        return;
    })
};

const ShowQuotesTable = (req,res)=>{
    var Q11 = "SELECT * FROM Quotes";
    SQL.query(Q11, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing Quotes table ", err);
            res.send("error in showing Quotes table ");
            return;
        }
        console.log("showing Quotes table");
        res.send(mySQLres);
        return;
    })
};

const ShowUsersMessagesTable = (req,res)=>{
    var Q12 = "SELECT * FROM usersMessages";
    SQL.query(Q12, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing usersMessages table ", err);
            res.send("error in showing usersMessages table ");
            return;
        }
        console.log("showing usersMessages table");
        res.send(mySQLres);
        return;
    })
};

//drop
const DropUsersTable = (req, res)=>{
    var Q13 = "DROP TABLE users";
    SQL.query(Q13, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping users table ", err);
            res.status(400).send({message: "error on dropping users table" + err});
            return;
        }
        console.log("users table drpped");
        res.send("users table drpped");
        return;
    })
};

const DropItemsTable = (req, res)=>{
    var Q14 = "DROP TABLE items";
    SQL.query(Q14, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping items table ", err);
            res.status(400).send({message: "error on dropping items table" + err});
            return;
        }
        console.log("items table drpped");
        res.send("items table drpped");
        return;
    })
};

const DropQuotesTable = (req, res)=>{
    var Q15 = "DROP TABLE Quotes";
    SQL.query(Q15, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping Quotes table ", err);
            res.status(400).send({message: "error on dropping Quotes table" + err});
            return;
        }
        console.log("Quotes table drpped");
        res.send("Quotes table drpped");
        return;
    })
};

const DropUsersMessagesTable = (req, res)=>{
    var Q16 = "DROP TABLE usersMessages";
    SQL.query(Q16, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping usersMessages table ", err);
            res.status(400).send({message: "error on dropping usersMessages table" + err});
            return;
        }
        console.log("usersMessages table drpped");
        res.send("usersMessages table drpped");
        return;
    })
};

module.exports = {insertAbout, CreateUsersTable, CreateItemsTable, CreateQuotesTable, CreateUsersMessagesTable, InsertDataToUsers, InsertDataToItems, InsertDataToQuotes, InsertDataToUsersMessages, ShowUsersTable, ShowItemsTable, ShowQuotesTable, ShowUsersMessagesTable, DropUsersTable, DropItemsTable, DropQuotesTable, DropUsersMessagesTable};