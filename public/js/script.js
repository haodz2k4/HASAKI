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
