async function fetchData(url, dataKey) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Lỗi mạng");
        
        const data = await response.json();
        
        if (!data[dataKey] || !Array.isArray(data[dataKey])) {
            console.error(`Dữ liệu nhận được không đúng định dạng:`, data);
            return [];
        }
        
        return data[dataKey]; 
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
        return []; 
    }
}

async function setupSuggestions() {
   
    const products = await fetchData('/api/products', 'products'); 
    const suppliers = await fetchData('/api/suppliers', 'suppliers'); 
    
    const productSearch = document.getElementById("productSearch");
    const productSuggestions = document.getElementById("productSuggestions");
    const productId = document.getElementById("productId");
    
    productSearch.addEventListener("input", () => {
        
        showSuggestions(productSearch, products, productSuggestions, productId, "_id", "title");
    });


    const supplierSearch = document.getElementById("supplierSearch");
    const supplierSuggestions = document.getElementById("supplierSuggestions");
    const supplierId = document.getElementById("supplierId");
    
    supplierSearch.addEventListener("input", () => {
        showSuggestions(supplierSearch, suppliers, supplierSuggestions, supplierId, "_id", "name");
    });
}

function showSuggestions(inputElement, suggestions, suggestionsContainer, hiddenInput, idField, nameField) {
    const query = inputElement.value.toLowerCase();
    const filteredSuggestions = suggestions.filter(item => item[nameField].toLowerCase().includes(query));
    
    suggestionsContainer.innerHTML = "";

    filteredSuggestions.forEach(item => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("inventory-form-suggestion-item");
        suggestionItem.textContent = item[nameField];
        suggestionItem.addEventListener("click", () => {
            inputElement.value = item[nameField]; 
            hiddenInput.value = item[idField]; 
            suggestionsContainer.innerHTML = "";
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

setupSuggestions();
