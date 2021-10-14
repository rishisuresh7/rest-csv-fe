import React, {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { setSnackClose } from './snack-bar.actions';

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
  const {open, message, severity} = props.snackState;

  return (
    <div className={classes.root}>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} autoHideDuration={5000} open={open}>
        <MuiAlert elevation={6} variant="filled" onClose={props.onClose} severity={severity} >
            {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

const mapStateToProps = (state) => ({
  snackState: {...state.snackbar},
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(setSnackClose()),
});

export default  connect(mapStateToProps, mapDispatchToProps)(CustomSnackbar);