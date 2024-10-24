
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

const btnRemoveProductCarts = document.querySelectorAll("[btn-remove-product-cart]");
if(btnRemoveProductCarts.length > 0){
    btnRemoveProductCarts.forEach((item) => {
        item.addEventListener("click",() => {
            const id = item.getAttribute("btn-remove-product-cart");
            const formRemoveProductCart = document.querySelector("[form-remove-product-cart]");
            console.log(formRemoveProductCart)
            formRemoveProductCart.action = `/cart/remove/${id}?_method=DELETE`
            formRemoveProductCart.submit()
        })
    })
}

const cartLength = document.querySelector("[cart-length]");
cartLength.innerHTML = `Chọn tất cả (${checkMulti.length})`