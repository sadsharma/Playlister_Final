import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

export default function SplashScreen() {
    const { store } = useContext(GlobalStoreContext);
    function handleGuestAccount()
    {
        store.guestAccount();
    }

    return (
            <div id="splash-screen">
                <div id="playlister">
                PLAYLISTER
                </div>
                <div id="playlister-purpose-statement">
                Join us in playlister to
                organize all of your favorite favorite songs for free!
                </div>
                <div id="splash-screen-buttons">
                    <a href="/register/">
                        <button id="createAccount">
                        Create an Account
                        </button>
                    </a>
                    < a onClick={handleGuestAccount}>
                        <button id="continueAsGuest">
                        Continue as Guest
                        </button>
                    </a>
                    < a href="/login/">
                        <button id="login">
                        Login
                        </button>
                    </a>
                </div>
                <div id='my-name'>by Sadikshya Sharma</div>
            </div>
    )
}