import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import List from '@mui/material/List';
import SongCard from './SongCard.js';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom'
import { blueGrey } from '@mui/material/colors';
import AuthContext from '../auth'


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const { auth } = useContext(AuthContext);

    const theme = createTheme({
        palette: {
          primary: blueGrey,
        },
      });

    function handleLoadList(event, id) {
        event.stopPropagation();
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function setCurrentViewPlaylist(event, id) {
        event.stopPropagation();
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            store.setCurrentViewList(id);
        }
    }

    async function handleCloseList() {
        store.closeCurrentList();
    }

    async function handleLike() {
        store.handleLikingPlaylist(idNamePair._id);
    }
    async function handleDislikingPlaylist() {
        store.handleDislikingPlaylist(idNamePair._id);
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }

    function handleAddSong(event) {
        store.addNewSong();
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function publishList() {
        store.publishList(idNamePair.id);
    }

    function duplicatePlaylist() {
        console.log(idNamePair);
        console.log("current list" + store.currentList);
        store.duplicatePlaylist(idNamePair);
    }

    function handleUndo() {
        
        store.undo();
    }

    function handleRedo() {
        
        store.redo();
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let color = '#A7C7E7';
    let date;
    let likes;
    let dislikes;
    let colorOfLikeIcon;
    let colorOfDislikeIcon;
    if(idNamePair.published === true)
    {
        color = '#6faeee';
        date = idNamePair.publishedDate.substring(0,10);
        likes = idNamePair.likes.length;
        dislikes = idNamePair.dislikes.length;
        if(!store.guestAccountCheck)
        {
            if(idNamePair.likes.includes(auth.user.email))
            {
                colorOfLikeIcon = "#5b7551";
            }
            if(idNamePair.dislikes.includes(auth.user.email))
            {
                colorOfDislikeIcon = "#944547";
            }
        }
    }

    if(store.currentViewList !== null)
    {
        if(idNamePair._id === store.currentViewList._id)
        {
            color = '#ffc39e';
        }
    }

    let publishedCard =
        <ThemeProvider theme={theme}>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1}}
            style={{ width: '100%', height:'14vh', fontSize: '24pt', background:color, borderRadius:'10px'}}
            button
            onClick={(event) => setCurrentViewPlaylist(event, idNamePair._id)}
        >
            <div id="userName">
                <span className="team" title="Home">{idNamePair.name}</span>
                <Box sx={{ p: 1, fontSize: '10pt',}}>By {idNamePair.ownerEmail}</Box>
                <Box sx={{ p: 1, fontSize: '10pt',}}>Published Date: {date}</Box>
            </div>
            <Box sx={{ p: 1, flexGrow: 1 }}/>
                <Box id="like-button" sx={{ p: 1, transform: "scale(.8)", }}>
                    <IconButton onClick={handleLike} aria-label='like' disabled={store.guestAccountCheck}>
                        <ThumbUpIcon style={{color: colorOfLikeIcon, fontSize:'24pt'}} /> {likes}
                    </IconButton>
                </Box>
                <Box id="dislike-button" sx={{ p: 1, transform: "scale(.8)", }}>
                    <IconButton onClick={handleDislikingPlaylist} aria-label='dislike' disabled={store.guestAccountCheck}>
                        <ThumbDownIcon style={{color: colorOfDislikeIcon, fontSize:'24pt'}} /> {dislikes}
                    </IconButton>
                </Box>   
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }} aria-label='open'>
                        <KeyboardArrowDownIcon style={{fontSize:'24pt'}} />
                    </IconButton>
                </Box>
                <Box id="published" sx={{ p: 1, fontSize: '10pt',}}>Listens: {idNamePair.listens}</Box>
        </ListItem>
        </ThemeProvider>


    let unpublishedCard =
        <ThemeProvider theme={theme}>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1}}
            style={{ width: '100%', height:'12vh', fontSize: '24pt', background:color, borderRadius:'10px'}}
            button
            onClick={(event) => setCurrentViewPlaylist(event, idNamePair._id)}
        >
            <div id="userName">
                <span className="team" title="Home">{idNamePair.name}</span>
                <Box sx={{ p: 1, fontSize: '10pt',}}>By {idNamePair.ownerEmail}</Box>
            </div>
            <Box sx={{ p: 1, flexGrow: 1 }}/>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }} aria-label='open'>
                        <KeyboardArrowDownIcon style={{fontSize:'24pt'}} />
                    </IconButton>
                </Box>
        </ListItem>
        </ThemeProvider>

    let cardElement = unpublishedCard;
    if(idNamePair.published === true)
    {
        cardElement = publishedCard;
    }
        
    if(store.currentList !== null && store.currentList._id === idNamePair._id && store.currentList.published === true)
    {
        color = '#6faeee';
        if(store.currentViewList !== null)
        {
            if(idNamePair._id === store.currentViewList._id)
            {
                color = '#ffc39e';
            }
        }
        cardElement = 
        <ThemeProvider theme={theme}>
        <Box style={{background:color, borderRadius:'10px'}}>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1}}
            style={{ width: '100%', height:'5vh', fontSize: '24pt'}}
            button
            onClick={(event) => setCurrentViewPlaylist(event, idNamePair._id)}
        >
            <div id="userName">
                <span className="team" title="Home">{idNamePair.name}</span>
                <Box sx={{ p: 1, fontSize: '10pt',}}>By {idNamePair.ownerEmail}</Box>
            </div>
            <Box sx={{ p: 1, flexGrow: 1 }}/>
            <Box id="like-button" sx={{ p: 1, transform: "scale(.8)", }}>
                <IconButton disabled={store.guestAccountCheck} onClick={handleLike} aria-label='like'>
                    <ThumbUpIcon style={{color: colorOfLikeIcon, fontSize:'24pt'}} /> {likes}
                </IconButton>
            </Box>
            <Box id="dislike-button" sx={{ p: 1, transform: "scale(.8)", }}>
                <IconButton disabled={store.guestAccountCheck} onClick={handleDislikingPlaylist} aria-label='dislike'>
                    <ThumbDownIcon style={{color: colorOfDislikeIcon, fontSize:'24pt'}} /> {dislikes}
                </IconButton>
            </Box>   
        </ListItem>
        <div id="playlist-cards" >
            <List 
                sx={{ width: '90%', bgcolor: 'transparent'}}
            >
                {
                    store.currentList.songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                            published={true}
                        />
                    ))  
                }
            </List>
         </div>
         <ListItem id="list-card-buttons">
            <Box sx={{ p: 1, flexGrow: 1 }}/>
            <Box sx={{ p: 1, transform: "scale(.8)", }}>
                </Box>
            <Box sx={{ p: 1, transform: "scale(.8)", }}>
            <IconButton disabled={store.guestAccountCheck || (auth.user.userName !== idNamePair.ownerEmail)} onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }} aria-label='delete'>
                <DeleteIcon style={{fontSize:'24pt'}}  />
            </IconButton>
            </Box>  
            <Box sx={{ p: 1 }}>
                </Box>
                <Box sx={{ p: 1, color:'black'}}>
                    <Button sx={{ p: 1, color:'black'}} onClick={duplicatePlaylist} disabled={store.guestAccountCheck}>Duplicate</Button>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleCloseList} aria-label='close'>
                        <ExpandLessIcon sx={{ p: 1, color:'black'}} style={{fontSize:'24pt'}} />
                    </IconButton>
                </Box>
        </ListItem>
         <ListItem id="list-card-buttons">
            <Box sx={{ p: 1, fontSize: '10pt',}}>Published Date: {date}</Box>
            <Box sx={{ p: 1, flexGrow: 1 }}/>
            <Box sx={{ p: 1, fontSize: '10pt',}}>Listens: {idNamePair.listens}</Box>
        </ListItem>
        </Box>
        </ThemeProvider>
    }
    else if(store.currentList !== null && store.currentList._id === idNamePair._id && store.currentList.published === false)
    {
        cardElement = 
            <ThemeProvider theme={theme}>
            <Box style={{background:color, borderRadius:'10px'}}>
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ marginTop: '15px', display: 'flex', p: 1}}
                style={{ width: '100%', height:'8vh', fontSize: '24pt'}}
                button
                onClick={(event) => setCurrentViewPlaylist(event, idNamePair._id)}
            >
                <div id="userName">
                    <span className="team" title="Home">{idNamePair.name}</span>
                    <Box sx={{ p: 1, fontSize: '10pt',}}>By {idNamePair.ownerEmail}</Box>
                </div>
                <Box sx={{ p: 1, flexGrow: 1 }}/>
            </ListItem>
            <div id="playlist-cards" >
                <List 
                    sx={{ width: '90%', bgcolor: 'transparent'}}
                >
                    {
                        store.currentList.songs.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + (index)}
                                key={'playlist-song-' + (index)}
                                index={index}
                                song={song}
                            />
                        ))  
                    }
                </List>
                <div id="add-song-button" onClick={handleAddSong} disabled={store.guestAccountCheck}><IconButton aria-label='close'>
                            <AddIcon style={{fontSize:'24pt'}} />
                        </IconButton></div>
            </div>
            <ListItem id="list-card-buttons">
                <Box sx={{ p: 1, flexGrow: 1 }}/>
                <Box sx={{ p: 1, transform: "scale(.8)", }}>
                        <IconButton onClick={handleToggleEdit} aria-label='edit'>
                            <EditIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>
                <Box sx={{ p: 1, transform: "scale(.8)", }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'24pt'}} />
                </IconButton>
                </Box>  
                    <Box sx={{ p: 1 }}>
                        <Button sx={{ p: 1, color:'black'}} onClick={handleUndo} disabled={!store.canUndo()}>Undo</Button>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <Button sx={{ p: 1, color:'black'}} onClick={handleRedo} disabled={!store.canRedo()}>Redo</Button>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <Button sx={{ p: 1, color:'black'}} onClick={publishList}>Publish</Button>
                    </Box>
                    <Box sx={{ p: 1, color:'black'}}>
                        <Button sx={{ p: 1, color:'black'}} onClick={duplicatePlaylist}>Duplicate</Button>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <IconButton onClick={handleCloseList} aria-label='close'>
                            <ExpandLessIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>
            </ListItem>
            </Box>
            </ThemeProvider>
    }

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 24}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;