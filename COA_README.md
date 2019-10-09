
# Development Notes

## Bugs (In-Development Status)

N/A

## Missing Functionality (In, I over-promised status)

1. No promises yet

## Desired Functionality (Good thing I didn't promise, status)

1. No ideas yet

# Getting Started

`git clone https://github.com/CityOfAuburnAL/react-boilerapp-noredux.git ./`

(optionally)

Updated packages, verify integirty commit and push changes

`delete .git\`

`git init`

`git add .`

`git commit`

# Commands

`npm start`
`npm run build`
`npm run deploy`

# References

## Starter

[https://code.visualstudio.com/docs/nodejs/reactjs-tutorial](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial)
[http://www.developer-cheatsheets.com/react](http://www.developer-cheatsheets.com/react)
[https://reactjs.org/blog/2018/10/01/create-react-app-v2.html](https://reactjs.org/blog/2018/10/01/create-react-app-v2.html)
[https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill) - Note: Haven't done this

## Auth/Redux Tutorial

[http://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example](http://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example)
[https://stackblitz.com/edit/react-redux-registration-login-example?file=_services%2Fuser.service.js](https://stackblitz.com/edit/react-redux-registration-login-example?file=_services%2Fuser.service.js)

## UI Tutorial

[https://material-ui.com/](https://material-ui.com/)

# Packages

## Redux

npm install --save redux
npm install --save redux-react
npm install --save redux-thunk
npm install --save redux-logger

### Auth

npm install --save @casl/react @casl/ability

## Router

npm install --save react-router
npm install --save history

## UI

npm install --save @material-ui/core
npm install --save @material-ui/icons

## DEV

npm install --save-dev eslint eslint-loader babel-loader babel-eslint eslint-plugin-react

# Guides

## Styles

See app.js for both acceptable ways to style

1. var styles -> withStyles() brought classes as this.props className={classes.Class} or component.classes={{ overrideClass : classes.Class}} or className={classNames()}
2. import 'Name.css' and use className="Class"

## Links

1. Within Pages use Link from react-router-dom
2. Where can't use link and within App.js onclick handler history.push('/link/route')

## Authorization Development

Add new abilities to /redux/helpers/ability.js
Right now Domain Admins can 'manage' everything and everyone else can manage their dept

## Deploy

1. Need to edit deploy.js to correct location
2. Need to edit manifest.json (see manifest.example.json) in public folder
3. If sub-directory need to edit package.json and Router in App.js
4. Need url rewrite in IIS Does Not Match the Pattern .*\.[\d\w]+$ , rewrite to [/subdirectory]/index.html
[https://medium.com/@svinkle/how-to-deploy-a-react-app-to-a-subdirectory-f694d46427c1](https://medium.com/@svinkle/how-to-deploy-a-react-app-to-a-subdirectory-f694d46427c1)

# WorkFlows

## Authorization Description

App.js -> PrivateRoute checks localStorage -> Redirects to /login if missing
Login -> Calls user.action -> user.service which sets localstorage and user.action then redirects back home

## Abilities

/components/can will inclode /redux/helpers/ability and define permissions
I've made define an update because when someone logs in user.service will update and I wanted to keep the logic the same.
Note: Add positionID to sql.coa.it.SoftwareEmployees?

# Lacking

Cookie Refresh / Auto Logout
