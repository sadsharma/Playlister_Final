import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AuthContext from '../auth'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    let text ="";
    if (auth.loggedIn && !auth.onlyRegistered && store.currentView==="HOME-SCREEN")
    {
        return (
            <div id="playlister-statusbar">
                <div id="list-selector-heading">
            <Fab 
                color="black" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography id="add-list" variant="h2">Your Lists</Typography>
            </div>
            </div>
        );
    }
    else if(store.currentView==="SEARCH-BY-USER-SCREEN"){
        return (
            <div id="playlister-statusbar">
                <div id="list-selector-heading">
                <Typography id="search-query" variant="h2">{store.currentSearchQuery} user</Typography>
                </div>
            </div>
        );
    }
    else if(store.currentView ==="SEARCH-BY-PLAYLIST-SCREEN" ){
        return (
            <div id="playlister-statusbar">
                <div id="list-selector-heading">
                <Typography id="search-query" variant="h2">{store.currentSearchQuery} lists</Typography>
                </div>
            </div>
        );
    }
    else
    {
        return null
    }
}

export default Statusbar;