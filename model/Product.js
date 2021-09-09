const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id:  String, 
    name: String,
    description: String,
    USD_price: Number,
    EUR_price: Number,
    file_link: String,
    creation_date:  {type: Date, default: Date.now },
    order_counter: Number,
  });

  const productModel = new mongoose.model('product', productSchema)
  module.exports = productModel