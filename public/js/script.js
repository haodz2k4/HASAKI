const url = new URL(window.location.href)


//PAGINATION 
const btnPagination = document.querySelectorAll("[btn-pagination]");
if(btnPagination.length > 0){
    btnPagination.forEach(item => {
        item.addEventListener("click",() => {
            const page = item.getAttribute("btn-pagination")

            if(page == 1){
                url.searchParams.delete("page")
            }else{
                url.searchParams.set("page",page)
            }

            window.location.href = url.href
        })
    }) 
}

//SORT 
const selectSort = document.querySelector("[select-sort]");
if(selectSort){
    selectSort.addEventListener("change",() => {
        const value = selectSort.value
        if(value){
            const [sortKey, sortValue] = value.split("-");
            url.searchParams.set("sortKey",sortKey)
            url.searchParams.set("sortValue", sortValue); 
        }else {
            url.searchParams.delete("sortKey")
            url.searchParams.delete("sortValue")
        }
        
        window.location.href = url.href
    })
}

//Range Price 
const btnRangePrice = document.querySelector("[btn-range-price]")
if(btnRangePrice){
    btnRangePrice.addEventListener("click",() => {
        const inpMinPrice = document.querySelector("[inp-min-price]").value;
        const inpMaxPrice = document.querySelector("[inp-max-price]").value; 
        
        url.searchParams.set("minPrice",inpMinPrice)
        
        url.searchParams.set("maxPrice",inpMaxPrice)
        
        const minPrice = url.searchParams.get("minPrice")
        console.log(minPrice)
        if(!minPrice){
            url.searchParams.delete("minPrice")
        }
        const maxPrice = url.searchParams.get("maxPrice")
        console.log(maxPrice)
        if(!maxPrice){
            url.searchParams.delete("maxPrice")
        }
        window.location.href = url.href
    })
}

const timeOutAlert = document.querySelector("[time-out-alert]");
if(timeOutAlert){
    setTimeout(() => {
        timeOutAlert.classList.add("d-none")
    }, 5000)
} 

const btnLogout = document.querySelector("[btn-logout]")
if(btnLogout){
    btnLogout.addEventListener("click",() => {
        window.location.href = "/users/logout"
    })
} 

const btnNext = document.querySelector("[btn-next]")
if(btnNext) {
    btnNext.addEventListener("click",() => {
        const featureItem = document.querySelectorAll("[feature-item]")
        featureItem.forEach((item, index) => {
            item.classList.add("d-none")
            if(index >= 4 && index <= 7) {
                item.classList.remove("d-none")
            }
        })
    })
}


const btnPre = document.querySelector("[btn-prev]")
if(btnPre) {
    btnPre.addEventListener("click",() => {
        const featureItem = document.querySelectorAll("[feature-item]")
        featureItem.forEach((item, index) => {
            item.classList.add("d-none")
            if(index >= 0 && index <= 3) {
                item.classList.remove("d-none")
            }
        })
    })
}

const featureItem = document.querySelectorAll("[feature-item]");
if(featureItem.length > 0){
    featureItem.forEach((item) => {
        item.addEventListener("click",() => {
            const value = item.getAttribute("feature-item");
            window.location.href = "/products/"+value
        })
    })
}