import { useHistory } from 'react-router-dom'
//import Page from 'material-ui-shell/lib/containers/Page/Page'
import React, { useState, useContext } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
//import Button from '@material-ui/Button'
import Paper from '@material-ui/core/Paper'
//import MenuContext from 'material-ui-shell/lib/providers/Menu/Context'
import { Link } from 'react-router-dom'

// save keys to local storage
const localStorageAuthKey = 'twtr:auth';
function saveAuthorisation(keys) {
  if (typeof Storage !== 'undefined') {
      try {
          localStorage.setItem(localStorageAuthKey, JSON.stringify(keys));

      } catch (ex) {
          console.log(ex);
      }
  } else {
      // No web storage Support :-(
  }
}
function getAuthorisation() {
  if (typeof Storage !== 'undefined') {
      try {
        var keys = JSON.parse(localStorage.getItem(localStorageAuthKey));
        return keys;

      } catch (ex) {
          console.log(ex);
      }
  } else {
      // No web storage Support :-(
  }
}
function logout() {
  if (typeof Storage !== 'undefined') {
    try {
        localStorage.removeItem(localStorageAuthKey);
    } catch (ex) {
        console.log(ex);
    }
  } else {
      // No web storage Support :-(
  }
}


const useStyles = makeStyles((theme) => ({
  paper: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(620 + theme.spacing(6))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    width: 192,
    height: 192,
    color: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: `100%`,
  },
  buttonPadding: {    
    //padding: '30px',  
    marginBottom: '30px', 
  },
}))


const SignIn = () => {
  const classes = useStyles()
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // we submit username and password, we receive
  // access and refresh tokens in return. These
  // tokens encode the userid
  function handleSubmit(event) {
    event.preventDefault()

    //console.log(username);
    //console.log(password);
    const paramdict = {
      'name': username,
      'password': password
    }
    const config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(paramdict)
    }
    console.log("sending out:");
    console.log(paramdict);

    console.log("Signin.js: fetching from " + `${process.env.REACT_APP_API_SERVICE_URL}/login`)
    // verify user/pwd, get encoded userid as access and refresh tokens in return
    //fetch("http://localhost:5000/login", config)
    //fetch(`${process.env.REACT_APP_BE_NETWORK}:${process.env.REACT_APP_BE_PORT}/login`, config)
    fetch(`login`, config)
      .then(response => response.json())
      .then(data => {

        // save to local storage
        console.log("received these keys in return:")
        console.log(data);
        console.log(data[0].access_token);
        console.log(data[0].refresh_token);
        console.log('---');
        saveAuthorisation({
          access: data[0].access_token,
          refresh: data[0].refresh_token,
        });

        // back to landing page!
        history.push("/");
      })
      .catch( (err) => {
        alert(err);
        console.log(err);
      });
  }

  // we submit our tokens and receive
  // a refreshed a renewed access
  // token unless the refresh token
  // has expired
  function handleFastSignIn() {

    const paramdict = getAuthorisation();
    const config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(paramdict)
    }

    console.log("Signin.js: fetching from " + `${process.env.REACT_APP_API_SERVICE_URL}/fastlogin`)
    // verify user/pwd, get encoded userid as access and refresh tokens in return
    //fetch("http://localhost:5000/fastlogin", config)
    //fetch(`${process.env.REACT_APP_BE_NETWORK}:${process.env.REACT_APP_BE_PORT}/fastlogin`, config)
    fetch(`fastlogin`, config)
      .then(response => response.json())
      .then(data => {

        // save to local storage
        console.log("received these keys in return:")
        console.log(data);
        saveAuthorisation({
          access: data[0][0],
          refresh: data[0][1],
        });

        // back to landing page!
        history.push("/");
      })
      .catch( (err) => {
        alert(err);
        console.log(err);
      });
  }

  // Logout attempt
  const handleSignOut = () => { 
    logout();

    // back to landing page!
    history.push("/");
  }


  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5" className={classes.padding}>
            {'Sign Out'}
          </Typography> 
          <Typography gutterBottom>If you are not the only one on this device.</Typography>
          <Button fullWidth variant="contained" margin="normal" color="secondary" onClick={handleSignOut} className={classes.buttonPadding}>
            {'Sign Out'}
          </Button>

          <Typography component="h1" variant="h5" className={classes.padding}>
            {'Fast Sign In'}
          </Typography>
          <Typography gutterBottom>If this is your device.</Typography>
          <Button fullWidth variant="contained" margin="normal" color="primary" onClick={handleFastSignIn} className={classes.buttonPadding}>
            {'Sign In'}
          </Button>

          <Typography component="h1" variant="h5">
            {'Password Sign In'}
          </Typography>
          <Typography gutterBottom>You may password-sign-in on any device.</Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              value={username}
              onInput={(e) => setUsername(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label={'Username'}
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={'Password'}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {'Sign in'}
            </Button>
          </form>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Link to="/password_reset">Forgot Password?</Link>
            <Link to="/signup">Register</Link>
          </div>
        </div>
      </Paper>
    </React.Fragment>
  )
}

export default SignIn
