<p align="center">
  <img width="111" height="111" src="https://github.com/sopra-fs23-group-25/Pictionary-server/assets/99895243/1763c6dd-00e9-46a5-8dcc-82fb3385507a">
</p>
<h1 align="center">SoPra FS23 Group 25 - Pictionary Client</h1>

## Introduction
We created a web-based version of Pictionary, a fun draw and guess game, where users play against each other in real-time.  The game can be played in a user's preferred language. We used Google Translate API to allow users with different chosen languages to play together.			

### Hosted on:
- Client: https://sopra-fs23-group-25-client.oa.r.appspot.com/
- Server: https://sopra-fs23-group-25-server.oa.r.appspot.com/

## Technologies
<img src="https://github.com/sopra-fs23-group-25/Pictionary-server/assets/99895243/dcd30e0f-8428-4c82-9ba4-c9c15640de5e" width="16" height="16" /> [**JavaScript**](https://javascript.com/) : frontend implementation.	

<img src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/99895243/8218e841-cb3c-4fc7-89fb-5f51263e0f83" style='visibility:hidden;' width="16" height="16" /> [**NPM**](https://www.npmjs.com/) : package manager.	

<img src="https://github.com/sopra-fs23-group-25/Pictionary-server/assets/99895243/bb2eafc7-5ed4-4ebd-970e-343441a5b40c" width="16" height="16" /> [**React**](https://react.dev/) : UI development.	

<img src="https://user-images.githubusercontent.com/91155454/170842503-3a531289-1afc-4b9c-87c1-cc120d9229ce.svg" style='visibility:hidden;' width="16" height="16" /> [**REST**](https://en.wikipedia.org/wiki/Representational_state_transfer) : communication between server and client.

<img src="https://user-images.githubusercontent.com/91155454/170843632-39007803-3026-4e48-bb78-93836a3ea771.png" style='visibility:hidden;' width="16" height="16" /> [**WebSocket**](https://en.wikipedia.org/wiki/WebSocket) : communication between server and client.

<img src="https://github.com/get-icon/geticon/blob/master/icons/github-icon.svg" width="16" height="16" /> [**GitHub**](https://github.com/) : version control, tracability and planning.

## Launch and Deployment

Get the client
```bash
./git clone https://github.com/sopra-fs23-group-25/Pictionary-client
```
and open the project with an IDE of your choice.

For your local development environment, [Node.js](https://nodejs.org/en) is needed. All other dependencies, including React, get installed with:

npm install
When running the application for the first time, run this command. After that you can start the application with:

npm run dev
After that you can open http://localhost:3000 to view the app running in the browser. Notice that the page will reload if you make any edits.

Build
This command will build the app for production to the build folder.

npm run build
It bundles React correctly in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.

Testing
There are currently no tests on the client version of Pictionary.

Tests can be run with the command:

npm run test
This launches the test runner in an interactive watch mode. See the section about [running tests](https://create-react-app.dev/docs/running-tests/) for more information.

Deployment
After each commit to the master branch, automatic Github Actions get executed which deploy our application to Google Cloud. See the section about [deployment](https://create-react-app.dev/docs/deployment/) for more information.



## Illustrations
todo

## Authors
- [Joana Cieri](https://github.com/jo-ana-c)
- [Leo Engelberger](https://github.com/pcplusgit)
- [Pablo Chacon Pino](https://github.com/LeoEngelberger)
- [Nico Camillo Zala](https://github.com/nczala)

Contact: leo.engelberger@gmail.com

## Acknowledgements
We would like to thank the SoPra FS23 teching team, especially our tutor [Dennys Huber](https://github.com/devnnys) for supervising our project and for his advice throughout the semester.

## Licence
[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
