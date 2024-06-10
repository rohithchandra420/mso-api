const mongoose  = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    count: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: 'false'
    }, 
    remainingCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})


const Product = mongoose.model('Product', productSchema);

module.exports = Product;