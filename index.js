//importing modules 
const express = require('express'); 
const path= require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { title } = require('process');
const { globalAgent } = require('http');


//all gloabal variables and classes 
const port=5000 ; 
//setting up mysql server 
const pool = mysql.createPool({
    connectionlimit: 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'todolist'

}); 
//


//starting server 
const app = express();
//setting the view engine template 
app.set('view engine','ejs');
//setting the path 
app.set('views',path.join(__dirname,'views'));

//setting up middleware to encode the req data
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//use static files
app.use(express.static("public"));

//-------------------------------------
var globalarray=[];




//---------------------------------------------//
app.get('/',function(req,res){
  
    pool.getConnection((err,connection)=>{
        if(err) throw err ; 
        console.log(connection.threadId);
       //this indicate connection succesfull
        connection.query('SELECT * from todotable',(errr,row)=>{
            connection.release();
            if(!errr){
                
                for(var i =0 ; i < row.length; i++){
                    globalarray.push({id:row[i].id,title:row[i].title,description:row[i].description,status:row[i].status});
                }
                console.log(globalarray);
//                res.send(row);
                res.render('viewlist',{globalarray:globalarray});
                globalarray=[];

            }else{
                console.log(errr);
            }
        });
 });
});

app.get('/clickon/:id',function(req,res){
    var id = req.params.id ; 
    pool.getConnection((err,connection)=>{
        if(err) throw err ; 
        console.log(connection.threadId);
       //this indicate connection succesfull
        connection.query(`SELECT description from todotable where id='${id}'`,(errr,row)=>{
            connection.release();
            if(!errr){
                res.send(row);
            }else{
                console.log(errr);
            }
        });
 });
});
//----------------------------------------------------------------------------------------------
app.post('/insert',function(req,res){
    var objfromuser={title : req.body.title ,
            description:req.body.description,
            status:0}
   
    let qurey=`INSERT INTO todotable (title, description, status) VALUES ( '${objfromuser.title}', '${objfromuser.description}', '${objfromuser.status}');`;
   
   
            pool.getConnection((err,connection)=>{
        if(err) throw err ; 
        console.log(connection.threadId);
       //this indicate connection succesfull
        connection.query(qurey,(errr,row)=>{
            connection.release();
            if(!errr){
                console.log("it is added");
                res.redirect('/');
            }else{
                console.log(errr);
            }
        });
 });
});

//-----------------------------------------------------------------------------------------------
app.put('/updatetitle',function(req,res){
    var objfromuser={
        id :req.body.id ,
        title : req.body.title ,
        description:req.body.description,
        status:0}

let qurey=`UPDATE todotable SET title='${objfromuser.title}' WHERE id='${objfromuser.id}';`;


    pool.getConnection((err,connection)=>{
    if(err) throw err ; 
    console.log(connection.threadId);
   //this indicate connection succesfull
    connection.query(qurey,(errr,row)=>{
        connection.release();
        if(!errr){
            res.send("it is updated ");
        }else{
            console.log(errr);
        }
    });
});


});
//----------------------------------------------------------------------------
//updating task description
app.put('/updatedesc',function(req,res){
    var objfromuser={
        id :req.body.id ,
        title : req.body.title ,
        description:req.body.description,
        status:0}

let qurey=`UPDATE todotable SET description='${objfromuser.description}' WHERE id='${objfromuser.id}';`;


    pool.getConnection((err,connection)=>{
    if(err) throw err ; 
    console.log(connection.threadId);
   //this indicate connection succesfull
    connection.query(qurey,(errr,row)=>{
        connection.release();
        if(!errr){
            res.send("it is updated");
        }else{
            console.log(errr);
        }
    });
});
});
//-----------------------------------------------------------------------
//delete task 
app.get('/delete/:id',function(req,res){
    var objfromuser={
        id :req.body.id ,
        title : req.body.title ,
        description:req.body.description,
        status:0}
        var id =req.params.id ; 

let qurey=`DELETE FROM todotable  WHERE id ='${id}';`;


    pool.getConnection((err,connection)=>{
    if(err) throw err ; 
    console.log(connection.threadId);
   //this indicate connection succesfull
    connection.query(qurey,(errr,row)=>{
        connection.release();
        if(!errr){
            res.redirect('/');
        }else{
            console.log(errr);
        }
    });
});


});










//listing the server to the port 
app.listen(port,function(err){
    if(err){
        console.log(err);
    }
    console.log("listening to the port "+ port);
})
