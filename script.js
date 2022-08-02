const socket = io('http://localhost:8000')

const form = document.getElementById('send-message');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
let notification_sound = new Audio('images/notification.mp3');

window.setInterval(function() {
    let scroll = document.querySelector('.container');  
    scroll.scrollTop = scroll.scrollHeight;
}, 100); 

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left') {
        notification_sound.play();
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

const name = prompt("Please enter your name first");
socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    append(`${name} joined the discussion`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
});

socket.on('left', name => {
    append(`${name} leave the discussion`, 'left');
})