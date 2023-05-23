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
git clone https://github.com/sopra-fs23-group-25/Pictionary-client
```
and open the project with an IDE of your choice.

For your local development environment, [Node.js](https://nodejs.org/en) is needed. All other dependencies, including React, get installed with:
```bash
npm install
```

When running the application for the first time, run this command. After that you can start the application with:
```bash
npm run dev
```
After that you can open http://localhost:3000 to view the app running in the browser. Notice that the page will reload if you make any edits.

### Build
This command will build the app for production to the build folder.
```bash
npm run build
```

It bundles React correctly in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.

### Testing
There are currently no tests on the client version of Pictionary.

Tests can be run with the command:
```bash
npm run test
```
This launches the test runner in an interactive watch mode. See the section about [running tests](https://create-react-app.dev/docs/running-tests/) for more information.

### Deployment
After each commit to the master branch, automatic Github Actions get executed which deploy our application to Google Cloud. See the section about [deployment](https://create-react-app.dev/docs/deployment/) for more information.



## Illustrations

### Registration
The registration page is the landing page and where a new user can register an account by choosing a unique username, password and preferred language. By clicking on the ```login``` word the user gets redirected to the Login page.
<img width="1512" alt="Registration" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/a9ecbdf9-bcbf-4e12-bdc7-f4a61f19dcd4">


### Login
The login page is where the user with an existing account can log in with their credentials. By clicking on the ```register``` word the users gets redirected to the Registration page.
<img width="1512" alt="Login" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/56c35bbe-36d3-4051-b228-832e850491a6">


### Lobby Overview
On the lobby overview page, shown here from a French user's view, the user has the possiblity to join a lobby by clicking on the name of it or create a new lobby with their own settings by clicking on the ```CREATE A LOBBY``` button.
The refresh button is to reload the page so newly created lobbies get loaded. ```CREATE A LOBBY``` button redirects the user to the lobby settings page for a new lobby. ```SETTINGS``` button is for user settings, where you can change username, password and preferred language and the ```LOGOUT``` button logs you out and redirects to the login page.
<img width="1512" alt="LobbyOverviewFr" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/946ef5de-9171-49af-b504-f346e8811450">

### User Settings
The user settings page is where the user can edit the username, password and preferred language. By clicking on the ```SAVE``` button, the user can check if the newly chosen username is unique and valid and save the credentials. By clicking on the ```BACK``` button, the user gets redirected to the lobby overview page.
<img width="1512" alt="UserSettings" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/0eec05b9-bd3d-493e-8034-3565167dca5c">

### Lobby Settings
On the lobby settings page the user can choose the lobby’s name, seconds per round, how many rounds you want to play and maximum number of players allowed. The minimum number of players is 2. The user needs to confirm the settings by clicking on the ```CONFIRM``` button or cancel the lobby by clicking the ```CANCEL``` button.
<img width="1512" alt="LobbySettings" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/a4f7f80b-e12c-4077-bcbd-f35a63d98c35">

### Waiting Room
#### Host
The host can start the game by clicking on the ```Start Game``` button as soon as there is a minimum of 2 players. The host can also close the lobby by clicking on the ```Close Lobby``` button which will redirect all players of this lobby back to the lobby overview page.
<img width="1512" alt="WaitingRoomHost" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/0b6b80c3-bb2b-4abf-9098-762de117fc89">

#### Non-host
On the waiting room page as a non-host, shown here from a German user's view, the user needs to wait until the host starts the game. The user can also leave the lobby by clicking on the ```Leave Lobby``` button. 
<img width="1512" alt="WaitingRoomNotHost" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/09d28923-5afc-4644-8386-9afd928ed327">

### Game
#### Painter
The game starts and the painter needs to paint the word displayed in the right box, shown here as a French player’s view. The player can use the toolbar in the top-left corner with different colors, brush sizes and eraser. For all correct guesses submitted in time, the painter gets points too. Furthermore, the current turn, current round, total number of turns and rounds, as well as the time left for this turn is shown in the top-right corner of the drawing board. The overall ranking of players is seen in the bottom-right corner.
<img width="1512" alt="Good5" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/9ce69310-8dcc-4e70-89e8-ab7697becf66">


#### Guesser
After the game has started, the guessers see the painting drawn by the painter in real-time and the remaining time to submit a guess, shown here from a German and an English user’s view. The player can type in their guesses in their own preferred language into the box to the right and submit by clicking on the ```SUBMIT``` button.
<img width="1512" alt="Good3" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/ecb9a947-3d3e-4071-980e-469f9936a2bd">
<img width="1512" alt="Good4" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/7b704ee9-1d64-4f0a-8364-bf18d8df5a34">


### End of Turn Result
 The game ends as soon as all players submit a guess or when the time runs out. The players see the results of the last turn in their own preferred language, shown here from a German and English player’s view. This includes the correct answer, points distributed, turn ranking, the guesses submitted by all the other players in their preferred language and if they were right. Furthermore, the next painter is announced.
<img width="1512" alt="Good6" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/edb97e8b-19ec-44fd-8cea-50ac1581b383">
<img width="1512" alt="Good7" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/0d052933-4222-40a1-b5ae-03f757b7c645">


### End of Game and Final Scores
After all rounds have been played, the game ends and the final scores are displayed. The player sees the final ranking including final points and by ```Back to Lobbies``` button they can go back to the lobby overview page.
<img width="1512" alt="FinalScores" src="https://github.com/sopra-fs23-group-25/Pictionary-client/assets/116800549/f8839f9e-c904-4d92-a387-82eaddd88817">


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
