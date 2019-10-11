import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
import DraftsIcon from '@material-ui/icons/Drafts';
import HomeIcon from '@material-ui/icons/Home';
import ErrorIcon from '@material-ui/icons/Error';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

import { useEffect, useState } from 'react';
import { useStateStore } from '../../services/State';
import { history } from '../../services/history';
import { userLogout } from '../../services/coa-authorization';
import { Menu, MenuItem, AppBar, Toolbar, IconButton, Hidden, SwipeableDrawer, Drawer } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';

//Layout styles
const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
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
    padding: theme.spacing(3),
    minWidth: 0, // So the Typography noWrap works
  },
  contentShift: {
    [theme.breakpoints.up('md')]: {
      marginLeft: -drawerWidth,
    },
  },
}));

function AppSkeleton({ children }) {
  const classes = useStyles();
  const [drawer, setDrawer] = useState(false);
  const [persistDrawer, setPersistDrawer] = useState(true);
  const [isOpen, setIsOpen] = useState('');
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
  }, []);
  
  useEffect(() => {
    window.globalPersistDrawer = persistDrawer;
  }, [persistDrawer]);

  const openMenu = (menu) => {
    if (menu !== isOpen)
      setIsOpen(menu);
    else
      setIsOpen('');
  }

  const handleListItemClick = (event, index, route) => {
    history.push(`${process.env.PUBLIC_URL}${route}`);
  };

  /** Side Navigation */
  const drawerContents = (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Links
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem button
        selected={currentPath === `${process.env.PUBLIC_URL}/`}
        onClick={event => handleListItemClick(event, 0, '/')}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button
        selected={currentPath === `${process.env.PUBLIC_URL}/error`}
        onClick={event => handleListItemClick(event, 1, '/error')}>
        <ListItemIcon>
          <ErrorIcon />
        </ListItemIcon>
        <ListItemText primary="Bad Link" />
      </ListItem>
      <ListItem button onClick={() => openMenu('PS')}>
        <ListItemIcon>
          <LocalParkingIcon />
        </ListItemIcon>
        <ListItemText primary="Public Safety" />
        {isOpen === 'PS' ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={(isOpen === 'PS')} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>House Check</ListItem>
          <ListItem button className={classes.nested}>Parking Enforcement</ListItem>
          <ListItem button className={classes.nested}>Body Camera</ListItem>
        </List>
      </Collapse>
    </List>
  );

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
          <h6 className={classes.grow}>City of Auburn</h6>
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

export default AppSkeleton;
