const mysql = require('mysql')
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
app = express();
 
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database:"todo_app"
});

// Connecting to database
connection.connect(function (err) {
    if (err) {
        console.log("Error in the connection")
        console.log(err)
    }
});

app.get('/',(req,res)=>{
    let sql="SELECT * FROM todos";
    connection.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        for(var i=0;i<result.length;i++){
            const date=result[i].date.toISOString().split('T')[0];
            result[i].date=date;
        }
        res.render("index",{data:result});
    });
    // res.render("index");

});
app.get("/createTable",(req,res)=>{
    let sql="CREATE TABLE todos(id INT AUTO_INCREMENT PRIMARY KEY, task VARCHAR(255), date  DATE)";
    connection.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.send("Table Created");
    })
});


app.post("/addTask", (req,res)=>{
    console.log(req.body);
    if(req.body.task==""){
        req.flash("error","First Name cannot be left blank");
        return res.redirect("/");
    }
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    console.log(date);
    
    // console.log(today);
    let sql=`INSERT INTO todos (task,date) values ("${req.body.task}",'${date}')`;
    connection.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.redirect("/");
    });
});



// app.update("/update/:id", (req, res) => {
//     let id = req.params.id;
//     let sql = `UPDATE todos SET task="${req.body.task}",  WHERE id=${id}`;
//         connection.query(sql, (err, result) => {
//         if (err) console.log(err);
//         console.log(result);
//         res.redirect("/");
//     });
// });

app.delete("/delete/:id",(req,res)=>{
    let id=req.params.id;
    let sql=`DELETE FROM todos WHERE id=${id}`;
    connection.query(sql,(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.sendStatus(200);
    });
});

app.listen(3000, function () {
    console.log('Listening.....');
});
 