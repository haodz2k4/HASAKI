
const socket = io()
socket.emit('joinRoom', 'users');

const formConfirmOrder = document.querySelector("[form-confirm-order]");
if(formConfirmOrder){
    formConfirmOrder.addEventListener("submit", () => {
        socket.emit('UPDATE_CONFIRM_ORDER',true)
        console.log("RUN HERE")
    })
}
const btnConfirmOrder = document.querySelector("[btn-confirm-order]")
const statusContainer = document.querySelector(".status-container");

socket.on('UPDATE_STATUS_SUCCESS', (msg) => {
    const statusStep = statusContainer.querySelectorAll(".status-step");
    statusStep.forEach((item) => {
        const status = item.getAttribute("status");
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


const stars = document.querySelectorAll('.star');
if(stars.length > 0){
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            stars.forEach((s, i) => {
            s.classList.toggle('checked', i <= index);
            });
        });
    });
}

const btnShowRating = document.querySelectorAll("[btn-show-rating]")
console.log(btnShowRating)
btnShowRating.forEach((item) => {
    item.addEventListener("click",() => {
        const ratingForm = item.closest(".order").querySelector(".rating-form");
        ratingForm.classList.toggle("d-none")
    })
})