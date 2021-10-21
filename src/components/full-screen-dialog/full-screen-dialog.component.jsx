import React, { useEffect, useState } from 'react';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PopOver from '../pop-over/pop-over.component';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import EditableTable from '../editable-table/editable-table.component';
import IOSSwitch from '../switch/ios-switch.component';
import NonEditableTable from '../non-editable-table/non-editable-table.component';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Notifications = (props) => {
    const [viewAll, setViewAll] = useState(false);
    const [activeAlerts, setActiveAlerts] = useState([]);
    const handleViewAll = () => {
        setViewAll(!viewAll);
    }

    useEffect(() => {
        if(props.open) {
            setViewAll(false);
        }
    }, [props.open])

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
                    <IOSSwitch label="View All Alerts" checked={viewAll} onClick={handleViewAll}/>
                </Toolbar>
            </AppBar>
            {
                viewAll ?
                    <NonEditableTable
                        activeAlerts={activeAlerts}
                        token={props.token}
                        setSnackSuccess={props.setSnackSuccess}
                        setSnackError={props.setSnackError}
                        setSnackWarning={props.setSnackWarning}
                    /> :
                    <EditableTable
                        setActiveAlerts={setActiveAlerts}
                        token={props.token}
                        setSnackSuccess={props.setSnackSuccess}
                        setSnackError={props.setSnackError}
                        setSnackWarning={props.setSnackWarning}
                    />
            }
        </PopOver>
    )
}

export default Notifications;