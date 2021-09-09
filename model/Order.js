const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    product:{type: mongoose.Schema.Types.ObjectId, ref: 'product'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    creation_date:  {type: Date, default: Date.now },
    price: Number
  });

  const orderModel = new mongoose.model('order', orderSchema)
  module.exports = orderModel