import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
export default function YoutubePlayer() {

    return (
        <div>HI big youtube thingy go here
            <script src='./client/src/common/YouTubePlaylister.js'> </script>
            <button id="next-button">Next!</button>
            <button id="previous-button">Previous!</button>
            <button id="pause-button">Pause!</button>
            <button id="play-button">Play!</button>
        </div>
    )
}