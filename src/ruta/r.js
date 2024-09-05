import { Router } from 'express';
import { controlarMaquina, estadoMaquina, ultimaSolicitud } from '../controlador/c.js';

const router = Router();

// Rutas para controlar la máquina y obtener el estado
router.post('/api/control', controlarMaquina);
router.get('/api/estado', estadoMaquina);
router.get('/api/ultimaSolicitud', ultimaSolicitud);

export default router;
