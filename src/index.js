const express = require('express');
require('./db/mongoose');

const User = require('./models/user');
const Ticket = require('./models/ticket');

const userRouter = require('./routers/user');
const ticketRouter = require('./routers/ticket');
const productRouter = require('./routers/product')
const txnRouter = require('./routers/transaction')

const cors = require('cors');

const app = express();
const port = process.env.PORT

//When Under Maintance
// app.use((req, res, next) => {
//     res.status(503).send("Site Under Maintainence");
//})

//,"https://rohithchandra420.github.io/mso-ui"
const corsOptions ={
    origin:["https://rc-hellboy-rc.in", "https://mso-ng-ui-dev.web.app", "https://rohithchandra420.github.io", "http://localhost:4200"],
    optionSuccessStatus:200
}

app.use(cors(corsOptions))

app.use(express.json());

app.use(userRouter);
app.use(ticketRouter);
app.use(productRouter);
app.use(txnRouter);

app.post('/test', (req, res) =>{    
    res.send("Hello MSO1")
})

app.listen(port, () => {
    console.log("Server is up on port :", port)
})

console.log('Hello')
