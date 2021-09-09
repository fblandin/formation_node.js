// Using method for query handling
const http = require('http');

const server = http.createServer(function (req,res){
	
    if(req.method === 'POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log(body);
            res.end('ok');
        })
    }})

server.listen(8080, '127.0.0.1', () => {
        console.log(`Server running`) })


//Using URL for query handling
const http = require('http');

const server = http.createServer(function (req,res){
    const url =req.url;
    if(url === '/about'){
        res.write('<h1>about us page</h1>')
        res.end()
    }
    else if (url === '/contact'){
        res.write('contact')
        res.end()
    }
    })

server.listen(8080, '127.0.0.1', () => {
        console.log(`Server running`) })      

//Server using express
const { Router } = require('express')
const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get('/', (req,res) => res.send('toto'))
app.listen(port, () => console.log('testaze'))


//render with pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"))

Router.get("/", (req, res) => 
    {res.render("homepage")})