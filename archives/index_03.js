const { Router } = require('express')
const express = require('express')
const mongoose = require ('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const productModel = require('./model/Product') 
const userModel = require('./model/User') 
const path = require('path')
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost:27017/test');
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser).use(urlencodedParser)

function getAllProducts(callback){

    productModel.find({}, callback)
} 

function orderProductById(productId, callback){
     
    productModel.findOneAndUpdate({id:productId}, {$inc: { "order_counter": 1 }},(error, data) => {
        if(error)
        {
            console.log('error :', error)
            return callback()
        }
        if (!data){
            return console.log('Produit inconnu.')
        }
        productModel.findOne({id:productId},(error, data) => {
            if(error)
            {
                console.log('error :', error)
                return callback()
            }
            return callback(data);
        })
    })         
};

// Gestion des erreurs générique
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

//render with ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.get('/', (req,res) => {    
    getAllProducts(function (error, data) {   
        
        if(error)
        {
            res.status(500).send(error.toString())
        }
        res.render('pages/index', {products: data})
    })
})    

    
app.post('/orderProduct/:id', (req,res, next)=>{
    console.log(req.body)
    if(req.body.email && req.body.password){
        
        userModel.findOne({email :req.body.email, password:req.body.password}, (error, data) =>
            {
                if(error) {
                    return res.status(500).send(error.toString())
                    
                }
                if(!data){
                    return res.status(401).send('user not found')
                }
                console.log (data)
                next()
            } )
    }
    else
    {
        res.status(401).send('missing credential')
    }
    
}, (req,res) => {  
    orderProductById(req.params.id, function (data) {

        res.status(200).send({products: data})
    })
})    
app.listen(port, () => console.log('Listening'))

