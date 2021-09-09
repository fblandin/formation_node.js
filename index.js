const express = require('express')
const mongoose = require ('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const path = require('path')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const helmet = require("helmet");

const methodOverride = require('method-override')
const restify = require('express-restify-mongoose')
const nodeExternals = require('webpack-node-externals')

module.exports


const productModel = require('./model/Product') 
const userModel = require('./model/User') 
const orderModel = require('./model/Order')  

const app = express()
const port = 3000
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/test');
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser).use(urlencodedParser)

//Use Passport for authent
app.use(require('serve-Static')(__dirname + '/../../public'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({extended:true}))
app.use(require('express-session')({secret:'keyboard cat', resave: true, saveUninitialized: false}))

app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride())

passport.serializeUser(function (user,done){
    done(null, user.id)
})

passport.deserializeUser(function (id, done){
    userModel.findById(id, function(err,user){
        done(err,user)
    })
})

// Authorisation strategy :
passport.use(new LocalStrategy(
    function(username, password, done) {
        userModel.findOne({ username: username, password:password }, function(err, data) {
        if (err) { return done(err); }
        if (!data) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        return done(null, data);
      });
    }
  ));

  passport.use(new GoogleStrategy({
    clientID: 'test',
    clientSecret: 'test',
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

passport.use(new FacebookStrategy({
    clientID: 'FACEBOOK_APP_ID',
    clientSecret: 'FACEBOOK_APP_SECRET',
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {

      done(null, user);
  }
));

// Product functions :

function getAllProducts(callback){
    console.log('toto')
    
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

function addOrder(productId, userId, price){
    orderModel.create({ 
        product: productId,
        user: userId,
        price: price 
    }, function (err, small) {
        if (err) return handleError(err);
        // saved!
      });
}


function getOrders(userId){
    return orderModel.find({userId: userId}).populate('product')
}

async function getProductsOrder(userId){
    try {
        let formattedResponse = []
        let orders = await orderModel.find({userId: userId}).populate('product')

        for (let i = 0; i < orders.length; i++) {
            const element = orders[i];
            let product = {product: element.product}
            formattedResponse.push(product)        
        }
        return formattedResponse
    }
    catch (e){
        console.error("Error getting products order",e)
    }
}

// Gestion des erreurs générique
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

//restify model :
restify.serve(app, productModel)

//roots :
app.get('/', (req,res) => {    
    getAllProducts(function (error, data) {   
      debugger;
        if(error)
        {
            res.status(500).send(error.toString())
        }
        res.render('pages/index', {products: data})
    })
})    

app.get('/Orders',(req,res, next)=>{
    if(req.isAuthenticated())
    {
        next()
    }}
    , (req,res) => {    
    getOrders(req.user._id)
    .then (function whenOk(response){
        let formattedResponse=[]
        response.forEach(element => {
            let order = {productName: element.product.name, productPrice: element.price, orderDate: element.creation_date}
            formattedResponse.push(order)
        });
        return res.status(200).send({data: formattedResponse})
    })
})    

app.get('/Orders/Products',(req,res, next)=>{
    if(req.isAuthenticated())
    {
        next()
    }}
    , async (req,res) => {    
        let formattedResponse = await getProductsOrder(req.user._id)    
        console.log(formattedResponse)
        return res.status(200).send({data: formattedResponse})
    })



app.post('/login', passport.authenticate('local', { successRedirect:'/',
                                   failureRedirect: '/',
                                   failureFlash: true })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });
  app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

  app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'read_stream' })
);
  app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] })
);
    
app.post('/orderProduct', passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }),
    // Middleware de vérification de l'authentification
    (req,res, next)=>{
      debugger;
    if(req.isAuthenticated())
    {
        next()
    }
    else 
        return(res.status(401).send('not authenticated'))}, 
    // Commande du produit
    (req,res) => {  
        orderProductById(req.body?.id, function (data) {            
            addOrder(data._id, req.user._id, data.EUR_price)
            res.status(200).send({products: data})
        return;
    })
})    

app.listen(port, () => console.log('Listening'))

