const {  gql } = require('apollo-server');


//Schema
const typeDefs = gql`

    type Curso{
        titulo: String     
    }
    type Tecno{
        tecnologia: String
    }
    type Query{
        obtenerCursos: Curso
        obtenerTecno: [Tecno]
    }

    `;

    module.exports = typeDefs;