const mongoose = require('mongoose');
require('dotenv').config({path: 'var.env'});

const conectarDB = async () => {

    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex:true


        });
        console.log('BASE DE DATOS ON');

    } catch (error){
        console.log(error);
        console.log('Error al conectar con db');
        process.exit(1);
    }


}

module.exports = conectarDB;