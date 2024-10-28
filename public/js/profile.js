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