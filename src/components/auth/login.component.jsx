import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '90vw',
    padding: '0 3vw'
  },
  margin: {
    margin: theme.spacing(1),
  }
}));

const  LoginForm = (props) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    username: '',
    password: '',
    showPassword: false,
    authErr: '',
  });

  useEffect(() => {
    const data = sessionStorage.getItem('authentication');
    if(data && data !== '') {
    props.history.push('/select');
    }
  }, [])

  const handleChange = (prop) => (event) => {
    setValues({ ...values, authErr: '', [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
      const { username, password } = values;
      fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({username, password})
      }).then(response => {
          if(response.status !== 200) {
            setValues({...values, authErr: 'Incorrect details!'})
          }
          return response.json()
        })
      .then(response => {
          if(response.success) {
            setValues({...values, authErr: ''})
            sessionStorage.setItem('authentication', response.success.authentication)
            props.setToken(response.success.authentication)
            props.setIsLoggedIn(true);
            props.history.push('/select');
        }
      })
  }

  return (
    <div className={classes.root}>
      <div>
      <FormControl fullWidth className={classes.margin} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-amount">{values.authErr === '' ? 'Username': 'Error'}</InputLabel>
          <OutlinedInput
            error={values.authErr === '' ? false : true}
            autoFocus
            value={values.amount}
            onChange={handleChange('username')}
            labelWidth={75}
          />
        </FormControl>
        <FormControl fullWidth className={clsx(classes.margin)} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">{values.authErr === '' ? 'Password': 'Error'}</InputLabel>
          <OutlinedInput
            error={values.authErr === '' ? false : true}
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <p style={{fontSize: '14px'}}>Hide</p> : <p style={{fontSize: '14px'}}>Show</p>}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
        <Button className={classes.margin} onClick={handleSubmit} color="primary" variant="outlined">
            Login
        </Button>
      </div>
    </div>
  );
}

export default LoginForm;