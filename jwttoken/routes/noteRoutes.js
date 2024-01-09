const express = require('express');
const { getNote, createNote, updateNote, deleteNote } = require("../controller/noteController");
const app = express();
const auth = require("../middleware/auth");
const noteRouter = express.Router();

noteRouter.get("/",auth , getNote);

noteRouter.post("/",auth , createNote);


noteRouter.put("/:id",auth , updateNote);


noteRouter.delete("/:id",auth , deleteNote);


module.exports = noteRouter;