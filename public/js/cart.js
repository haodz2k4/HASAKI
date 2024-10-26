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

const getIds = () => {
    const ids = []
    const checkMulti = cartContainer.querySelectorAll(".cart-items input[type='checkbox']:checked")
    checkMulti.forEach((item) => {
        ids.push(item.value)
    })
    return ids
}
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


const cardChangeMulti = document.querySelector("[card-change-multi]");
const btnDeleteMulti = cardChangeMulti.querySelector("[btn-delete-multi]");
btnDeleteMulti.addEventListener("click",() => {
   
    const formChangeMultiCart = document.querySelector("[form-change-multi-cart]") 
    const inpIds = formChangeMultiCart.querySelector("input");
    const checkedLength = cartContainer.querySelectorAll(".cart-items input[type='checkbox']:checked").length;
    if(checkedLength === 0){
        alert("Vui lòng chọn ít nhất 1 bản ghi")
    }else{
        const isConfirm = confirm("Bạn có chắc muốn xóa không")
        if(!isConfirm){
            return
        }
        const ids = getIds()
        inpIds.value = JSON.stringify(ids)
        formChangeMultiCart.action = `/cart/update/multi/remove?_method=PATCH`;
        formChangeMultiCart.submit()
    }

}) 

const btnRemoveProductInactive = document.querySelector("[btn-remove-product-inactive]")
btnRemoveProductInactive.addEventListener("click",() => {
    const isConfirm = confirm("Bạn có chắc muốn xóa tất cả sản phẩm không hoạt động không");
    if(!isConfirm){
        return;
    }
    const infoStatus = document.querySelectorAll("[info-status=inactive]");
    const ids = []
    infoStatus.forEach((item) => {
        const value = item.getAttribute("id");
        ids.push(value)
        
    })
    const formChangeMultiCart = document.querySelector("[form-change-multi-cart]") 
    const inpIds = formChangeMultiCart.querySelector("input");
    inpIds.value = JSON.stringify(ids);
    const path = `/cart/update/multi/inactive?_method=PATCH`
    formChangeMultiCart.action = path;
    formChangeMultiCart.submit()
    
})

