const {Schema, model} = require('mongoose')

const schema = new Schema ({
    user: {type: Object, required: true},
    data: {type: String, required: true},
    producsArr: {type: Array, required: true},
    comment: {type: String},
    deliveryId: {type: String, required: true},
    paymentId: {type: String, required: true},
    state: {type: String, required: true},
})

module.exports = model('Order', schema, 'orders')