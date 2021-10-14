import React, { useState, Fragment } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import Notifications from '../notifications/notification.component';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AlertDialog from '../alert-dialog/alert-dialog.component';
import {connect} from 'react-redux';
import { setSnackSuccess } from '../snack-bar/snack-bar.actions';

const Header = (props) => {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const handleCloseDialog = () => {
    setOpen(false);
  }
  const handleCloseNotifications = () => {
    setNotificationsOpen(false);
  }

  const handleMouseOver = (e) => {
    if(e.target.nodeName != "SPAN") {
        e.target.style.background='none';
    }
  }

  const handleLogout = (props) => {
    sessionStorage.clear();
    props.setIsLoggedIn(false);
    setOpen(false);
    props.history.push('/');
    props.setSnackSucess('Logut Successful!')
  }

  return (
    <Fragment>
      <Notifications open={notificationsOpen} onClose={handleCloseNotifications} items={props.notificationItems} disableSecondaryAction/>
      <AlertDialog open={open} onClose={handleCloseDialog} confirmationText="Logout" title="Logout" text="Are you sure you want to logout?" onConfirm={() => handleLogout(props)} />
      <Box sx={{ flexGrow: 1, zIndex: 10 }}>
        <AppBar sx={{ backgroundColor: '#432f18 !important' }} position="static">
          <Toolbar>
            <Typography
              onClick={() => props.history.push('/login')}
              variant="h5"
              noWrap
              color="white"
              component="div"
              sx={{
                display: { sm: 'block' },
                '&:hover': {
                  cursor: "pointer",
              }}}
            >
              Invincible Management System
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              {
                  !props.isLoggedIn ? null :
                  <IconButton
                      size="large"
                      sx={{height: 50, width: 50, color: 'white !important'}}
                      onMouseOver={handleMouseOver}
                      onClick={()=> setNotificationsOpen(true)}
                      aria-label="show new notifications"
                      >
                      <Badge badgeContent={props.notificationItems.length} color="error">
                          <NotificationsIcon />
                      </Badge>
                  </IconButton>
              }
              {
                  !props.isLoggedIn ? null :
                  <IconButton
                      size="large"
                      sx={{height: 50, width: 50, color: 'white !important'}}
                      edge="end"
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      onClick={() => setOpen(true)}
                      onMouseOver={handleMouseOver}
                  >
                      <LogoutIcon/>
                  </IconButton>
              }
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </Fragment>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setSnackSucess: (payload) => dispatch(setSnackSuccess(payload))
});

export default connect(null, mapDispatchToProps)(Header);