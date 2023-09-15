"use strict";(self.webpackChunkintered_frontend=self.webpackChunkintered_frontend||[]).push([[207],{207:function(e,n,s){s.r(n),s.d(n,{default:function(){return t}});s(2791);var l=s(184),t=function(){return(0,l.jsxs)("div",{className:"w-full h-full text-lg",children:[(0,l.jsx)("div",{className:"mb-2",children:(0,l.jsx)("h1",{className:"text-2xl font-bold border-b-4 border-purple-400 tracking-wider inline",children:"2. IPC"})}),(0,l.jsxs)("div",{className:"flex flex-col",children:[(0,l.jsx)("h2",{className:"text-xl font-bold",children:"1.1. Pipe"}),(0,l.jsxs)("div",{className:"mt-1 ml-2",children:["A pipe can be created via the ",(0,l.jsx)("code",{children:"pipe()"})," system call.",(0,l.jsx)("div",{className:"lesson_high",children:(0,l.jsx)("code",{children:"pipe()"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.openFile("/home/example2/pipe1.c")},children:(0,l.jsx)("span",{children:"Go to the example"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("cd /home/example2\n"),window.parent.terminal.sendInput("gcc -o pipe1 pipe1.c \n")},children:(0,l.jsx)("span",{children:"Compile the code"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("./pipe1 \n")},children:(0,l.jsx)("span",{children:"Run the code"})})]})]}),(0,l.jsx)("hr",{className:"w-full border my-4 border-gray-300"}),(0,l.jsxs)("div",{className:"flex flex-col",children:[(0,l.jsx)("h2",{className:"text-xl font-bold",children:"1.2. Filters"}),(0,l.jsxs)("div",{className:"mt-1 ml-2",children:["Another example: Filters in shell command-line",(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.openFile("/home/example2/pipe2.c")},children:(0,l.jsx)("span",{children:"Go to the example"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("cd /home/example2\n"),window.parent.terminal.sendInput("gcc -o pipe2 pipe2.c \n")},children:(0,l.jsx)("span",{children:"Compile the code"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("./pipe2 \n")},children:(0,l.jsx)("span",{children:"Run the code"})})]})]}),(0,l.jsx)("hr",{className:"w-full border my-4 border-gray-300"}),(0,l.jsxs)("div",{className:"flex flex-col",children:[(0,l.jsx)("h2",{className:"text-xl font-bold",children:"1.3. Shared Memory -- Creation"}),(0,l.jsxs)("div",{className:"mt-1 ml-2",children:["Creation of shared memory",(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.openFile("/home/example2/shm_create.c")},children:(0,l.jsx)("span",{children:"Go to the example"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("cd /home/example2\n"),window.parent.terminal.sendInput("gcc -o shmcreate shm_create.c\n")},children:(0,l.jsx)("span",{children:"Compile the code"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("./shmcreate \n")},children:(0,l.jsx)("span",{children:"Run the code"})})]})]}),(0,l.jsx)("hr",{className:"w-full border my-4 border-gray-300"}),(0,l.jsxs)("div",{className:"flex flex-col",children:[(0,l.jsx)("h2",{className:"text-xl font-bold",children:"1.4. Shared Memory -- Attach"}),(0,l.jsxs)("div",{className:"mt-1 ml-2",children:["Attach shared memory to a process",(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.openFile("/home/example2/shm_attach.c")},children:(0,l.jsx)("span",{children:"Go to the example"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("cd /home/example2\n"),window.parent.terminal.sendInput("gcc -o shmattach shm_attach.c\n")},children:(0,l.jsx)("span",{children:"Compile the code"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("./shmattach \n")},children:(0,l.jsx)("span",{children:"Run the code"})})]})]}),(0,l.jsx)("hr",{className:"w-full border my-4 border-gray-300"}),(0,l.jsxs)("div",{className:"flex flex-col",children:[(0,l.jsx)("h2",{className:"text-xl font-bold",children:"1.5. Shared Memory -- Delete"}),(0,l.jsxs)("div",{className:"mt-1 ml-2",children:["Delete shared memory",(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.openFile("/home/example2/shm_delete.c")},children:(0,l.jsx)("span",{children:"Go to the example"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("cd /home/example2\n"),window.parent.terminal.sendInput("gcc -o shmdelete shm_delete.c\n")},children:(0,l.jsx)("span",{children:"Compile the code"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("./shmdelete \n")},children:(0,l.jsx)("span",{children:"Run the code"})})]})]}),(0,l.jsx)("hr",{className:"w-full border my-4 border-gray-300"}),(0,l.jsxs)("div",{className:"flex flex-col",children:[(0,l.jsx)("h2",{className:"text-xl font-bold",children:"1.6. Signal"}),(0,l.jsxs)("div",{className:"mt-1 ml-2",children:["Signal to the parent process when its child process terminates.",(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.openFile("/home/example2/sigchld.c")},children:(0,l.jsx)("span",{children:"Go to the example"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("cd /home/example2\n"),window.parent.terminal.sendInput("gcc -o signal sigchld.c\n")},children:(0,l.jsx)("span",{children:"Compile the code"})}),(0,l.jsx)("button",{className:"lesson_button",onClick:function(){window.parent.terminal.sendInput("./signal \n")},children:(0,l.jsx)("span",{children:"Run the code"})})]})]})]})}}}]);
//# sourceMappingURL=207.f4245c63.chunk.js.map