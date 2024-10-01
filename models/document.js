const mongoose = require('mongoose');

const decoumentSchema = new mongoose.Schema({
    _id: {
        type: String,  // You can use 'String' if you want custom string IDs, or change to 'mongoose.Schema.Types.ObjectId' for MongoDB ObjectId
        required: true
    },
    content:{
        type:String,
        default:''
    }
});

module.exports = mongoose.model('Document',decoumentSchema);