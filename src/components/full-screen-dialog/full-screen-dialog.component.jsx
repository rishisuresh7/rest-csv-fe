import React from 'react';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PopOver from '../pop-over/pop-over.component';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import EditableTable from '../editable-table/editable-table.component';
import SaveIcon from '@mui/icons-material/Save';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Notifications = (props) => {
    return (
        <PopOver fullScreen open={props.open}  TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative', backgroundColor: '#432f18 !important' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={props.onClose}
                        aria-label="close"
                        >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Alerts and Notifications
                    </Typography>
                    {/* <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleSave}
                        aria-label="save"
                        >
                        <SaveIcon />
                    </IconButton> */}
                </Toolbar>
            </AppBar>
            <EditableTable token={props.token} setSnackSuccess={props.setSnackSuccess} setSnackError={props.setSnackError} />
        </PopOver>
    )
}

export default Notifications;