import React, { useState, useEffect, Fragment } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AlertDialog from '../alert-dialog/alert-dialog.component';
import {connect} from 'react-redux';
import { setSnackError, setSnackSuccess, setSnackWarning } from '../snack-bar/snack-bar.actions';
import CreateAlert from '../create-alert/create-alert.component';
import Notifications from '../full-screen-dialog/full-screen-dialog.component';

const Header = (props) => {
  const [open, setOpen] = useState(false);
  const [createAlertOpen, setCreateAlertOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    if(props.isLoggedIn && !notificationsOpen && !props.formOpen && props.token != '') {
      fetch('/api/notifications?type=count', {
        headers: {
          Authorization: props.token,
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          throw new Error('Could not fetch notifications');
        }
      })
      .then(response => {
        setNotificationsCount(response.success);
      })
      .catch(() => {
        props.setSnackWarning('Could not fetch notifications');
      })
    }
  }, [props.isLoggedIn, notificationsOpen, props.formOpen]);

  const handleCloseDialog = () => {
    setOpen(false);
  }
  const handleCloseNotifications = () => {
    setNotificationsOpen(false);
  }

  const handleCloseCreateAlert = () => {
    setCreateAlertOpen(false);
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
    props.setSnackSuccess('Logut Successful!')
  }

  return (
    <Fragment>
      <Notifications
        open={ notificationsCount > 0 && notificationsOpen}
        onClose={handleCloseNotifications}
        token={props.token}
        setSnackSuccess={props.setSnackSuccess}
        setSnackError={props.setSnackError}
      />
      <CreateAlert onClose={handleCloseCreateAlert} open={createAlertOpen} token={props.token} />
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
              INVINCIBLE MANAGEMENT SYSTEM
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              {
                !props.isLoggedIn ? null : 
                <Fragment>
                  <IconButton
                      size="large"
                      sx={{height: 50, width: 50, color: 'white !important'}}
                      edge="end"
                      aria-label="create alert"
                      aria-controls="primary-search-account-menu"
                      onClick={() => setCreateAlertOpen(true)}
                      onMouseOver={handleMouseOver}
                  >
                    <NoteAddIcon/>
                  </IconButton>
                  <IconButton
                      size="large"
                      sx={{height: 50, width: 50, color: 'white !important'}}
                      onMouseOver={handleMouseOver}
                      onClick={()=> {
                        if(!(notificationsCount > 0)) {
                          props.setSnackWarning('No notifications to display!');
                        }
                        setNotificationsOpen(true);
                      }}
                      aria-label="show new notifications"
                      >
                      <Badge badgeContent={notificationsCount} color="error">
                          <NotificationsIcon />
                      </Badge>
                  </IconButton>
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
                </Fragment>
              }
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </Fragment>
  );
}

const mapStateToProps = state => ({
  formOpen: state.selectedTab.formOpen,
})

const mapDispatchToProps = (dispatch) => ({
  setSnackSuccess: (payload) => dispatch(setSnackSuccess(payload)),
  setSnackError: (payload) => dispatch(setSnackError(payload)),
  setSnackWarning: (payload) => dispatch(setSnackWarning(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);