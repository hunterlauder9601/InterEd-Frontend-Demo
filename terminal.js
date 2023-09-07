import { TerminalUI } from "./TerminalUI.js";
import { auth } from './firebase.js';
import "https://cdn.socket.io/4.6.0/socket.io.min.js";


auth.onAuthStateChanged(function(user) {
	if (user) {
		// User is logged in
		console.log("User is logged in:", user);

		/* ---------------web socket connection -------------------*/
		const URL = "https://34.133.121.228";
		const socket = io(URL, {
			auth: {
			  token: '',
			  username: ''
			},
			autoConnect: false 
		});
		  
		user.getIdToken().then(function(idToken) {
			socket.auth.token = `Bearer ${idToken}`;
			socket.auth.username = user.email;
			socket.connect(); // connect to dispatcher
		}).catch(function(error) {
			console.error(error);
		});
		const courseName = document.getElementById('courseName').textContent;
		const lessonName = document.getElementById('lessonName').textContent;

		/* ask for the terminal server for the container instance connection*/
		const paras = {'uName': user.email, 'cName': courseName, 'lName': lessonName};
		socket.emit("connect_req", paras);

			/* ---------------------Socket to dispatcher-------------------- */
		/* acked by the dispatcher */
		socket.on("connect_res", (arg) => {
			console.log(`terminal addr: ${arg}`);
			start(arg, socket, user);
		});

		socket.on('connect_failed', function() {
			console.log("Sorry, there seems to be an issue with the connection!");
		});

		socket.on('error', function(exception) {
			console.log('SOCKET ERROR');
		});

		socket.on('connect_error', (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

		socket.onAny((event, ...args) => {
				console.log(`ANY ${event}`, socket.id);
		});

		socket.io.on("reconnect_failed", () => {
			console.log('re-connection failed!');
		});
	} else {
	  // User is not logged in
	  console.log("User is not logged in.");
	}
  });

//---------------Local xTerm--------------------------------//

function connectToSocket(serverAddress, user) {
    return new Promise((resolve, reject) => {
        if (!user) {
            reject(new Error("User not authenticated"));
            return;
        }

        const socket = io(serverAddress, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 30,
            auth: {
                token: '',
				containerName: ''
            },
            autoConnect: false
        });

        user.getIdToken().then(idToken => {
            socket.auth.token = `Bearer ${idToken}`;
			socket.auth.containerName = user.email + courseName + lessonName;
            socket.connect();
            resolve(socket);
        }).catch(error => {
            console.error(error);
            reject(error);
        });
    });
}

function start(serverAddress, parentSocket, user) {
  	// Connect to socket and when it is available, start terminal.
  	connectToSocket(serverAddress, user).then(socket => {
			//terminal var defined in project.html
			window.terminal = new TerminalUI(socket, parentSocket);
			// Trigger a custom event to signal that window.terminal is ready
			const terminalReadyEvent = new Event('terminalReady');
			window.dispatchEvent(terminalReadyEvent);
  	});
}


