import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import maquinaRuta from './ruta/r.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Permite solicitudes CORS
app.use(bodyParser.json()); // Parsea el cuerpo de las solicitudes en formato JSON

// Usar las rutas definidas en maquinaRuta
app.use('/api', maquinaRuta);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log(`Servidor corriendo en http://localhost:${port}`);
});




// import express from 'express';
// import cors from 'cors';


// const app = express();
// const port = 9000;


// app.use(cors({
//     origin: '*', // Permite cualquier origen
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
//     allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
// }));


// app.use(express.json());