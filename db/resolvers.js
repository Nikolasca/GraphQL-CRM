const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
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

        },
        obtenerProductos: async()=>{
            try {
                const  productos = await Producto.find({});
                return productos;
            } catch (error) {
                console.log(error);
            }
        },

        obtenerProducto: async(_,{id})=>{
            const producto = await Producto.findById(id);

            if(!producto){
                throw new Error("Producto no existe");

            }
            return producto

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
        },

        nuevoProducto: async (_,{input}) =>{

            try {
                const producto = new Producto(input);
                // almacenar BD
                const resultado = await producto.save();

                return resultado
            } catch (error) {
                console.log(error);
            }


        },
        actualizarProducto: async(_,{id,input}) =>{
            let producto = await Producto.findById(id);

            if(!producto){
                throw new Error("Producto no existe");

            }
            producto= await Producto.findOneAndUpdate({_id: id},input), {new:true};

            return producto

        },
        eliminarProducto: async (_,{id})=>{
            const producto = await Producto.findById(id);

            if(!producto){
                throw new Error("Producto no existe");

            }

         await   Producto.findByIdAndRemove({_id:id});

         return "Producto Eliminado"

        },

        nuevoCliente: async (_,{input},ctx)=>{
            console.log(ctx);
            //verificar si existe
            const {email} = input
            const cliente = await Cliente.findOne({email});

            if(cliente){
            throw new Error('Cliente existente');
            }
            

            //guardar db
            const nuevoCliente = new Cliente(input);
            nuevoCliente.vendedor = ctx.usuario.id;
            try {
               
            const resultado  = await nuevoCliente.save();
            console.log(resultado);
            return resultado;
    
            } catch (error) {
                console.log(error);                
            }
            
        }

    }
}
module.exports = resolvers;