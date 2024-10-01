const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const Document = require("./models/document");
const exp = require("constants");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { ObjectId } = mongoose.Types;

mongoose
  .connect("mongodb://127.0.0.1/collab-tool")
  .then((res) => console.log("mongodb database connected"))
  .catch((err) => console.log("database connection error", err));

app.use(express.static("public"));

// Load document from the DB or create a new one

async function findOrCreateDocument(id) {
  console.log("id", id);

  if (id == null) return;
  const document = await Document.findById(id);
  console.log("document", document);

  if (document) return document;
  return await Document.create({ _id: new ObjectId(), content: id });
}

// WebSocket connection

io.on('connection', (socket) => {
    console.log('New user connected');

    // Get document ID from client
    socket.on('get-document', async (documentId) => {
        const document = await findOrCreateDocument(documentId);
        console.log("document",document);

        socket.join(documentId);
        socket.emit('load-document', document.content);

        // Listen for changes from clients
        socket.on('send-changes', (delta) => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        // Save changes to the document
        socket.on('save-document', async (content) => {
            await Document.findByIdAndUpdate(documentId, { content });
        });
    });
});


server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
