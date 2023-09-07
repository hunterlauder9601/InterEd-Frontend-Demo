// TerminalUI.js

// global variables
let splitBars = {};
let currentSplit = '';

function zoomOutFile(){
	var sz = window.terminal.editor.getFontSize();
	sz -= 1;
	if (sz <= 5)
		sz = 5;
	window.terminal.editor.setFontSize(sz);
}

function zoomInFile(){
        var sz = window.terminal.editor.getFontSize();
        sz += 1;
        if (sz >= 50)
                sz = 50;
        window.terminal.editor.setFontSize(sz);
}

function saveFile(){
	console.log("save file:", window.terminal.editor.filePath);
	if (window.terminal.editor.filePath !== undefined) {
		window.terminal.socket.emit('saveFile', {path:window.terminal.editor.filePath, content:window.terminal.editor.getValue()});
	}
}

function checkAceMode(path){
	var modelist = ace.require("ace/ext/modelist");
	var mode = modelist.getModeForPath(path);//mode
	window.terminal.editor.session.setMode(mode.mode);
}

function mouseMoveHandler (input) {
      	//console.log("mouse move");
	if ( currentSplit.length === 0 ){
		console.log("no specific split bar was chosen.");
		return;
	}

        const para = splitBars[currentSplit];
	const divSplit = para.current;
        //console.log(para);

        // How far the mouse has been moved
        const dx = input.clientX - para.xPos;
        const dy = input.clientY - para.yPos;

	let newSize = 0;
	if (para.verticalBar) {
		/* same as below, adjusting both works perfectily */
        	newSize = ((para.leftWidth + dx) * 100) / divSplit.parentNode.getBoundingClientRect().width;
		para.leftSide.style.width = `${newSize}%`;

		newSize = ((para.rightWidth - dx) * 100) / divSplit.parentNode.getBoundingClientRect().width;
                para.rightSide.style.width = `${newSize}%`;

		// 50 px is the half of the explorer window
        	if ( (para.leftWidth + dx) < 50 ) {
                	para.leftSide.style.width = '0px';
                	para.leftSide.style['min-width'] = '0px';
                	para.leftSide.style['border-style'] = 'none';
        	}

        	if ( (para.leftWidth + dx) >= 50 ) {
                	if  ( para.leftSide.style['min-width'] === '0px' ) {
                        	para.leftSide.style['min-width'] = '100px';
                        	para.leftSide.style.removeProperty('border-style');
                	}
        	}

		/* release mouse events */
        	if ( (para.leftWidth + dx) < 0 ) {
                	// Remove the handlers of `mousemove` and `mouseup`
                	document.removeEventListener('mousemove', mouseMoveHandler);
                	document.removeEventListener('mouseup', mouseUpHandler);
                	currentSplit='';

                	// terminal adjustment
                	if (window.terminal != undefined)
					window.terminal.fitAddon.fit();    // resize xterm
                	document.getElementById("terminal").style.visibility = "visible";
                	return;
        	}

		// hide right hand side if the width is too small
		if ( (para.rightWidth - dx) <= 40 ) {
			para.rightSide.style.display = "none";
                        para.leftSide.style.width = "100%";
                } else if ( (para.rightWidth - dx) > 40 ) {
                        para.rightSide.style.display = "block";
                }

		para.leftSide.style.userSelect = 'none';
                para.leftSide.style.pointerEvents = 'none';

                para.rightSide.style.userSelect = 'none';
                para.rightSide.style.pointerEvents = 'none';

		divSplit.style.cursor = 'col-resize';
        	document.body.style.cursor = 'col-resize';

        	// hide the terminal dduring moving */
        	document.getElementById("terminal").style.visibility = "hidden";
	} else {
		/* somehow, if we adjust both upper and lower divisions, it works perfectily
		 * howerver, in theory, only one window is needed to be adjusted, as we use "flex" box */
		/* update upper window */
		newSize = ((para.upperHeight + dy) * 100) / divSplit.parentNode.getBoundingClientRect().height;
		para.upperSide.style.height = `${newSize}%`;

		/* update lower window */
		newSize = ((para.lowerHeight - dy) * 100) / divSplit.parentNode.getBoundingClientRect().height;
                para.lowerSide.style.height = `${newSize}%`;

		/* "minimize upper window */
		if ( (para.upperHeight + dy) < 30 ) {
                        para.upperSide.style.height = '0px';
			para.upperSide.style.display = 'none';
                } else if ( (para.upperHeight + dy) >= 30 ) {
			para.upperSide.style.display = 'flex';
		}

		/* "minimize" lower window */
		if ( (para.lowerHeight - dy) <= 40 ) {
                        para.lowerSide.style.display = "none";
			para.upperSide.style.height = "100%";
                } else if ( (para.lowerHeight - dy) > 40 ) {
			para.lowerSide.style.display = "block";
		}

		para.upperSide.style.userSelect = 'none';
                para.upperSide.style.pointerEvents = 'none';

		para.lowerSide.style.userSelect = 'none';
                para.lowerSide.style.pointerEvents = 'none';

		divSplit.style.cursor = 'row-resize';
                document.body.style.cursor = 'row-resize';

		/* hide the terminal during moving */
		document.getElementById("terminal").style.visibility = "hidden";
	}

};

function mouseUpHandler (input) {
        //console.log("mouse up");
	if ( currentSplit.length === 0 ){
                console.log("no specific split bar was chosen.");
                return;
        }

        const para = splitBars[currentSplit];
	const divSplit = para.current;
        //console.log(para);

        divSplit.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
	currentSplit='';

	if (!para.verticalBar) {
		para.upperSide.style.removeProperty('user-select');
        	para.upperSide.style.removeProperty('pointer-events');
		para.lowerSide.style.removeProperty('user-select');
        	para.lowerSide.style.removeProperty('pointer-events');

        	// terminal adjustment
        	if (window.terminal != undefined && para.lowerSide.style.display !== 'none'){
				window.terminal.fitAddon.fit();    // resize xterm
				document.getElementById("terminal").style.visibility = "visible";
		}
		window.terminal.editor.resize();
		window.terminal.editor.renderer.updateFull();
	} else {
		para.leftSide.style.removeProperty('user-select');
                para.leftSide.style.removeProperty('pointer-events');
                para.rightSide.style.removeProperty('user-select');
                para.rightSide.style.removeProperty('pointer-events');
		/* resize terminal and display it */
		if (window.terminal != undefined && para.rightSide.style.display !== 'none'){
			window.terminal.fitAddon.fit();
			document.getElementById("terminal").style.visibility = "visible";
		}
		window.terminal.editor.resize();
		window.terminal.editor.renderer.updateFull();
	}
};

function clickOnFolder() 
{
	this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
        /* check if the list is empty or not
         * if empty, talk to server to see if anything changed*/
        //console.log("pathname", this.pathName);
        const fsNode = window.terminal.searchFS(this.pathName);
        //console.log("search fsNode:", fsNode);
        if ( fsNode.list.length === 0) {
        	window.terminal.socket.emit('fs', this.pathName);
        }
}

/* Capture the enter button for input boxes */
function keyupFunc(e)
{
	if (e.keyCode === 13) {
		if (this.value === null || this.value === ''){
       			alert("Empty input!");
			this.parentElement.style.display = 'none';
		}else{
			var path = '';
			if (this.parentElement.inputPath === '/')
				path = this.parentElement.inputPath+this.value;
			else
				path = this.parentElement.inputPath + "/" + this.value;

			var command = '';
			if (this.parentElement.inputType === 'file')
				command = 'touch '+ path;
			else
				command = 'mkdir '+ path;
			
			const commands = [];
			commands.push(command);
			window.terminal.socket.emit('execute', commands);
			this.parentElement.style.display = 'none';
			
			/* get a new list */
			const pDiv1 = document.getElementById("contextMenu");
			window.terminal.socket.emit('fs', pDiv1.path);	
		}
    	}
}

function loseFocus() {
	//console.log("losing focus");
	// input box loses focus, makes its parent invisible
	this.parentElement.style.display = 'none';
}

function clickOnFile ()
{
	console.log("file name", this.pathName);
	window.terminal.socket.emit('file', this.pathName);
}

function hideMenu() {
            document.getElementById("contextMenu").style.display = "none"
}

function clickOnRight(event)
{
	event.preventDefault();

	var menu = document.getElementById("contextMenu")
        menu.style.display = 'block';
        menu.style.left = event.pageX + "px";
        menu.style.top = event.pageY + "px";
	menu.path = this.id;
}

/* The classs of terminal */
export class TerminalUI {
	constructor(socket, parentSocket) {
		this.baseTheme = {
                        foreground: '#F8F8F8',
                        background: '#2D2E2C',
                        selection: '#5DA5D533',
                        black: '#1E1E1D',
                        brightBlack: '#262625',
                        red: '#CE5C5C',
                        brightRed: '#FF7272',
                        green: '#5BCC5B',
                        brightGreen: '#72FF72',
                        yellow: '#CCCC5B',
                        brightYellow: '#FFFF72',
                        blue: '#5D5DD3',
                        brightBlue: '#7279FF',
                        magenta: '#BC5ED1',
                        brightMagenta: '#E572FF',
                        cyan: '#5DA5D5',
                        brightCyan: '#72F0FF',
                        white: '#F8F8F8',
                        brightWhite: '#FFFFFF'
                };

    		this.terminal = new Terminal( {
			fontFamily: '"Cascadia Code", Menlo, monospace',
			cursorBlink: true,
			theme: this.baseTheme,
			fontSize: 13,
			fontWeight: 40
		});

    		this.fitAddon = new FitAddon.FitAddon(); // error handling
    		this.terminal.loadAddon(this.fitAddon);

		//this.terminal.setOption('fontWeight', '100');
		this.terminal.onResize(function (evt) {
			console.log("resizing terminal", evt);
			window.terminal.socket.emit("ptyResize", evt);
		});

    		this.socket = socket;
    		this.pSocket = parentSocket;


		//this.terminal.setOption("theme", this.baseTheme);
    		/* the root folder object */
    		this.fs = { name: '/',
	    		isFolder: true,
	    		extended: false,
	    		list: []  //contains a list of objects
    		};

    		/* this is the editor */
    		this.editor = {};

		this.items = {};
		/* a set of elements */
  	}
	
	isSocketConnected() {
		if (this.socket && this.socket.connected) {
			return true;
		}
		return false;
	}
	/**
   	* Attach event listeners for terminal UI and socket.io client
   	*/
	startListening() {
		this.terminal.onData(data => {
			if (this.socket === null)
			{
				if (data === "\r")
				this.prompt();
				else
					this.terminal.write(data);
			}
			else
				this.sendInput(data)
		});

		this.socket.on('connect', () => {
			// Connection is successful, handle it here
			console.log("start connect");
			//just in case react render fails for some reason
			// const loadingScreen = document.getElementById('loadingScreen');
			// loadingScreen.style.display = 'none';

			const screenStartEvent = new Event('screenStart');
			window.dispatchEvent(screenStartEvent);
		});

		this.socket.on("output", data => {
		// When there is data from PTY on server, print that on Terminal.
			this.write(data);
		});


		/* receive file system related information */
		this.socket.on('fs', data => {
			const path = data.path;
			const list = data.list;
			/* find the root node to append */
			const fsNode = this.searchFS(path);
	
			/* TODO */
			var prefix = '';
			if (path === '/') {
				prefix = path;
			}else {
				prefix = path + '/';
			}

			/* clean up the list */
			fsNode.list = [];

			/* update the list */
			for (var i = 0; i<data.list.length; i++) {
				fsNode.list[i] = { name: list[i].name, 
					isFolder: list[i].isFolder, 
					extended: false, 
					pathName: prefix + list[i].name,
					list: [] 
				}
			}

			/* draw or re-draw */
			if (path === '/')
				this.drawExp();
			else
				this.extExp(fsNode);

		});

		this.socket.on('file', data=> {
			const path = data.path;
			const content = data.content;
			const aceMode = checkAceMode(path);
			const ele = document.getElementById('editorBarTitle');
			ele.innerHTML = path;

			this.editor.session.setValue(content);
			this.editor.filePath = path;
		});


		this.socket.on('connect_error', function(err) {
		console.log(`connection error due to ${err.message}`);
		});

		this.socket.io.on("reconnect_failed", () => {
		console.log('re-connection failed!');
		// reset it
		const paras = {'uName': username, 'cName': courseName, 'lName': lessonName};
		this.pSocket.emit("connect_req", paras);
		});

		/* inquire files/folders under the root */
		this.sendFSrequest('/');
		//this.drawExp(); //Draw root
  	}
 

  	/* Input: file/folder absolute path
   	* Output: file node */
  	searchFS(path) {
    		var fs = this.fs;
    		var pos = path.indexOf('/');
    		var dirName =  path.slice(0, pos+1);
    		var nextPath = path.slice(pos + 1);  //keep all strings from pos+1
    
    		while(nextPath.length !== 0 && pos !== -1) {
         		pos = nextPath.indexOf('/');   
	 		if ( pos === -1) {
		 		dirName = nextPath;
	 		} else {
	 			dirName = nextPath.slice(0, pos);
	 		}
	 		//console.log("dirName:", dirName);
	 		fs.list.forEach(element => {
                		if (element.name === dirName) {
                        		fs = element;
                 		}
         		});
	 		//console.log("object:", fs);
	 		nextPath = nextPath.slice(pos + 1);
    		}
    		return fs;
  	}

  	extExp(fsNode) {
		const path = fsNode.pathName;
	  	const spanElement = document.getElementById(path);
	  	const ulElement = spanElement.nextElementSibling;
	  	//console.log("returned ulElement:", ulElement);
	  
	  	/* remove all children elements under the ul element, if any 
		 * Exception: the first li element, which is the input box
		 * Note that, the children's length changes while being shrinked*/
	  	const children = ulElement.children;
	  	for (let i=1; i<children.length; i++) {
			console.log(i, children[i]);
			children[i].remove();
			i=0;  
	 	};

		/* add all elements under the ul element */
	  	const fragment = document.createDocumentFragment();
	  	const list = fsNode.list;
	  	for (let i = 0; i < list.length; i++){
			const obj = list[i];
                  	if ( obj.isFolder === true ){
                        	/* list, span, and ul */
                          	const li = document.createElement('li');
                          	fragment.appendChild(li);

                          	const span = document.createElement('span');
                          	span.className = 'caret';
                          	span.innerHTML = obj.name;
                          	span.pathName = obj.pathName;
                          	span.id = obj.pathName;
                          	li.appendChild(span);

                          	const ul = document.createElement('ul');
                          	ul.className = 'nested';
                          	li.appendChild(ul);

				/* a placeholder for input */
                                const inputLi = document.createElement('li');
                                ul.appendChild(inputLi);

                                const inputSpan = document.createElement('span');
                                inputSpan.className = 'inputBox';
                                inputSpan.id = inputSpan.className+obj.pathName;

                                const inputBox = document.createElement('input');
                                inputBox.style = "border: 2px solid blue";
                                inputBox.type = "text";
                                inputBox.placeholder = "new file/folder name";
                                inputBox.addEventListener("keypress", keyupFunc);
				inputBox.addEventListener("focusout", loseFocus);

                                inputSpan.appendChild(inputBox);
                                inputLi.appendChild(inputSpan);
                  	}
                  	else {
                        	/* list */
                          	const li = document.createElement('li');
                          	li.innerHTML = obj.name;
				li.className = 'plain';
				li.id = obj.pathName;
				li.pathName = obj.pathName;
                          	fragment.appendChild(li);
                  	}
	  	}
	  	ulElement.appendChild(fragment);

	  	var toggler = document.getElementsByClassName("caret");
          	var i;

          	for (i = 0; i < toggler.length; i++) {
			toggler[i].removeEventListener("click", clickOnFolder);
                	toggler[i].addEventListener("click", clickOnFolder);
			toggler[i].removeEventListener("contextmenu", clickOnFolder);
			toggler[i].addEventListener("contextmenu", clickOnRight);
	  	}

		/* click on files */
                toggler = document.getElementsByClassName("plain");
                for (i = 0; i < toggler.length; i++) {
			toggler[i].removeEventListener("click", clickOnFile);
                        toggler[i].addEventListener("click", clickOnFile);
                }
  	}


  	/* draw explorer the first time */
  	drawExp() {
		const divExp = document.getElementById('terminalExp1');
		
		/* completely remove any child under explore */
		const children = divExp.children;
		const loop = children.length;
		for(let i=0; i<loop; i++) {
			children[i].remove();
		}

		/* draw or re-draw them */
	  	const fragment = document.createDocumentFragment();
	  	/* root ul */
	  	const rootUl = document.createElement('ul');
	  	rootUl.id = 'root';

	  	/* root li */
	  	const rootLi = document.createElement('li');
	  	rootUl.appendChild(rootLi);
	  
	  	/* span for the li */
	  	const rootSpan = document.createElement('span');
	  	rootSpan.className = 'caret caret-down';
	  	rootSpan.innerHTML = '/';
	  	rootSpan.pathName = '/';
	  	rootSpan.id = '/';
	  	rootLi.appendChild(rootSpan);

	  	/* nested ul for the folder li */
	  	const rootNestUl = document.createElement('ul');
	  	rootNestUl.className = 'nested active';
	  	rootLi.appendChild(rootNestUl);
		
		/* inputbox placeholder */
		const inputLi = document.createElement('li');
                rootNestUl.appendChild(inputLi);

                const inputSpan = document.createElement('span');
                inputSpan.className = 'inputBox';
                inputSpan.id = inputSpan.className+'/';

                const inputBox = document.createElement('input');
                inputBox.style = "border: 2px solid blue";
                inputBox.type = "text";
                inputBox.placeholder = "new file/folder name";
                inputBox.addEventListener("keypress", keyupFunc);
		inputBox.addEventListener("focusout", loseFocus);

                inputSpan.appendChild(inputBox);
                inputLi.appendChild(inputSpan);

	  	const list = this.fs.list;
	  	for (var i = 0; i < list.length; i++){
		  	const obj = list[i];
		  	if ( obj.isFolder === true ){
				/* list, span, and ul */
				const li = document.createElement('li');
			  	rootNestUl.appendChild(li);

			  	const span = document.createElement('span');
			  	span.className = 'caret';
			  	span.innerHTML = obj.name;
			  	span.pathName = obj.pathName;
			  	span.id = obj.pathName;
			  	li.appendChild(span);

			  	const ul = document.createElement('ul');
			  	ul.className = 'nested';
			  	li.appendChild(ul);

				/* a placeholder for input */
                		const inputLi = document.createElement('li');
                		ul.appendChild(inputLi);

                		const inputSpan = document.createElement('span');
                		inputSpan.className = 'inputBox';
                		inputSpan.id = inputSpan.className+obj.pathName;

                		const inputBox = document.createElement('input');
                		inputBox.style = "border: 2px solid blue";
                		inputBox.type = "text";
                		inputBox.placeholder = "new file/folder name";
                		inputBox.addEventListener("keypress", keyupFunc);
				inputBox.addEventListener("focusout", loseFocus);

                		inputSpan.appendChild(inputBox);
                		inputLi.appendChild(inputSpan);
		  	}
		  	else {
				/* list */
			  	const li = document.createElement('li');
				li.className = 'plain';
				li.id = obj.pathName + '/' + obj.name;
			  	li.innerHTML = obj.name;
				li.pathName = obj.pathName;
			  	rootNestUl.appendChild(li);
		  	}
	  	}

	  	fragment.appendChild(rootUl);
	  	divExp.appendChild(fragment);

	  	var toggler = document.getElementsByClassName("caret");
	  	var i;

	  	for (i = 0; i < toggler.length; i++) {
  	  		toggler[i].addEventListener("click", clickOnFolder);
			toggler[i].addEventListener("contextmenu", clickOnRight);
	  	}

		/* click on files */
		toggler = document.getElementsByClassName("plain");
		for (i = 0; i < toggler.length; i++) {
                        toggler[i].addEventListener("click", clickOnFile);
                }

  	}

	/* create a new file */
	createNewFile(event) {
		const pDiv1 = document.getElementById("contextMenu");
                const eDiv1 = document.getElementById(pDiv1.path);

                if (!eDiv1.classList.contains("caret-down"))
                	eDiv1.click();

                /* show the input box and make it focused */
                const inputBox = document.getElementById('inputBox'+pDiv1.path);
                inputBox.style.display = 'block';
                /* mark down input information */
                inputBox.inputType = 'file';
                inputBox.inputPath = pDiv1.path;
                inputBox.children[0].focus();
	}

  	/* change to a new connection */
  	renewListening() {
    		this.socket.on("output", data => {
      			// When there is data from PTY on server, print that on Terminal.
      			this.write(data);
    		});

    		this.socket.on('connect_error', function(err) {
        		console.log(`connection error due to ${err.message}`);
    		});

    		this.socket.io.on("reconnect_failed", () => {
        		console.log('re-connection failed!');
        		// reset it
        		const paras = {'uName': username, 'cName': courseName, 'lName': lessonName};
        		this.pSocket.emit("connect_req", paras);
    		});
  	}

  	/**
   	* Print something to terminal UI.
   	*/
  	write(text) {
    		this.terminal.write(text);
  	}

  	/**
   	* Utility function to print new line on terminal.
   	*/
  	prompt() {
    		this.terminal.write(`\r\n$ `);
  	}

  	/**
   	* Send whatever you type in Terminal UI to PTY process in server.
   	* @param {*} input Input to send to server
   	*/
  	sendInput(input) {
    		this.socket.emit("input", input);
  	}

  	/* inquire file systems */
  	sendFSrequest(input) {
    		this.socket.emit("fs", input);
  	}

	/* open a file in the editor */
	openFile(path) {
		console.log(this);
		console.log(path);
		this.socket.emit('file', path);
	}

  	/* this function can be moved out of the class */
  	mouseDownHandler(input) {
	  	const divSplit = input.target;
	  	const para = splitBars[divSplit.id];

	  	// let the global variable remember the current split id
	  	currentSplit = divSplit.id;
	  	//console.log(para);

	  	para.xPos = input.clientX;
          	para.yPos = input.clientY;
	  	if (para.verticalBar) {
          		para.leftWidth = para.leftSide.getBoundingClientRect().width;
			if (para.rightSide.style.display !== 'none') {
                        	para.rightWidth = para.rightSide.getBoundingClientRect().width;
                	} else {
                        	para.rightWidth = 0;
                	}
	  	} else {
			para.upperHeight = para.upperSide.getBoundingClientRect().height;
			if ( para.lowerSide.style.display !== 'none') {
				para.lowerHeight = para.lowerSide.getBoundingClientRect().height;
			} else {
				para.lowerHeight = 0;
			}
	  	}

          	// Attach the listeners to `document`
          	document.addEventListener('mousemove', mouseMoveHandler);
          	document.addEventListener('mouseup', mouseUpHandler);
  	}

	showEditor() {
		const divExp = document.getElementById('terminalExp1');
                divExp.style.display = 'none';
                const divSplit1 = document.getElementById('terminalSplit1');
                divSplit1.style.display = 'none';
		const divSplit2 = document.getElementById('terminalSplit2');
		divSplit2.style.display = 'none';
		const divTerminal = document.getElementById('terminal');
		divTerminal.style.display = 'none';
		const divEditor = document.getElementById('editorBody');
                divEditor.style.display = 'flex';
		divEditor.style.height = "100%";
		window.terminal.editor.resize();
        }

	showAll() {
		const divTermEditor = document.getElementById('termeditor');
		divTermEditor.style.width = '50%';  // --> just trigger this window to resize
		const divExp = document.getElementById('terminalExp1');
                divExp.style.display = 'block';
                const divSplit1 = document.getElementById('terminalSplit1');
                divSplit1.style.display = 'block';
		const divSplit2 = document.getElementById('terminalSplit2');
                divSplit2.style.display = 'block';
		const divTerminal = document.getElementById('terminal');
                divTerminal.style.display = 'block';
		const divEditor = document.getElementById('editorBody');
		divEditor.style.display = 'flex';
		divEditor.style.height = "50%";
		divTerminal.style.height = "50%";
		/* resize editor and terminal */
		window.terminal.editor.resize();
		window.terminal.fitAddon.fit();
	}

	showEditTer() {
		const divExp = document.getElementById('terminalExp1');
		divExp.style.display = 'none';
		const divSplit1 = document.getElementById('terminalSplit1');
		divSplit1.style.display = 'none';
		const divSplit2 = document.getElementById('terminalSplit2');
                divSplit2.style.display = 'block';
                const divTerminal = document.getElementById('terminal');
                divTerminal.style.display = 'block';
                const divEditor = document.getElementById('editorBody');
		/* resize editor and terminal */
                divEditor.style.display = 'flex';
		divEditor.style.height = "50%";
		divTerminal.style.height = "50%";
		window.terminal.editor.resize();
		window.terminal.fitAddon.fit();
	}

	showTerminal() {
		const divExp = document.getElementById('terminalExp1');
                divExp.style.display = 'none';
                const divSplit1 = document.getElementById('terminalSplit1');
                divSplit1.style.display = 'none';
                const divSplit2 = document.getElementById('terminalSplit2');
                divSplit2.style.display = 'none';
                const divTerminal = document.getElementById('terminal');
                divTerminal.style.display = 'block';
                const divEditor = document.getElementById('editorBody');
                divEditor.style.display = 'none';
		/* resize terminal */
		window.terminal.fitAddon.fit();
	}
  	/**
   	*
   	* @param {HTMLElement} container HTMLElement where xterm and its control-related items.
   	*/
  	draw(container) {
		const fragment = document.createDocumentFragment();
	 	 /* add a tool-box bar */
	  	const divBar = document.createElement('div');
	  	fragment.appendChild(divBar);
	  	divBar.className = 'terminalBar';
		/* add several button to this tool-box bar */
		const divBarButton1 = document.createElement('button');
		divBarButton1.className = "terminalBarButton";
		divBarButton1.id = "terminalBarButton1";
                divBarButton1.onclick = this.showAll;
                divBarButton1.innerHTML = '<img src="assets/images/iconfull.png" height="20" width="28">';
		const divBarButton2 = document.createElement('button');
		divBarButton2.className = "terminalBarButton";
                divBarButton2.onclick = this.showEditTer;
                divBarButton2.innerHTML = '<img src="assets/images/iconEditTer.png" height="20" width="28">';
		const divBarButton3 = document.createElement('button');
		divBarButton3.className = "terminalBarButton";
                divBarButton3.onclick = this.showEditor;
                divBarButton3.innerHTML = '<img src="assets/images/iconEdit.png" height="20" width="28">';
		const divBarButton4 = document.createElement('button');
		divBarButton4.className = "terminalBarButton";
		divBarButton4.id = "terminalBarButton4";
                divBarButton4.onclick = this.showTerminal;
                divBarButton4.innerHTML = '<img src="assets/images/iconTer.png" height="20" width="28">';
		divBar.appendChild(divBarButton1);
		divBar.appendChild(divBarButton2);
		divBar.appendChild(divBarButton3);
		divBar.appendChild(divBarButton4);


	  	/* add a main body area */
	  	const divBody = document.createElement('div');
	  	fragment.appendChild(divBody);
	  	divBody.className = 'terminalBody';

	  	/* add an explorer area */
	  	const divExp = document.createElement('div');
	  	divBody.appendChild(divExp);
	  	divExp.className = 'terminalExp';
	  	divExp.id = 'terminalExp1';
	  	divExp.innerHTML = 'Explorer';

	  	/* add a vertical moving bar */
	  	const divSplit1 = document.createElement('div');
		this.divSplit1 = divSplit1;         //memorize this vertical bar
	  	divBody.appendChild(divSplit1);
	  	divSplit1.className = "terminalSplit vertical";
	  	divSplit1.id = "terminalSplit1";
	  
	  	/* add a div for editors and terminal */
	  	const divEditTer = document.createElement('div');
	  	divBody.appendChild(divEditTer);
	  	divEditTer.className = "termeditor";
		divEditTer.id = "termeditor";

	  	/* add an editor */
		const divEditorBody = document.createElement('div');
		this.divEditorBody = divEditorBody; //memorize this body
		divEditorBody.className = "editorBody";
		divEditorBody.id = "editorBody";
		divEditTer.appendChild(divEditorBody);
		
		/* add an editor bar */
		const divEditorBar = document.createElement('div');
		divEditorBar.className = "editorBar";
		divEditorBody.appendChild(divEditorBar);

		/* add title area for the editor bar */
		const divEditorBarTitle = document.createElement('div');
		divEditorBarTitle.className = "editorBarTitle";
		divEditorBarTitle.id = "editorBarTitle";
		divEditorBarTitle.innerHTML = 'Untitled';
		divEditorBar.appendChild(divEditorBarTitle);

		/* add button area for the editor bar */
		const divEditorBarButtons = document.createElement('div');
		divEditorBarButtons.className = "editorBarButtons";
		divEditorBar.appendChild(divEditorBarButtons);
	
		/*add zoom-out button */
                const divEditorZoomOutButton = document.createElement('button');
                divEditorZoomOutButton.className = "editorIco";
                divEditorZoomOutButton.onclick = zoomOutFile;
                divEditorZoomOutButton.style = "font-size:14px";
                divEditorZoomOutButton.innerHTML = '<i class="material-icons">zoom_out</i>';
                divEditorBarButtons.appendChild(divEditorZoomOutButton);

		/*add zoom-in button */
                const divEditorZoomInButton = document.createElement('button');
                divEditorZoomInButton.className = "editorIco";
                divEditorZoomInButton.onclick = zoomInFile;
                divEditorZoomInButton.style = "font-size:14px";
                divEditorZoomInButton.innerHTML = '<i class="material-icons">zoom_in</i>';
                divEditorBarButtons.appendChild(divEditorZoomInButton);

		/*add save button */
		const divEditorSaveButton = document.createElement('button');
		divEditorSaveButton.className = "editorIco";
		divEditorSaveButton.onclick = saveFile;
		//this.items.divEditorSaveButton = divEditorSaveButton;
		divEditorSaveButton.style = "font-size:16px";
		divEditorSaveButton.innerHTML = '<i class="fa fa-sticky-note-o"></i>';
	  	divEditorBarButtons.appendChild(divEditorSaveButton);

		const divEditor = document.createElement('div');
	  	divEditorBody.appendChild(divEditor);
	  	divEditor.className = "editor";
	  	divEditor.id = "editor1";

	  	/* add a horizontal moving bar */
	  	const divSplit2 = document.createElement('div');
		this.divSplit2 = divSplit2;       //memorize this horizontal bar
          	divEditTer.appendChild(divSplit2);
          	divSplit2.className = "terminalSplit horizontal";
          	divSplit2.id = "terminalSplit2";

	  	/* add a terminal area */
	  	const divTerminal = document.createElement('div');
		this.divTerminal = divTerminal;  //memorize this terminal area
	  	divEditTer.appendChild(divTerminal);
	  	divTerminal.className = 'terminalWindow';
	  	divTerminal.id = 'terminal';

	  	/* register mouse operations for divSplit1 */
	  	const para1 = {
		  	xPos: 0, 
		  	yPos: 0, 
		  	current: divSplit1, 
		  	leftSide: divExp, 
		  	rightSide: divEditTer, 
		  	leftWidth: 0,
		  	rightWidth: 0,
		  	verticalBar: true
	  	};

		/* register mouse operations for divSplit2 */ 
	  	const para2 = {
                  	xPos: 0,
                  	yPos: 0,
                  	current: divSplit2,
                  	upperSide: divEditorBody,
                  	lowerSide: divTerminal,
                  	upperHeight: 0,
		  	lowerHeight: 0,
		  	verticalBar: false
          	};

	  	splitBars[divSplit1.id] = para1;
	  	splitBars[divSplit2.id] = para2;
	  	divSplit1.addEventListener('mousedown', this.mouseDownHandler);
	  	divSplit2.addEventListener('mousedown', this.mouseDownHandler);

	  	/* append the fragment to container_right */
	  	container.appendChild(fragment);

	  	this.editor= ace.edit("editor1", {
                	theme: "ace/theme/xcode",
                	mode: "ace/mode/html",
                	placeholder: "choose file to edit or the file is empty..."
          	});
  	}
  	/**
   	*
   	* @param {HTMLElement} container HTMLElement where xterm can attach terminal ui instance.
   	*/
  	attachTo(container) {
    		this.terminal.open(container);
    		// Default text to display on terminal.
    		if (this.socket === null){
			this.addOneLine();
			this.terminal.write("Notice that your ternimal does\r\n");
			this.terminal.write("not connect to any backend server!\r\n");
			this.addOneLine();
    		} else {
			this.terminal.write('\x1b[1;1;32mWellcome to the web terminal!\x1b[0m');
		}
    		this.terminal.write("");
		this.prompt();
    		this.fitAddon.fit();
  	}

  	clear() {
    		this.terminal.clear();
  	}

  	addOneLine() {
    		this.terminal.write("-----------------------------------\r\n");
  	}
	highlightWindow(element) {
		element.animate([ 
			{border: '2px #2d2e2c solid'},
			{border: '2px yellow solid'},
			{border: '2px red solid'},
			{border: '2px yellow solid'},
			{border: '2px #2d2e2c solid'} ], 3000);
	}
}
