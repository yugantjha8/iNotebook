const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { body, validationResult } = require('express-validator'); //it is used to validate inputs
const Notes = require('../models/Notes');

// Route 1- add note under loggedin user in db-- /api/notes/addnote - Login required
router.post('/addnote', fetchuser, [
    //below are the validation for input from user
    body('title', 'Title length should be 5 to 20 characters').isLength({ min: 5 }),
    body('description', 'Description length should be 5 to 20 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        //if any err comes up while validation then return errs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, tag } = req.body; //destructuring to get data from req body
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.status(200).send(savedNote);
    } catch (err) {
        // if unknown err occurs
        res.status(500).send("Internal server error");
    }
});

// Route 2: Get all the notes of particular user-- /api/notes/fetchallnotes - Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        // console.log(notes)
        res.status(200).send(notes);
    } catch (error) {
        res.status(500).send("Internal server error");
    }

});

// Route 3: Update note-- /api/notes/updatenote - Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body; // destructuring from req body
        const newNote = {} //creating new note obj
        // entering all the new values
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // finding the note which we have to update
        const note = await Notes.findById(req.params.id);

        // comparing the user who is loggedin with the note (user) which he want to update  
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized");
        }
        // finding and updating the note
        const updatedNote = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.status(200).send(updatedNote);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// Route 4: Delete note-- /api/notes/deletenote - Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // finding the note and user detail to compare with the user loggedin
        const note = await Notes.findById(req.params.id);

        if(!note){return res.status(400).send("Note already deleted")};

        // Allowing deletion only if user own this note 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized");
        }
        // finding and deleting the note
        await Notes.findByIdAndDelete(req.params.id);
        res.status(200).send("Deletion successful");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

module.exports = router;