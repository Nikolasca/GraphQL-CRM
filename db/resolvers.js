const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
require('dotenv').config({path: 'var.env'});
const jwt = require('jsonwebtoken');


const crearToken = (usuario,secreta, expiresIn) => {
    console.log(usuario);
    const {id,email, nombre, apellido } = usuario;
    return jwt.sign({id},secreta,{expiresIn})
}

//Resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_,{token}) => {
                const usuarioId = await jwt.verify(token, process.env.SECRETA);
                return usuarioId

        }
    },
    Mutation: {
        nuevoUsuario: async (_, { input }) => {
            const { email, password } = input;

            //Revisa si el usuario ya está
            const existeUsuario = await Usuario.findOne({ email })
            if (existeUsuario) {
                throw new Error("Correo existente");
            }
            //Hashear pass
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password,salt);

            //Guardar en DB
            try {
                const user = new Usuario(input);
                await user.save();
                return user;
                console.log('se guardó');
            } catch (error) {
                console.log(error);

            }   
        },
        authUsuario: async (_,{input}) =>{
            const {email, password} = input

            const existe = await Usuario.findOne({email});
            if(!existe){

                throw new Error('El usuario no existe');

            }
            // coomparar pass
            const passwordCorrecto = await bcryptjs.compare(password, existe.password)
            if (!passwordCorrecto){
                    throw new Error ('Pass incorrecto');

            } 

            // Crear token
            return {
                token: crearToken(existe, process.env.SECRETA, '24h')
            }
        }

    }
}
module.exports = resolvers;