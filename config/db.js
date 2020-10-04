const mongoose = require('mongoose');
const connectDB = () => {
    // Database Connection
    const url = "mongodb://localhost/comment";
    const connection = mongoose.connection;
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
    })
    connection.once('open', () => {
        console.log('Database Connection Established...');
    }).catch(err => {
        console.log('Connection Failed...');
    })
}

module.exports  = connectDB;