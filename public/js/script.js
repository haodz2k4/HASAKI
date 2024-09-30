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