import { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = [];

    const [notes, setNotes] = useState(notesInitial);

    // Get all notes
    const getNotes = async () => {
        // API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'auth-token': localStorage.getItem("authToken")
            },
        });
        const json = await response.json();
        setNotes(json);
    }

    // Add a note
    const addNote = async (title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = await response.json();
        console.log(json);
        getNotes();

        // manually updating the notes array
        // const note = {
        //     "_id": json._id,
        //     "user": json.user,
        //     "title": title,
        //     "description": description,
        //     "tag": tag,
        //     "date": json.date,
        //     "__v": 0
        // };
        // setNotes(notes.concat(note));
    }

    // Delete a note
    const deleteNote = async (id) => {
        // API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        const json = await response.json();
        console.log(json);
        getNotes();  //to refresh the notes array

        // this will also refresh the notes array
        // const newNotes = notes.filter((note) => { return note._id !== id });
        // setNotes(newNotes);
    }

    // Edit a note
    const editNote = async (id, title, description, tag) => {
        // Api call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = await response.json();
        console.log(json);
        getNotes();


        // logic for client side
        // for (let index = 0; index < notes.length; index++) {
        //     const element = notes[index];
        //     if (element._id === id) {
        //         element.title = title;
        //         element.description = description;
        //         element.tag = tag;
        //     }
        // }
    }


    return (
        <noteContext.Provider value={{ notes, addNote, deleteNote, getNotes, editNote }}>
            {props.children}
        </noteContext.Provider>
    );
}

export default NoteState;
