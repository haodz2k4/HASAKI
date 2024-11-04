const url = new URL(window.location.href)

const selectStatus = document.querySelector("[select-status]");
if(selectStatus){
    selectStatus.addEventListener("change", () => {
        const status = selectStatus.value;
        if(status){
            url.searchParams.set("status", status);
        }else{
            url.searchParams.delete("status")
        }
        window.location.href = url.href
    })
}

const selectUpdateStatus = document.querySelector("[select-update-status]");
if(selectUpdateStatus){
    selectUpdateStatus.addEventListener("change", () => {
        const status = selectUpdateStatus.value;
        const formUpdateStatus = document.querySelector("[form-update-status]");
        const inp = formUpdateStatus.querySelector("input")
        inp.value = status 
        const id = selectUpdateStatus.closest("tr").querySelector("td input[name='id']");
        formUpdateStatus.action = `/admin/orders/${id.value}/change-status?_method=PATCH`
        formUpdateStatus.submit()   
    })
}