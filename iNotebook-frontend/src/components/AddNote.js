import React,{useContext, useState} from 'react'
import noteContext from '../context/notes/noteContext'

const AddNote = () => {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note, setNote] = useState({title:"",description:"", tag:""});

    const onChange=(e)=>{
        // ... includes the value written after already existing value
        setNote({...note, [e.target.name]: e.target.value});
    }

    const onSubmit = (e)=>{
        e.preventDefault(); // this will disallow reloading after submit button is clicked
        addNote(note.title, note.description, note.tag);
        setNote({title:"",description:"", tag:""});
    }

    return (
        <div>
            <h2>Add a note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' value={note.title} aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={onChange}/>
                </div>
                <button type="submit" disabled={note.title.length<5 || note.description.length<5} className="btn btn-primary" onClick={onSubmit}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote
