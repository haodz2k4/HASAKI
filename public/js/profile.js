function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
  }
  document.addEventListener("DOMContentLoaded", () => {
    showSection('editProfile');
  });
function getDomain() {
  const domain = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol;
  let url = `${protocol}//${domain}`
  if(port){
    url += `:${port}`
  }
  return url
}
const inpDefaultAddress = document.querySelectorAll("[inp-default-address]");
inpDefaultAddress.forEach((item) => {
  item.addEventListener("click", () => {
    const id = document.querySelector("[my-user-id]").getAttribute("my-user-id")
    const defaultAddressIndex = parseInt(item.getAttribute("inp-default-address"));

    const domain = getDomain(); 
    const path = `${domain}/api/users/${id}`;
    console.log("Request Path:", path);

    fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        defaultAddressIndex: defaultAddressIndex
      })
    })
    .then(response => response.json().then(data => {
      console.log("Response Data:", data);
      if (response.ok) {
        alert("Cập nhật địa chỉ mặc định thành công");
      } else {
        alert("Cập nhật địa chỉ thất bại");
      }
    }))
    .catch(error => {
      console.error("Error:", error);
    });
  });
}); 

const btnRemoveAddress = document.querySelectorAll("[btn-remove-address]");
btnRemoveAddress.forEach((item) => {
  item.addEventListener("click", () => {
    const index = item.getAttribute("btn-remove-address");
    const formRemoveAddress = document.querySelector("[form-remove-address]");
    formRemoveAddress.action = `/users/remove-address/${index}?_method=DELETE`;
    formRemoveAddress.submit()
  })
})


const btnUpdatePassword = document.querySelector("[btn-update-password]");
btnUpdatePassword.addEventListener("click", () => {
  const formUpdatePassword = document.querySelector("[form-update-password]");
  formUpdatePassword.classList.toggle("d-none")
})


const iconOverrlay = document.querySelector(".icon-overlay");
const fileInput = document.querySelector("#fileInput");
if(iconOverrlay){
  
  iconOverrlay.addEventListener("click", () => {
    fileInput.click()
  })
}
fileInput.addEventListener("change", () => {
  const formSubmit = fileInput.closest("form");
  formSubmit.submit()
})
const tableAddress = document.querySelector("[table-address]");
const getInfoAddress = (index) => {
  const tr = tableAddress.querySelectorAll("tbody tr");
  console.log(tr)
  let street, city, country;
  console.log(tableAddress)
  tr.forEach((item, i) => {
    if (i === index) {
      console.log(item.querySelector("[street]"))
      street = item.querySelector("[street]").innerHTML;
      city = item.querySelector("[city]").innerHTML;
      country = item.querySelector("[country]").innerHTML;
    }
  });

  return {
    street,
    city,
    country
  };
}

const btnUpdateAddress = document.querySelectorAll("[btn-update-address]");
let lastClickedIndex = null;
btnUpdateAddress.forEach((item) => {
  item.addEventListener("click", () => {
    const index = parseInt(item.getAttribute("btn-update-address"));
    const formUpdateAddress = document.querySelector("[form-update-address]");
    if (index === lastClickedIndex) {
      formUpdateAddress.classList.toggle("d-none");
    } else {
      formUpdateAddress.classList.remove("d-none");
    }
    const {street, city, country} = getInfoAddress(index);
    formUpdateAddress.querySelector('input[name="street"]').setAttribute('value', street);
  formUpdateAddress.querySelector('input[name="city"]').setAttribute('value', city);
    formUpdateAddress.querySelector(`select option[value=${country}]`).setAttribute('selected', true) 
    formUpdateAddress.action = `/users/update-address/${index}?_method=PATCH`
    lastClickedIndex = index
  })
})