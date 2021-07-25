const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down ...')
    console.log(err.name, err.message)
        process.exit(1)
})

dotenv.config({ path: './config.env' })



const app = require('./app');

mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('DB connection sucessful'))

// console.log(app.get('env'))
// console.log(process.env)

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App is serving on ${port} ... !! `)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLER REJECTION! Shutting down ...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})



// console.log(x)