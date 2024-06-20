const mongoose = require('mongoose')
const validator = require('validator')

const ticketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        validate(value){
            if(value < 999999999) {
                throw new Error('Phone number Invalid')
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Cost cant be less than 0');
            }
        }
    },
    shopCart: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: "New"
    },
    qrcode: {
        type: Buffer
    }
}, {
    timestamps: true
})

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;