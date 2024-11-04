

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

const selectUpdateStatus = document.querySelectorAll("[select-update-status]");
if(selectUpdateStatus.length > 0){

    selectUpdateStatus.forEach((item) => {
        item.addEventListener("change", () => {
            const status = item.value;
            const id = item.closest("tr").querySelector("input[name='id']").value
            socket.emit('UPDATE_STATUS_ORDER',{
                status,
                id
            })
        })
    })
}