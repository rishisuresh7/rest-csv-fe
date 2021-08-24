import React, {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CustomSnackbar = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} autoHideDuration={5000} {...props}>
        <MuiAlert elevation={6} variant="filled" onClose={props.onClose} severity={props.severity} >
            {props.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default CustomSnackbar;