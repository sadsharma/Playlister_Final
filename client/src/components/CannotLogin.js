import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthContext from '../auth'
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 250,
    height: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p:4,
};

export default function CannotLoginModal() {
    const { auth } = useContext(AuthContext);
    console.log("auth currentmodal: " + auth.currentModal);

    let errorMessage = auth.errorMessage();
    console.log(errorMessage);

    function handleClose() {
        auth.closeModals();
    }
    
    return (
        <Modal
            open={auth.currentModal === "CANNOT_LOGIN"}
        >
            <Box sx={style}>
           <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            {errorMessage}<strong> Please try again!</strong>
            </Alert>
            <input type="button" 
                    id="close-error-modal" 
                    className="modal-button" 
                    onClick={handleClose} 
                    value='OK' />
            </Box>
        </Modal>
    );
}