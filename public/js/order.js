
const socket = io()
socket.emit('joinRoom', 'users');


const btnConfirmOrder = document.querySelector("[btn-confirm-order]");
btnConfirmOrder.addEventListener("click", () => {
    const id = btnConfirmOrder.getAttribute("btn-confirm-order");
    
})

const statusContainer = document.querySelector(".status-container");
const statusStep = statusContainer.querySelectorAll(".status-step");
socket.on('UPDATE_STATUS_SUCCESS', (msg) => {
    
    statusStep.forEach((item) => {
        const status = item.getAttribute("status");
        console.log(status)
        if (status === msg) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    if(msg === 'delivered'){
        btnConfirmOrder.removeAttribute('disabled')
    }else{
        btnConfirmOrder.disabled = true
    }
});
