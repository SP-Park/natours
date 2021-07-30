const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./../../models/userModel');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' })



mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('DB connection sucessful'))

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours)
        // await User.create(users, { validateBeforeSave: false })
        // await Review.create(reviews)
        console.log('Data successfully loaded')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

//DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        // await User.deleteMany()
        // await Review.deleteMany()
        console.log('Data successfully deleted')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

if(process.argv[2] === '--import') {
    importData()
} else if(process.argv[2] === '--delete') {
    deleteData()
}
// console.log(process.argv)


// node .\dev-data\data\import-dev-data.js --delete
// node .\dev-data\data\import-dev-data.js --import