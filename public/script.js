const socket = io('http://localhost:3000');
const editor = document.getElementById('editor');
const documentId = 'sample-docsss'; // Use unique document ID in production

// Join the document room
socket.emit('get-document', documentId);


// Load document content when connected
socket.on('load-document', (content) => {
    console.log("content",content);
    
    editor.innerHTML = content;
});

// Listen for input and send changes
editor.addEventListener('input', () => {
    const content = editor.innerHTML;
    console.log("content",content);
    
    socket.emit('send-changes', content);
    socket.emit('save-document', content);
});

// Receive changes from other clients and apply them
socket.on('receive-changes', (content) => {
    editor.innerHTML = content;
});
