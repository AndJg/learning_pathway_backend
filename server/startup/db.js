const mongoose = require('mongoose');

module.exports = async () => {
    const con = await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    console.log(`MongoDB connected: ${con.connection.host}`);
};
