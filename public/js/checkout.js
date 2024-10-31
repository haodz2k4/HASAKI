function showPaymentModal() {
    var paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();
  } 

const btnShowAddress = document.querySelector("[btn-show-address]");
btnShowAddress.addEventListener("click",() => {
  const tableAddress = document.querySelector("[table-address]");
  tableAddress.classList.toggle("d-none");
  btnShowAddress.closest("address").querySelector("div").classList.toggle("d-none")
})