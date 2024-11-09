
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
const btnCancelOrder = document.querySelector("[btn-cancel-order]");
btnCancelOrder.addEventListener("click", () => {
    const isConfirm = confirm("Bạn có chắc muốn hủy đơn hàng không ?");
    if(isConfirm){
        const formCancelOrder = document.querySelector("[form-cancel-order]");
        formCancelOrder.submit()
    }
})


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
    if(['shipped','delivered','cancelled'].includes(msg)) {
        btnCancelOrder.disabled = true 
    }else{
        btnCancelOrder.disabled = false
    }
});

const order = document.querySelectorAll(".order");
order.forEach((item) => {
    const stars = item.querySelectorAll('.star');
    if(stars.length > 0){
        const ratingInput = item.querySelector('#rating-input');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                stars.forEach((s, i) => {
                s.classList.toggle('checked', i <= index);
                });
                ratingInput.value = index + 1;
            });
        });
    }
})


const btnShowRating = document.querySelectorAll("[btn-show-rating]")
console.log(btnShowRating)
btnShowRating.forEach((item) => {
    item.addEventListener("click",() => {
        const ratingForm = item.closest(".order").querySelector(".rating-form");
        ratingForm.classList.toggle("d-none")
    })
})