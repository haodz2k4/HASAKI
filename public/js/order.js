const socket = io();

socket.emit('joinRoom', 'users');

const statusContainer = document.querySelector(".status-container");
const statusStep = statusContainer.querySelectorAll(".status-step");
socket.on('UPDATE_STATUS_SUCCESS', (msg) => {
    console.log("Received status update:", msg);
    statusStep.forEach((item) => {
        const status = item.getAttribute("status");
        console.log(status)
        if (status === msg) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
});
