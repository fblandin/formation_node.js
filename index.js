var fs = require('fs');
var path = require('path');

var productsPath = path.join(__dirname, 'products.json');
console.log(productsPath);

fs.readFile(productsPath, 'utf8' , (error, data) => {
    if(error)
    {
        console.log('error :', error)
    }
    console.log(data);
  })