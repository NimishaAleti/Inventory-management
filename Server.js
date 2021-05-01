const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Inventory', (err,database)=>{
    if(err) return console.log(err)
    db = database.db('Inventory')
    app.listen(1900,()=>{
        console.log('Listening at port number 1900')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home Page
app.get('/',(req,res,next)=>{
    db.collection('Shirts').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('home_page.ejs',{data: result})
    })
})

// get sales details
app.get('/sales',(req,res)=>{
    db.collection('Sales Details').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('sales.ejs',{data: result})
    })
})


//Add a new product

app.get('/create',(req,res)=>{
    res.render('add.ejs')
})
app.post('/AddData',(req,res)=>{
    db.collection('Shirts').save(req.body,(err,result)=>{
        if(err) return console.log(err)
    console.log('New product added')
    res.redirect('/')
    })
})

//Update

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.post('/Update',(req,res)=>{
    db.collection('Shirts').find().toArray((err,result)=>{
        if(err) 
            return console.log(err)
        for(var i = 0; i<result.length;i++){
            if(result[i].prod_id==req.body.id){
                s = result[i].stock
                break
            }
        }
        db.collection('Shirts').findOneAndUpdate({prod_id:req.body.id},{
        $set:{stock:parseInt(s)+parseInt(req.body.stock)}},{sort:{_id:-1}},
        (err,result) => {
            if(err)
                return res.send(err)
            console.log(req.body.id+ ' stock updated')
            res.redirect('/')
    })
})
})


//delete
app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})




app.post('/Delete',(req,res)=>{
    db.collection('Shirts').findOneAndDelete({prod_id:req.body.id},(err,result) => {
        if(err)
         return console.log(err)
         console.log(req.body.id+ ' product deleted')
        res.redirect('/')
    })
})
