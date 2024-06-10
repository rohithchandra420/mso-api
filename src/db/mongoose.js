const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {})



// const ticket = new Ticket({
//     name: 'TestName',
//     phone:9110001115,
//     email:'testemail@mso.com',
//     orderid: 'testOrderId',
//     bookingid: 'testBookingId'
// });

// ticket.save().then(() => {
//     console.log(ticket);
// }).catch((error) => {
//     console.log('Error', error)
// })

