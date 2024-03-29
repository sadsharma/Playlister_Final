import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_CURRENT_VIEW_LIST: "SET_CURRENT_VIEW_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    CANNOT_LOGIN: "CANNOT_LOGIN",
    PLAYLIST_SEARCH: "PLAYLIST_SEARCH",
    USER_SEARCH: "USER_SEARCH",
    SORT_BY: "SORT_BY",
    GUEST_ACCOUNT: "GUEST_ACCOUNT"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    CANNOT_LOGIN: "CANNOT_LOGIN"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentViewList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        player: null,
        currentListLike: null,
        currentView: "HOME-SCREEN",
        currentSearchQuery: "",
        sortBy: "",
        guestAccountCheck: false,
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(store)
        console.log(type)
        console.log(payload)
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : store.guestAccountCheck,

                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : store.guestAccountCheck,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : store.guestAccountCheck,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.array,
                    currentList: payload.currentList,
                    currentViewList: payload.listToView,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: "HOME-SCREEN",
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : store.guestAccountCheck,
                });
            }
            case GlobalStoreActionType.GUEST_ACCOUNT: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: [],
                    currentList: [],
                    currentViewList: [],
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: "HOME-SCREEN",
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : true,
                });
            }

            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : store.guestAccountCheck,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    guestAccountCheck : store.guestAccountCheck,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_VIEW_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    currentViewList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : store.guestAccountCheck,
                });
            }
            case GlobalStoreActionType.SORT_BY: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.array,
                    currentList: store.currentList,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: payload.name,
                    guestAccountCheck : store.guestAccountCheck,
                });
            }

            case GlobalStoreActionType.PLAYLIST_SEARCH: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.array,
                    currentList: null,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: "SEARCH-BY-PLAYLIST-SCREEN",
                    currentSearchQuery: payload.text,
                    sortBy: store.sortBy,
                    guestAccountCheck : store.guestAccountCheck,
                });
            }

            case GlobalStoreActionType.USER_SEARCH: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.array,
                    currentList: null,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: "SEARCH-BY-USER-SCREEN",
                    currentSearchQuery: payload.text,
                    sortBy: store.sortBy,
                    guestAccountCheck : store.guestAccountCheck,
                });
            }

            case GlobalStoreActionType.SET_CURRENT_EDIT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentListLike: payload,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : false,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_LIKE_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentListToLike: payload,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : false,
                });
            }

            case GlobalStoreActionType.PUBLISH_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentViewList: store.currentViewList,
                    currentSong: null,
                    newListCounter: payload,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : false,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : false,
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentViewList: store.currentViewList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : false,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentViewList: store.currentViewList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    currentSearchQuery: store.currentSearchQuery,
                    sortBy: store.sortBy,
                    guestAccountCheck : false,
                });
            }
            case GlobalStoreActionType.CANNOT_LOGIN: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    guestAccountCheck : false,
                });
            }
            case GlobalStoreActionType.CANNOT_LOGIN: {
                return setStore({
                    currentModal : CurrentModal.CANNOT_LOGIN,
                    idNamePairs: null,
                    currentList: null,
                    currentViewList: null,
                    currentSongIndex: null,
                    currentSong: null,
                    newListCounter: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    guestAccountCheck : false,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentViewList: store.currentViewList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    currentView: store.currentView,
                    guestAccountCheck : false,
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {

        let counter = 1;
        let newListName = newName;
        let array = store.idNamePairs.filter(function(e1) { return e1.name.toLowerCase() === newListName.toLowerCase();});
        console.log(array.length);
        if(array.length > 0)
        {
            let uniqueName = false;
            while (uniqueName !== true)
            {
                let name = newName + " " + counter;
                let array = store.idNamePairs.filter(function(e1) { console.log(e1.name.toLowerCase() +" "+ name.toLowerCase()); return e1.name.toLowerCase() === name.toLowerCase();});
                if(array.length === 0)
                {
                    uniqueName = true;
                    newListName = name;
                }
                counter++;
            }       
        }
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newListName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                pairsArray = store.sortingFunction(pairsArray);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        console.log("current list closed");
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        store.currentList = null;
        store.loadIdNamePairs();
    }

    store.closeCurrentListPublish = function () {
        console.log("current list closed");
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let counter = 0;
        let newListName = "Untitled" + 0;
        let uniqueName = false;
        while (uniqueName !== true)
        {
            let name = "Untitled" + counter;
            let array = store.idNamePairs.filter(function(e1) { return e1.name.toLowerCase() === name.toLowerCase();});
            if(array.length === 0)
            {
                uniqueName = true;
                newListName = name;
            }
            counter++;
        }
        const response = await api.createPlaylist(newListName, [], auth.user.userName, [], [], [], 0, false, (new Date()), "hi");
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
        store.loadIdNamePairs();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                let current = null;
                let currentList = null;
                if(store.currentViewList !== undefined || store.currentViewList !== null)
                {
                    current = store.currentViewList;
                }
                if(store.currentList !== undefined || store.currentList !== null)
                {
                    currentList = store.currentList;
                }
                pairsArray = store.sortingFunction(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {array: pairsArray, listToView : current, currentList: currentList}
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }

        if(!store.guestAccountCheck && store.currentView === "HOME-SCREEN")
        {
            asyncLoadIdNamePairs();
        }
        else if(store.currentView === "SEARCH-BY-USER-SCREEN")
        {
            store.retrieveAllPlaylistsByUser(store.currentSearchQuery);
        }
        else
        {
            store.retrieveAllPlaylists(store.currentSearchQuery);
        }

        
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
        store.loadIdNamePairs();
    }

    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }

    store.showCannotLoginModal = () => {
        storeReducer({
            type: GlobalStoreActionType.CANNOT_LOGIN,
            payload: null
        });  
        console.log(store.currentModal);     
    }
    
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    store.isCannotLoginOpen = () => {
        return store.currentModal === CurrentModal.CANNOT_LOGIN;
    }

    store.loginError = () => {
        console.log("hey loginerrore ;");
        storeReducer({
            type: GlobalStoreActionType.CANNOT_LOGIN,
            payload: store.currentList
        });
        console.log(store.currentModal);
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        tps.clearAllTransactions();
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.setCurrentViewList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(playlist.published === true)
                {
                    playlist.listens = playlist.listens + 1;
                }
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_VIEW_LIST,
                        payload: {playlist: playlist, idNamePairs: store.idNamePairs}
                    });
                }
            }

        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }

    store.updateCurrentViewList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentViewList._id, store.currentViewList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_VIEW_LIST,
                    payload: {idNamePairs: store.idNamePairs, playlist: store.currentViewList}
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.updatePlaylist = function() {
        console.log(store.currentListToLike);
        async function asyncUpdateCurrentList() {
            console.log(store.currentListToLike);
            const response = await api.updatePlaylistById(store.currentListToLike._id, store.currentListToLike);
        }
        asyncUpdateCurrentList();
    }

    

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.publishList = function() {
        console.log("got to publish list");
        store.currentList.published = true;
        store.currentList.publishedDate = new Date();
        store.currentList.publishedBy = auth.user.email;
        store.updateCurrentList();
    }

    store.submitComment = function(newComment, user) {
        if(!store.guestAccountCheck)
        {
            if(newComment.trim().length !== 0)
            {
            let comment = {
                text: newComment,
                userName: user,
            }
            store.currentViewList.comments.push(comment);
            store.updateCurrentViewList();
            document.getElementById("input-comment-section").value = "";
            }
        }
    }

    store.duplicatePlaylist = async function() {
        let counter = 1;
        let newListName = "copy of " + store.currentList.name;
        let array = store.idNamePairs.filter(function(e1) { return e1.name.toLowerCase() === newListName.toLowerCase();});
        console.log(array.length);
        if(array.length > 0)
        {
            let uniqueName = false;
            while (uniqueName !== true)
            {
                let name = newListName + " " + counter;
                let array = store.idNamePairs.filter(function(e1) { return e1.name.toLowerCase() === name.toLowerCase();});
                if(array.length === 0)
                {
                    uniqueName = true;
                    newListName = name;
                }
                counter++;
            }       
        }
        const response = await api.createPlaylist(newListName, store.currentList.songs, auth.user.userName, [], [], [], 0, false, (new Date()), "hi");
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
        store.loadIdNamePairs();
    }

    store.handleLikingPlaylist = function(id) {
        console.log("handle liking");
        async function asyncLikePlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(!playlist.likes.includes(auth.user.email))
                {
                    if(playlist.dislikes.includes(auth.user.email))
                    {
                        let index = playlist.dislikes.indexOf(auth.user.email);
                        playlist.dislikes.splice(index, 1);
                    }
                    playlist.likes.push(auth.user.email);
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_EDIT_LIST,
                            payload: playlist
                        });
                    }
                    store.loadIdNamePairs();
                }
            }
        }
        asyncLikePlaylist(id);
        
    }

    store.handleDislikingPlaylist = function(id) {
        console.log("handle disliking");
        async function asyncDislikePlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(!playlist.dislikes.includes(auth.user.email))
                {
                    if(playlist.likes.includes(auth.user.email))
                    {
                        let index = playlist.likes.indexOf(auth.user.email);
                        playlist.likes.splice(index, 1);
                    }
                    playlist.dislikes.push(auth.user.email);
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_EDIT_LIST,
                            payload: playlist
                        });
                    }
                    store.loadIdNamePairs();
                }
            }
        }
        asyncDislikePlaylist(id);
        
    }

    store.handleHomeButtonClick = function() {
        store.currentView = "HOME-SCREEN";
        store.loadIdNamePairs();
    };

    store.handleSearchByPlaylistButtonClick = function() {
        console.log("hihi");
        storeReducer({
            type: GlobalStoreActionType.PLAYLIST_SEARCH,
            payload: {array: [], text: ""}
        });
        console.log(store.currentView)
    };

    store.handleSearchByUserButtonClick = function() {
        console.log("here?");
        storeReducer({
            type: GlobalStoreActionType.USER_SEARCH,
            payload: {array: [], text: ""}
        });
    };

    store.retrieveAllPlaylists = function(text) {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylists();
            if (response.data.success) {
                let pairsArray = response.data.data;
                pairsArray = pairsArray.filter(function(e1) { return e1.published;});
                if(text !== undefined && text !== "")
                {
                  pairsArray = pairsArray.filter(function(e1) { return e1.name.toLowerCase().includes(text.toLowerCase());});
                }
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.PLAYLIST_SEARCH,
                    payload: { array: pairsArray, text: text}
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs(text);
    };

    store.retrieveAllPlaylistsByUser = function(text) {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylists();
            if (response.data.success) {
                let pairsArray = response.data.data;
                pairsArray = pairsArray.filter(function(e1) { return e1.published;});
                if(text !== undefined && text !== "")
                {
                    pairsArray = pairsArray.filter(function(e1) { return e1.ownerEmail.toLowerCase().includes(text.toLowerCase());});
                }
                
                storeReducer({
                    type: GlobalStoreActionType.USER_SEARCH,
                    payload: { array: pairsArray, text: text}
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs(text);
    };

    store.filterSongsHomeScreen = function(text) {
        store.idNamePairs = store.idNamePairs.filter(function(e) {return e.name.toLowerCase().includes(text.toLowerCase());});
        let current = null;
                let currentList = null;
                if(store.currentViewList !== undefined || store.currentViewList !== null)
                {
                    current = store.currentViewList;
                }
                if(store.currentList !== undefined || store.currentList !== null)
                {
                    currentList = store.currentList;
                }
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {array: store.idNamePairs, listToView : current, currentList: currentList}
                });
            
    }

    store.sortByName = function()
    {
        store.sortBy = "PLAYLIST-NAME";
        let pairs = store.sortingFunction(store.idNamePairs)
        storeReducer({
            type: GlobalStoreActionType.SORT_BY,
            payload: { array: pairs, name: store.sortBy}
        });

    }

    store.sortByListens = function()
    {
        store.sortBy = "LISTENS";
        let pairs = store.sortingFunction(store.idNamePairs)
        storeReducer({
            type: GlobalStoreActionType.SORT_BY,
            payload: { array: pairs, name: store.sortBy}
        });

    }

    store.sortByPublishedDate = function()
    {
        store.sortBy = "PUBLISHED-DATE";
        let pairs = store.sortingFunction(store.idNamePairs)
        storeReducer({
            type: GlobalStoreActionType.SORT_BY,
            payload: { array: pairs, name: store.sortBy}
        });

    }
    store.sortByLikes = function()
    {
        store.sortBy = "LIKES";
        let pairs = store.sortingFunction(store.idNamePairs)
        storeReducer({
            type: GlobalStoreActionType.SORT_BY,
            payload: { array: pairs, name: store.sortBy}
        });

    }

    store.sortByDislikes = function()
    {
        store.sortBy = "DISLIKES";
        let pairs = store.sortingFunction(store.idNamePairs)
        storeReducer({
            type: GlobalStoreActionType.SORT_BY,
            payload: { array: pairs, name: store.sortBy}
        });

    }

    store.sortByCreatedDate = function()
    {
        store.sortBy = "CREATED-DATE";
        let pairs = store.sortingFunction(store.idNamePairs)
        storeReducer({
            type: GlobalStoreActionType.SORT_BY,
            payload: { array: pairs, name: store.sortBy}
        });

    }
    store.sortByEditDate = function()
    {
        store.sortBy = "EDIT-DATE";
        let pairs = store.sortingFunction(store.idNamePairs)
        storeReducer({
            type: GlobalStoreActionType.SORT_BY,
            payload: { array: pairs, name: store.sortBy}
        });

    }

    store.sortingFunction = function(array)
    {
        if(store.sortBy === "")
        {
            return array;
        }
        if(store.sortBy === "PLAYLIST-NAME")
        {
            array.sort(function(a, b) {
                const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
              
                // names must be equal
                return 0;
              });
            return array;
        }
        if(store.sortBy === "LISTENS")
        {
            array.sort((s1, s2) => {
                return s2.listens - s1.listens;
            });
            return array;
        }
        if(store.sortBy === "PUBLISHED-DATE")
        {
            array.sort((x, y) => {
               return x.publishedDate - y.publishedDate;
           });
            return array;
        }
        if(store.sortBy === "LIKES")
        {
            array.sort((s1, s2) => {
                return s2.likes.length - s1.likes.length;
            });
            return array;
        }
        if(store.sortBy === "DISLIKES")
        {
            array.sort((s1, s2) => {
                return s2.dislikes.length - s1.dislikes.length;
            });
            return array;
        }
        if(store.sortBy === "CREATED-DATE")
        {
            array.sort((x, y) => {
                return y.createdAt - x.createdAt;
            });
            return array;
        }
        if(store.sortBy === "EDIT-DATE")
        {
            array.sort((x, y) => {
                console.log(y.updateAt + " " + x.updateAt);
                console.log(y.publishedDate + " " + x.publishedDate);
                return y.updatedAt - x.updatedAt;
            });
            return array;
        }
        return array;

    }
    store.guestAccount = function(){
        storeReducer({
            type: GlobalStoreActionType.GUEST_ACCOUNT,
            payload:[]
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };