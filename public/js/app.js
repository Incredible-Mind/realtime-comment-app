let username;
let email;
let socket = io();
do {
    username = prompt('Enter Your name: ');
} while (!username );
do {
    email = prompt('Enter Your Email: ');
} while (!email);


const textArea = document.querySelector('#textarea');
const submitBtn = document.querySelector('#submitBtn');
const commentBox = document.querySelector('.comment__box');

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let comment = textArea.value;
    if (!comment) {
        return;
    }
    postComment(comment);
});

function postComment(comment) {
    // Append To Dom
    let data = {
        username: username,
        email: email,
        comment: comment,
    }
    appendToDom(data);
    textArea.value = '';
    // Broadcast
    broadcastComment(data);
    //Sync data with MongoDB
    syncWithDb(data);
}
function appendToDom (data) {
    let lTag = document.createElement('li');
    lTag.classList.add('comment', 'mb-3');
    let markup = `
                                <div class="card border-light mb-3">
                                    <div class="card-body">
                                        <h6 class="anybady">${data.username}</h6>
                                        <h6 class="anybody">from ${data.email}</h6>
                                        <p>${data.comment}</p>
                                        <div>
                                            <img src="/img/clock.ico" alt="clock">
                                            <small>${moment(data.time).format('LT')}</small>
                                        </div>
                                    </div>
                                </div>
    `
    lTag.innerHTML = markup;
    commentBox.prepend(lTag);
};
function broadcastComment(data) {
    socket.emit('comment', data);
};
let timerId = null;
function debounce(func, timer) {
    if (timerId) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
        func();
    }, timer);
}
socket.on('comment', (data) => {
    appendToDom(data);
    console.log(data);
});

let typingDiv = document.querySelector('.typing');
socket.on('typing', (data) => {
    typingDiv.innerText = `${data.username} is typing...`;
    debounce(function () {
        typingDiv.innerText = '';
    }, 1000);
});

// Event Listeners
textArea.addEventListener('keyup', (e) => {
    socket.emit('typing', { username });
});


// Api Calls
const syncWithDb = (data) => {
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/comments', { method: 'Post', body: JSON.stringify(data), headers }).then(response => response.json()).then(result => {
        console.log(result);
    })
}
const fetchComments = () => {
    fetch('/api/comments').then(res => res.json()).then(result => {
        result.forEach((comment) => {
            comment.time = comment.createdAt;
            appendToDom(comment);
        });
    })
}
window.onload = fetchComments