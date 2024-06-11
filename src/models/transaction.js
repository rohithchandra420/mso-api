const mongoose = require('mongoose');

const txnSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        default: "NIL"        
    },
    status: {
        type: String,
        required: true,
    },
    ticket_id: {
        type: String,
    }
}, {
    timestamps: true
});

const Txn = mongoose.model('Txn', txnSchema);

module.exports = Txn; 