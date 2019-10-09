import React from 'react';
import { Router, Switch as SwitchRoute, Route } from 'react-router-dom';
//Styles
import './App.css';
//Routing/History/Services
import { history } from './services/';
import { userLogin } from './services/coa-authorization';
import { StateProvider } from './services/State'; //should be able to get from NPM but microServices aren't sharing cookie
//Material-ui layout needs
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
//Components
import { SnackbarProvider } from 'notistack';
import AppSkeleton from './components/AppSkeleton';
//Content Pages
import { NotFoundPage, HomePage } from './pages';

//Layout styles
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { main: '#03a9f4' }, //lightblue from @material-ui/core/colors/
    secondary: { main: '#ff9800' }, //orange
  },
});


function App() {
  // TODO - move out to an appStore.js file?
  // TODO - rewrite `reducer` function in State.js to also update localStorage?
  // TODO - perhaps make a way to update localStorage without saving the data for local timeouts?
  const STORES = {
    CACHED_USER: 'userProfile',
  }
  const initialState = {
    userProfile: JSON.parse(localStorage.getItem(STORES.CACHED_USER)) || {"name":{"fullName":"","firstName":"","lastName":""},"email":"","phone":null,"department":null,"title":null,"employeeNumber":null,"userPrincipalName":"","roles":[]},
  };
  const init = async () => {
    let userProfile = userLogin()
                        .then((user) => {
                          // Get additional permissions
                          // if (user.canPublish === undefined) {
                          //   return fetch('https://api2.auburnalabama.org/pressrelease/canIPublish', { credentials: 'include' })
                          //     .then((response) => { return {...user, canPublish: response.ok}; })
                          //     .catch(() => {return {...user, canPublish: false }; });
                          // }

                          // Return
                          return user;
                        });
    let everyoneFinish = await Promise.all([userProfile]);
    return { userProfile: everyoneFinish[0] };
  }
  
  return (
    <SnackbarProvider>
      <StateProvider initialState={initialState} initFn={init}>
        <MuiThemeProvider theme={theme}>
          <AppSkeleton>
            <Router history={history} basename={'/committees'}>
                <SwitchRoute>
                  <Route exact path={`${process.env.PUBLIC_URL}/`} component={HomePage}></Route>
                  <Route component={NotFoundPage}/>
                </SwitchRoute>
              </Router>
          </AppSkeleton>
        </MuiThemeProvider>
      </StateProvider>
    </SnackbarProvider>
  );
}

export default App;
