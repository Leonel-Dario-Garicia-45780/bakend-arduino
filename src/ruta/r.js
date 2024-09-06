import { Router } from 'express';
import { controlarMaquina, estadoMaquina } from '../controlador/c.js';

const router = Router();

// Rutas para controlar la máquina y obtener el estado
router.post('/control', controlarMaquina);
router.get('/estado', estadoMaquina);


export default router;
