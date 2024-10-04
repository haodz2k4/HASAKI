const url = new URL(window.location.href)
const domain = `http://localhost:3000`
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
            const path = `${window.location.origin}/api/products/${id}`;
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
                alert("Cập nhật sản phẩm thành công")
            })
            .catch(error => {
                console.error('Lỗi:', error); 
            });
        });
    });
}
