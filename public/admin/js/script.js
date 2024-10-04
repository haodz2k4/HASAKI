const url = new URL(window.location.href)
const domain = `http://localhost:3000`
const endpoint = document.querySelector("[end-point]").getAttribute("end-point")
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
// Change Status
const btnChangeStatus = document.querySelectorAll("[btn-ch-status]");
if (btnChangeStatus.length > 0) {
    btnChangeStatus.forEach((item) => {
        item.addEventListener("click", () => {
            const id = item.getAttribute("btn-ch-status"); 
            const status = item.getAttribute("status"); 
            const updateStatus = status === "active" ? "inactive" : "active"
            const path = `${window.location.origin}/${endpoint}/${id}`;
            console.log(path)
            fetch(path, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ status: updateStatus }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Có lỗi xảy ra khi cập nhật trạng thái.');
                }
                return response.json();
            })
            .then(data => {
                const status = data.product?.status;
                if (!status) {
                    console.error('Trạng thái sản phẩm không tồn tại.');
                    return;
                }
            
                item.innerHTML = status; 
                const inactiveClass = "badge-success";
                const activeClass = "badge-danger";
                console.log(status)
                if (status === "inactive") {
                    console.log("run here")
                    item.classList.remove(inactiveClass);
                    item.classList.add(activeClass);
                    
                } else {
                    item.classList.remove(activeClass);
                    item.classList.add(inactiveClass);
                }
                item.setAttribute("status",status)
            })
            .catch(error => {
                console.error('Lỗi:', error); 
            });
        });
    });
}

const inpPosition = document.querySelectorAll("[inp-position]");
if (inpPosition.length > 0) {
    inpPosition.forEach((item) => {
        item.addEventListener("change", () => {
            const value = item.value;
            const id = item.getAttribute("inp-position"); 
            const path = `${domain}/${endpoint}/${id}`; 
            fetch(path, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ position: value }) 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Có lỗi xảy ra khi cập nhật vị trí.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Cập nhật vị trí thành công:', data); 
            })
            .catch(error => {
                console.error('Lỗi:', error); 
            });
        });
    });
}
