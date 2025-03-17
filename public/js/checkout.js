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

const handleCheckout = document.querySelector("[handleCheckout]");
if(handleCheckout) {
  handleCheckout.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(handleCheckout);
    const paymentMethod = formData.get("paymentMethod");;
    if(paymentMethod === 'card_payment') {
      handleCheckout.action = '/checkout/order/momo/payment';
    }
    handleCheckout.submit()
  })
}