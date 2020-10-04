const { response } = require('express');
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const connectDB = require('./config/db');
connectDB();
const Comment = require('./models/comment');
app.use(express.json());

// Routes
app.post('/api/comments', (req, res) => {
    const comment = new Comment({
        username: req.body.username,
        email: req.body.email,
        comment: req.body.comment,
    })
    comment.save().then(response => {
        res.send(response);
    });
})
Comment.find().then(comments => {
    app.get('/api/comments', (req, res) => {
        res.send(comments);
    })
})

const server = app.listen(PORT, () => {
    console.log(`Listening On Port ${PORT}`);
});
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    socket.on('comment', (data) => {
        data.time = Date();
        socket.broadcast.emit('comment', data);
    })
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
});