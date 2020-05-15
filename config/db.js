const mongoose = require('mongoose');
require('dotenv').config({path: 'var.env'});

const conectarDB = async () => {

    try {
        await mongoose.connect(process.env.DB_MONGO, {



        });
        console.log('nice');

    } catch (error){
        console.log(error);
        console.log('asdasjkldsajd');
        process.exit(1);
    }


}

module.exports = conectarDB;