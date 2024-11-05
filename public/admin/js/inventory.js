
const products = [
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
    { id: 3, name: "Product C" },
    { id: 4, name: "Product D" }
];
const suppliers = [
    { id: 10, name: "Supplier X" },
    { id: 11, name: "Supplier Y" },
    { id: 12, name: "Supplier Z" }
];

function showSuggestions(inputElement, suggestions, suggestionsContainer, hiddenInput) {
    const query = inputElement.value.toLowerCase();
    const filteredSuggestions = suggestions.filter(item => item.name.toLowerCase().includes(query));
    
    suggestionsContainer.innerHTML = "";

    filteredSuggestions.forEach(item => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("inventory-form-suggestion-item");
        suggestionItem.textContent = item.name;
        suggestionItem.addEventListener("click", () => {
            inputElement.value = item.name; 
            hiddenInput.value = item.id; 
            suggestionsContainer.innerHTML = "";
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

const productSearch = document.getElementById("productSearch");
const productSuggestions = document.getElementById("productSuggestions");
const productId = document.getElementById("productId");
productSearch.addEventListener("input", () => showSuggestions(productSearch, products, productSuggestions, productId));

const supplierSearch = document.getElementById("supplierSearch");
const supplierSuggestions = document.getElementById("supplierSuggestions");
const supplierId = document.getElementById("supplierId");
supplierSearch.addEventListener("input", () => showSuggestions(supplierSearch, suppliers, supplierSuggestions, supplierId))