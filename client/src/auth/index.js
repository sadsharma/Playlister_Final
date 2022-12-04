import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'


const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    CANNOT_LOGIN: "CANNOT_LOGIN",
    HIDE_MODALS: "HIDE_MODALS"
}
const CurrentModal = {
    NONE : "NONE",
    CANNOT_LOGIN: "CANNOT_LOGIN",
    HIDE_MODALS: "HIDE_MODALS"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        currentModal : CurrentModal.NONE,
        user: null,
        loggedIn: false, 
        cannotLogIn:false,
        onlyRegistered: false,
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        console.log("type" + type);
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    currentModal : CurrentModal.NONE,
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    cannotLogIn:false,
                    errorMessages: "",
                    onlyRegistered: false,
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    currentModal : CurrentModal.NONE,
                    user: payload.user,
                    loggedIn: true,
                    cannotLogIn:false,
                    errorMessages: "",
                    onlyRegistered: false,
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    currentModal : CurrentModal.NONE,
                    user: null,
                    loggedIn: false,
                    cannotLogIn:false,
                    errorMessages: "",
                    onlyRegistered: false,
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    currentModal : CurrentModal.NONE,
                    user: null,
                    loggedIn: true,
                    cannotLogIn:false,
                    errorMessages: "",
                    onlyRegistered: true,
                })
            }
            case AuthActionType.CANNOT_LOGIN: {
                return setAuth({
                    currentModal : CurrentModal.CANNOT_LOGIN,
                    user: payload.user,
                    loggedIn: false,
                    cannotLogIn:true,
                    errorMessages: payload,
                    onlyRegistered: false,
                })
            }
            case AuthActionType.HIDE_MODALS: {
                return setAuth({
                    currentModal : CurrentModal.NONE,
                })
            }
            default:
                return auth;
        }
    }

    auth.loginError = function() {
        return auth.cannotLogIn;
    }

    auth.errorMessage = function() {
        return auth.errorMessages;
    }

    auth.closeModals = function() {
        authReducer({
            type: AuthActionType.HIDE_MODALS,
            payload: {
            }
        });
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(firstName, lastName, email, username, password, passwordVerify) {
        try{
            const response = await api.registerUser(firstName, lastName, email, username, password, passwordVerify);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/login");
            }
        } catch(error)
        {
            authReducer({
                type: AuthActionType.CANNOT_LOGIN,
                payload: error.response.data.errorMessage
            })
        }
    }

    auth.loginUser = async function(email, password) {
        try{
        const response = await api.loginUser(email, password);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
        }
        }
        catch(error)
        {
            authReducer({
                type: AuthActionType.CANNOT_LOGIN,
                payload: error.response.data.errorMessage
            })
            console.log(auth.errorMessages);
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };