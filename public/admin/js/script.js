const url = new URL(window.location.href)
const domain = `http://localhost:3000`
const route = document.querySelector(".my-path")
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
//Limit 
const selectLimit = document.querySelector("[select-limit]");
if(selectLimit){
    selectLimit.addEventListener("change",() => {
        const value = selectLimit.value;
        if(value){
            url.searchParams.set("limit", value)
        }else{
            url.searchParams.delete("limit")
        }
        window.location.href = url.href
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
            const ep = route.getAttribute("path");
            const path = `${domain}/api/${ep}/${id}`;
            fetch(path, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ status: updateStatus }),
            })
            .then(response => {
                if (!response.ok) {
                    alert("Có lỗi xảy ra khi cập nhật trạng thái")
    
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
                if (status === "inactive") {
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
//Inp position 
const inpPosition = document.querySelectorAll("[inp-position]");
if (inpPosition.length > 0) {
    inpPosition.forEach((item) => {
        item.addEventListener("change", () => {
            const value = item.value;
            const id = item.getAttribute("inp-position"); 
            const ep = route.getAttribute("path");
            const path = `${domain}/api/${ep}/${id}`; 
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

//Filter 
const btnSelectFilter = document.querySelectorAll("[btn-select-filter]");
if(btnSelectFilter.length > 0){
    btnSelectFilter.forEach((item) => {
        item.addEventListener("click",() => {
            const value = item.getAttribute("btn-select-filter");
            
            const [keyFil, valFil] = value.split("-");
            const isSelected =url.searchParams.get(`${keyFil}`)
            if(isSelected && isSelected === valFil){
                url.searchParams.delete(`${keyFil}`)
            }else if(value){
                url.searchParams.set(`${keyFil}`, valFil);
            }else {
                url.searchParams.delete(`${keyFil}`)
            }
            window.location.href = url.href
            
        })
    })
}

//Sorting
const formSelectSorting = document.querySelector("[form-select-sorting]");

if(formSelectSorting){
    formSelectSorting.addEventListener("change",() => {
        const value = formSelectSorting.value;
        const [sortKey, sortValue] = value.split("-")
        if(value){
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue)
        }else {
            url.searchParams.delete("sortKey")
            url.searchParams.delete("sortValue")
        }
        window.location.href = url.href

    })
}

//select checkbox 
const tableManage = document.querySelector("[table-manage]")
if(tableManage){
    const checkAll = tableManage.querySelector("thead tr th input[type='checkbox']")
    const checkMulti = tableManage.querySelectorAll("tbody tr td input[type='checkbox']");
    checkAll.addEventListener("click",() => {
        if(checkAll.checked){
            for(const item of checkMulti){
                item.checked = true 
            }
        }else{
            for(const item of checkMulti){
                item.checked = false
            }
        }
    })
    for(const item of checkMulti){
        item.addEventListener("click",() => {
            const countChecked = tableManage.querySelectorAll("tbody tr td input[type='checkbox']:checked").length;
            if(countChecked === checkMulti.length){
                checkAll.checked = true 
            }
        })
    }

}

//change multi 
/*
    exampleData: 
    {
       ids: string[]
       data: Record<string, any>
    }
*/
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(e) => {
        e.preventDefault()
        const idsChecked = document.querySelectorAll("tbody tr td input[type='checkbox']:checked");
        const path = document.querySelector(".my-path").getAttribute("path");
        const ids = [];
        for(const item of idsChecked){
            ids.push(item.value);
        }
        const data = formChangeMulti.querySelector("select").value;
        const result = {
            ids,
            data
        }    
        const inp = formChangeMulti.querySelector("input");
        inp.value = JSON.stringify(result)
        formChangeMulti.action = `/admin/${path}/change-multi?_method=PATCH`
        
        formChangeMulti.submit();
    })
}

//Preview An Images 
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

if(imageInput){
    imageInput.addEventListener('change', function() {
        imagePreview.innerHTML = ''; 
        const files = this.files;
        
        if (files) {
            Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.appendChild(img);
            }
            reader.readAsDataURL(file);
            });
        }
        });
}
//Filter by category
const selectCategory = document.querySelector("[select-category]");
if(selectCategory){
    selectCategory.addEventListener("change",() => {
        const value = selectCategory.value;
        if(value){
            url.searchParams.set("categoryId", value)
        }else{
            url.searchParams.delete("categoryId")
        }
        window.location.href = url.href
    })
}

const btnExportExcel = document.querySelector("[btn-export-excel]");
if(btnExportExcel){
    btnExportExcel.addEventListener("click",() => {
        const formExportExcel = document.querySelector("[form-export-excel]");
        const input = formExportExcel.querySelector("input");
        const idsChecked = document.querySelectorAll("tbody tr td input[type='checkbox']:checked");
        const ids = []
        for(const item of idsChecked){
            ids.push(item.value);
        }
        input.value = JSON.stringify(ids);
        formExportExcel.submit()
    })
}