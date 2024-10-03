const url = new URL(window.location.href)

//Pagination
const btnPagination = document.querySelectorAll("[btn-pagination]");
if(btnPagination.length > 0){
    btnPagination.forEach((item) => {
        item.addEventListener("click",() => {
            const page = item.getAttribute("btn-pagination");
            if(page !== '1'){
                
                url.searchParams.set("page",page);
            }else {
                url.searchParams.delete("page")
            }
            window.location.href = url.href
        })
    })
}

const btnToggleTool = document.querySelector("[btn-toggle-tool]");
if(btnToggleTool){
    btnToggleTool.addEventListener("click", () => {
        const toolManage = document.querySelector("[tool-manage]");
        if(toolManage.classList.contains("d-none")) {
            // Nếu có, thì hiển thị toolManage
            toolManage.classList.remove("d-none");
            btnToggleTool.classList.remove("show-tool");
            btnToggleTool.innerHTML = `v`;  
        } else {
            // Nếu không, thì ẩn toolManage
            toolManage.classList.add("d-none");
            btnToggleTool.classList.add("show-tool");
            btnToggleTool.innerHTML = `^`;  
        }
    });
}
