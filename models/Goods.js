const {Schema, model, Types} = require('mongoose')

const schema = new Schema ({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    article: {type: String, required: true, unique: true},
    imgName: {type: String},
    quantity: {type: Number, required: true},
    subCategoryId: {type: Types.ObjectId, required: true},

})

module.exports = model('Goods', schema, 'goods')