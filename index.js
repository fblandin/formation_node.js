function getAllProducts(){
    let productsPath = path.join(__dirname, 'products.json')
    fs.readFile(productsPath, 'utf8' , (error, data) => {
        if(error)
        {
            console.log('error :', error)
        }
        let parsedData = JSON.parse(data)
        console.log('Bonjour, voici la liste de produits disponibles :')
        parsedData.products.forEach(x => {
            console.log(`   - ${x.id} - ${x.name} / ${x.EUR_price} / ${x.order_counter}`)
        })
      }) 
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
            return callback();
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

