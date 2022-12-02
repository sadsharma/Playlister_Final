import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store/index.js'
import AuthContext from '../auth'
import {useState } from 'react'
import List from '@mui/material/List';
import SongCard from './SongCard.js';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
export default function CommentSection() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [text, setText] = useState("");
    

    function submitComment()
    {
        let newComment = document.getElementById("input-comment-section").value;
        console.log(newComment);
        console.log(auth.user.email);
        store.submitComment(newComment, auth.user.email);
    }

    if(store.currentViewList === null)
    {
        return null;
    }

    return (
        <div id="comment-section">
            <div id="comment-display">
            <List 
                sx={{ width: '90%', bgcolor: 'transparent'}}
            >
                {
                    store.currentViewList.comments.map((comments) => (
                        <div id="comment-card">
                        <div id="comment-card-username">{comments.userName}</div><div id="comment-card-text">{comments.text}</div>
                        </div>
                    ))  
                }
                </List>
            </div>
            <input id="input-comment-section"></input>
            <button id="submit-comment-section" onClick={submitComment}>Submit</button>
        </div>
    )
}