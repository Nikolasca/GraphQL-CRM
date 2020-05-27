const { gql } = require('apollo-server');


//Schema
const typeDefs = gql`

    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String

    }
    type Token {
        token:String


    }
    
    input UsuarioInput{
        nombre: String!
        apellido: String!
        email: String
        password: String
    }
    input AuthInput {
        email: String!
        password: String!

    }

        type Query{
            obtenerUsuario(token: String!): Usuario
        }

        type Mutation{
            nuevoUsuario (input: UsuarioInput): Usuario
            authUsuario(input: AuthInput): Token
        }
    `;

    module.exports = typeDefs;