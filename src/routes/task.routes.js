import {Router} from 'express';
import {auth} from '../middleware/auth.js';
import { list, getOne, create, update, remove, bulksync } from '../controllers/task.controller.js';

const router = Router();

router.use(auth);

router.get('/', list); // obtener todas las tareas del usuario
router.get('/:id', getOne); // obtener una tarea del usuario
router.post('/', create); // crear una nueva tarea
router.put('/:id', update); // actualizar una tarea por id
router.delete('/:id', remove); // eliminar una tarea por id
router.post('/bulksync', bulksync);

export default router;
