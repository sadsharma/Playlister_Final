import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    console.log(store.guestAccountCheck)
    
    if (auth.loggedIn || store.guestAccountCheck)
        return <HomeScreen />
    else
        return <SplashScreen />
}