import React, { useEffect, useState } from 'react';
import { useStateStore } from '../../services/State';
import { history } from '../../services/history';
import { userLogout } from '../../services/coa-authorization';
import { Menu, MenuItem, List, ListItem, AppBar, Toolbar, IconButton, Hidden, SwipeableDrawer, Drawer, Typography, withStyles } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';

//Layout styles
const drawerWidth = 240;
const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  grow: {
    flexGrow: 1,
  },
  navIconHideSm: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  navIconHideLg: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    transitionDuration: '0ms !important',
  },
  drawerDocked: {
    height: '100%',
  },
  toolbar: theme.mixins.toolbar,
  list: {
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  contentShift: {
    [theme.breakpoints.up('md')]: {
      marginLeft: -drawerWidth,
    },
  },
});

function AppSkeleton({ classes, children }) {
    const [drawer, setDrawer] = useState(false);
    const [persistDrawer, setPersistDrawer] = useState(true);
    const [currentPath, setCurrentPath] = useState(history.location.pathname);
    const [accountIcon, setAccountIcon] = useState(null);
    const [user] = useStateStore('userProfile');// userAuthStatus("pressrelease");
  
    useEffect(() => {
      history.listen(() => {
        setDrawer(false);
        setCurrentPath(history.location.pathname);
      });
      
      //can't get current state, only initial state
      document.body.addEventListener('keyup', (event) => {
        if (event.which === 27) {
          setPersistDrawer(!window.globalPersistDrawer)
        }
      });
    }, [])
  
    useEffect(() => {
      window.globalPersistDrawer = persistDrawer;
    }, [persistDrawer]);

  const handleListItemClick = (event, index, route) => {
    history.push(`${process.env.PUBLIC_URL}${route}`);
  };

  /** Side Navigation */
  const drawerContents = (
    <List component="nav">
      <ListItem
        button
        selected={currentPath === `${process.env.PUBLIC_URL}/`}
        onClick={event => handleListItemClick(event, 0, '/')}
      >
        Home
      </ListItem>
      <ListItem
        button
        selected={currentPath === `${process.env.PUBLIC_URL}/it`}
        onClick={event => handleListItemClick(event, 1, '/it')}
      >
        Bad Link
      </ListItem>
    </List>
  )

  return (
    <div className="App">
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <IconButton onClick={() => { setDrawer(!drawer)}} className={`${classes.menuButton} ${classes.navIconHideLg}`} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <IconButton onClick={() => { setPersistDrawer(!persistDrawer)}} className={`${classes.menuButton} ${classes.navIconHideSm}`} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            City of Auburn
          </Typography>
          <div>
            <IconButton
              aria-owns={accountIcon ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={(event) => { setAccountIcon(event.currentTarget)}}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={accountIcon}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(accountIcon)}
              onClose={() => { setAccountIcon(null)}}
            >
              <MenuItem onClick={() => { setAccountIcon(null)}}>{user.email}</MenuItem>
              <MenuItem onClick={userLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Hidden mdUp>
        <SwipeableDrawer
          open={drawer}
          onClose={() => { setDrawer(!drawer)}}
          onOpen={() => { setDrawer(!drawer)}}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.list}>
            {drawerContents}
          </div>
        </SwipeableDrawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="persistent"
          anchor="left"
          open={persistDrawer}
          classes={{
            paper: classes.drawerPaper,
            docked: classes.drawerDocked,
          }}
        >
          <div className={classes.list}>
            <div className={classes.toolbar} />
            {drawerContents}
          </div>
        </Drawer>
      </Hidden>
      <main className={`${classes.content} ${(!persistDrawer && classes.contentShift)}`}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

export default withStyles(styles)(AppSkeleton);
