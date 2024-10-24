
const cartContainer = document.querySelector(".cart-container")

const checkAll = document.querySelector("[checked-all]")
const checkMulti = cartContainer.querySelectorAll(".cart-items input[type='checkbox']")

checkAll.addEventListener("click",() => {
    if(checkAll.checked){
        checkMulti.forEach((item) => {
            item.checked = true 
        })
    }else{
        checkMulti.forEach((item) => {
            item.checked = false
        })
    }
})

checkMulti.forEach((item) => {
    item.addEventListener("click", () => {
        const checkedLength = cartContainer.querySelectorAll(".cart-items input[type='checkbox']:checked").length;
        if(checkedLength === checkMulti.length){
            checkAll.checked = true;
        }
    })
})