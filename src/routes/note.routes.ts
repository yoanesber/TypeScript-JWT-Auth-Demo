import Router from 'express';

import CatchAsync from '../utils/catch-async.util';
import NoteController from '../controllers/note.controller';
import Validate from '../middlewares/validator.middleware';
import { NoteRequestSchema } from "../dtos/note-request.dto";


/**
 * Note routes for managing notes.
 * This module defines the routes for creating, retrieving, and managing notes.
 * It uses middleware for validation and error handling.
 */
const router = Router();

router.post('', Validate(NoteRequestSchema), CatchAsync(NoteController.createNote));
router.get('', CatchAsync(NoteController.getAllNotes));
router.get('/:id', CatchAsync(NoteController.getNoteById));

export default router;
