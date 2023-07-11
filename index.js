const express= require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');



//crear el servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//directorio pulico
//mideware
app.use(express.static('public'));

//lectura y parseo del body
//cuando llegen peticiones http de un servicio rest, las transforma a json
app.use(express.json());

//rutas
app.use('/api/auth', require('./routes/auth'));

//escuchar peticiones
app.listen(process.env.PORT, ()=>{
	console.log(`servidor conrriendo en el puerto ${process.env.PORT}`)
})