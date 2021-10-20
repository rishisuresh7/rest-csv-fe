import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';

const PopOver = props => {
    return (
        <Dialog {...props}>
            {
                props.children
            }
        </Dialog>
    )
}

export default PopOver;