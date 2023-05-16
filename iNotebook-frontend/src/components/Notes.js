import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';


const Notes = () => {
    const navigate = useNavigate();
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        if(localStorage.getItem('authToken')){
            getNotes()
        }else{
            navigate('/login');
        }
    },);
    const ref = useRef(null);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "General" });

    const onEditClick = (curretNote) => {
        ref.current.click();
        setNote({
            id: curretNote._id,
            etitle: curretNote.title,
            edescription: curretNote.description,
            etag: curretNote.tag
        })
    }

    const onChange = (e) => {
        // ... includes the value written after already existing value
        setNote({ ...note, [e.target.name]: e.target.value });
    }


    const onUpdateClick = (e) => {
        e.preventDefault(); // this will disallow reloading after submit button is clicked
        editNote(note.id, note.etitle, note.edescription, note.etag);
    }

    return (
        <>
            <AddNote />

            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" onChange={onChange} value={note.etitle} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name='edescription' onChange={onChange} value={note.edescription} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name='etag' placeholder='General' onChange={onChange} value={note.etag} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" disabled={note.etitle.length < 5 || note.edescription.length < 5} className="btn btn-primary" data-bs-dismiss="modal" onClick={onUpdateClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row my-2'>
                <h2>My Notes</h2>
                {notes.length === 0 && <div className='conatiner'>No notes to display</div>}
                {notes.map((note) => {
                    return <div className="col-md-3 my-2" key={note._id}>
                        <NoteItem note={note} onEditClick={onEditClick} />
                    </div>
                })}
            </div>
        </>
    )
}

export default Notes;
