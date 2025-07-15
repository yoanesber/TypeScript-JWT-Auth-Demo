import Router from 'express';

import NoteController from '../controllers/note.controller';
import CatchAsync from '../utils/catch-async.util';
import Validate from '../middlewares/validator.middleware';
import { NoteRequestSchema } from "../dtos/note-request.dto";

const router = Router();

router.post('', Validate(NoteRequestSchema), CatchAsync(NoteController.createNote));
router.get('', CatchAsync(NoteController.getAllNotes));
router.get('/:id', CatchAsync(NoteController.getNoteById));

export default router;
