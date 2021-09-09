const { Router } = require('express')
const express = require('express')
const mongoose = require ('mongoose')
var bodyParser = require('body-parser')
const productModel = require('./model/Product') 
const userModel = require('./model/User') 
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
     
    let productsPath = path.join(__dirname, 'products.json')
    fs.readFile(productsPath, 'utf8' , (error, data) => {
        if(error)
        {
            console.log('error :', error)
            return callback()
        }
        let parsedData = JSON.parse(data)
        let product = parsedData.products.find(x => x.id == productId)

        if (!product){
            return console.log('Produit inconnu.')
        }
        
        product.order_counter ++

        fs.writeFile(productsPath, JSON.stringify(parsedData,null, 2), (error) => {
            if(error)
            {
                console.log('error :', error)
                return callback();
            }
            console.log(`Commande terminée. Voici votre fichier : ${product.file_link}`)
            return callback(product);
        });

    })    
};



var fs = require('fs')
var path = require('path')
var rl = require ('readline')

var readline = rl.createInterface({input: (process.stdin), terminal: false})

readline.on('line', (x) => {
    if(x.toLowerCase().startsWith('i want product ')){
        let splittedString = x.split(' ')
        let selectedId = splittedString[splittedString.length-1]
        orderProductById(selectedId, getAllProducts)}
    }
)
//render with ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.get('/', (req,res) => {    
    getAllProducts(function (error, data) {   
        
        if(error)
        {
            res.status(500).send(error.toString())
        }
        console.log(data)
        res.render('pages/index', {products: data})
    })
})    

    
app.post('/orderProduct/:id', (req,res, next)=>{
    
    if(req.body.email && req.body.password){
        userModel.findOne({email :req.body.email, password:req.body.password}, (error, data) =>
            {
                if(error) {
                    return res.status(500).send(error.toString())
                    
                }
                if(!data){
                    return res.status(401).send('user not found')
                }
                next()
            } )
    }
    else
    {
        res.status(401).send('missing credential')
    }
    
}, (req,res) => {  
    console.log(`ordered id : ${req.params.id}`)
    orderProductById(req.params.id, function (data) {
        res.status(200).send({products: data})
    })
})    
app.listen(port, () => console.log('Listening'))