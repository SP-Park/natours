const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
dotenv.config({ path: './config.env' })



mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('DB connection sucessful'))

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours)
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