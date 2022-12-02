import React from 'react';
import YouTube from 'react-youtube';
import { useContext } from 'react';
import { GlobalStoreContext } from '../store'

export default function YouTubePlayer() {
    const { store } = useContext(GlobalStoreContext);
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let global_player;
    let playlist = [
        "0",
    ];

    console.log(playlist);

    if(store.currentViewList !== null && store.currentViewList !== undefined && store.currentViewList.songs !== null && store.currentViewList.songs !== undefined)
        for(let i = 0; i < store.currentViewList.songs.length; i++ )
        {
            playlist[i] = store.currentViewList.songs[i].youTubeId;
        }

    console.log(playlist);
    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = 0;

    const playerOptions = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
        console.log("current song" + playlist[currentSong]);
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
    }

    function decSong() {
        currentSong--;
        if(currentSong < 0)
        {
            currentSong = playlist.length;
        }
    }

    function onPlayerReady(event) {
        if(store.player === null || store.player === undefined)
        {
            store.player = event;
        }
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if(store.player === null || store.player === undefined)
        {
            store.player = event;
        }
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
            player.playVideo();
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
        document.getElementById("current-song").innerHTML = currentSong + 1;
        document.getElementById("current-song-artist").innerHTML = store.currentViewList.songs[currentSong].artist;
        document.getElementById("current-song-title").innerHTML = store.currentViewList.songs[currentSong].title;
    }

    function nextSong()
    {
        incSong();
        loadAndPlayCurrentSong(store.player.target);
        
    }

    function lastSong()
    {
        decSong();
        loadAndPlayCurrentSong(store.player.target);
        
    }
    
    if(playlist[0] === "0")
    {
        return (
            <div>
                This playlist has no videos!
            </div>
        )
    }
    return (
        <div id="">
        <YouTube
        videoId={playlist[currentSong]}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange} />
        <div id="current-song">{currentSong + 1}</div>
        <div id="current-song-title"></div>
        <div id="current-song-artist"></div>
        <button id="next-song" onClick={nextSong}>Next</button>
        <button id="last-song" onClick={lastSong}>Previous</button>
        </div>
    )
}