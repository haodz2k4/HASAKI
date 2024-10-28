

const url = new URL(window.location.href)

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

console.log(getDomain())

const slides = document.querySelectorAll('.banner-slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentSlide = 0;
let slideInterval;


if(slides.length > 0) {
  if(prevBtn){
    prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
    showSlide(currentSlide);
    resetAutoSlide();
});

}

if(nextBtn){
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
        showSlide(currentSlide);
        resetAutoSlide();
    });
}

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
  }
  function autoSlide() {
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
      showSlide(currentSlide);
    }, 3000);
  }
  
  function resetAutoSlide() {
    clearInterval(slideInterval);
    autoSlide();
  }
  
  
  autoSlide();
}





//Logout feature
const btnLogout = document.querySelector("[btn-logout]");
if(btnLogout){
  btnLogout.addEventListener("click",() => {
    const isConfirm = confirm("Bạn có chắc muốn đăng xuất không")
    if(isConfirm){
      const formLogout = document.querySelector("[form-logout]")
      formLogout.submit();
    }
    
  })
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener("input", async () => {
    const suggestionsBox = document.getElementById('suggestionsBox');
    const value = searchInput.value.trim();

    if (value.length === 0) {
      suggestionsBox.innerHTML = '';
      return;
    }
    console.log(getDomain())
    try {
     
      const endpoint = `${getDomain()}/api/products?keyword=${value}&only=title thumbnail slug&limit=5`;
      console.log(endpoint)
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(data)
      
      if (data && data.products && data.products.length > 0) {
        suggestionsBox.innerHTML = `<ul>` +
          data.products.map(product => `
            <li>
              <img src="${product.thumbnail.length > 0 ? product.thumbnail[0] : 'https://via.placeholder.com/30' }" alt="${product.title}" width="30" height="30"/>
              <a href="/products/${product.slug}" style='text-decoration: none; color: black'> ${product.title} </a>
            </li>
          `).join('') +
          `</ul>`;
      } else {
        suggestionsBox.innerHTML = `<p>Không có gợi ý nào</p>`;
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  });
}


const timeOutAlert = document.querySelector("[timeout-alert]");

if(timeOutAlert){
  setTimeout(() => {
    timeOutAlert.classList.add("d-none")
  }, 3000)
}

function changeImage(thumbnail) {
  const mainImage = document.getElementById('mainImage');
  const tempSrc = mainImage.src;
  mainImage.src = thumbnail.src;
  thumbnail.src = tempSrc;
}

function showOverlay(imageSrc) {
  const overlay = document.getElementById('imageOverlay');
  const overlayImage = document.getElementById('overlayImage');
  overlayImage.src = imageSrc;
  overlay.style.display = 'flex';
}

function hideOverlay() {
  const overlay = document.getElementById('imageOverlay');
  overlay.style.display = 'none';
}

function changeOverlayImage(thumbnail) {
  const overlayImage = document.getElementById('overlayImage');
  overlayImage.src = thumbnail.src;
}

const countdownDate = new Date().getTime() + 12 * 60 * 60 * 1000; 

const timer = setInterval(function () {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const countDown = document.getElementById('countdown-timer')
  if(countDown){
    countDown.innerHTML =
    '0 : ' +
    (hours < 10 ? '0' + hours : hours) +
    ' : ' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ' : ' +
    (seconds < 10 ? '0' + seconds : seconds);
    if (distance < 0) {
      clearInterval(timer);
      document.getElementById('countdown-timer').innerHTML = 'Hết giờ';
    }
  }
  
}, 1000);

function changeColor(color) {
  document.getElementById('selectedColor').innerText = color;
}

const btnPagination = document.querySelectorAll("[btn-pagination]");
if(btnPagination.length > 0){
  btnPagination.forEach((item) => {
    item.addEventListener("click",() => {
      const page = item.getAttribute("btn-pagination");
      
      if(page){
        url.searchParams.set("page", page)
      }
      if(page === '1'){
        url.searchParams.delete("page")
      }
      window.location.href = url.href
    })
  })
}

const formSearch = document.querySelector("[form-search]");
if(formSearch){
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = formSearch.querySelector("input");

    const keyword = input.value.trim();
    const currentUrl = window.location.origin + "/products"; 
    
    const url = new URL(currentUrl);

    if(keyword){
      url.searchParams.set('keyword', keyword); 
    } else {
      url.searchParams.delete('keyword'); 
    }
    window.location.href = url.href;  
  });
}


const selectLimit = document.querySelector("[select-limit]");
if(selectLimit){
  selectLimit.addEventListener("change",() => {
    const limit = selectLimit.value;
    url.searchParams.set("limit",limit);
    window.location.href = url.href
  })
} 


const btnAddToCart = document.querySelectorAll("[btn-add-cart]");
if(btnAddToCart.length > 0){
  btnAddToCart.forEach((item) => {
    item.addEventListener("click",() =>{
      const id = item.getAttribute("btn-add-cart");
      const formAddCart = document.querySelector("[form-add-cart]")
      const input = formAddCart.querySelector("input");
      const path = formAddCart.getAttribute("path");
      const productQuantity = document.querySelector(".product-quantity")
      let quantity = 1;
      if(productQuantity){
        quantity = productQuantity.querySelector("input").value;
      }
      formAddCart.action = `${path}${id}`;
      if(quantity) {
        input.value = quantity 
      }
      formAddCart.submit()
      
    })
  })
} 

const btnFavoriteList = document.querySelector("[btn-favorite-list]");
if(btnFavoriteList){
  btnFavoriteList.addEventListener("click",() => {
    const id = btnFavoriteList.getAttribute("btn-favorite-list")
    const formFavoriteList = document.querySelector("[form-favorite-list]");
    formFavoriteList.action = `/products/favorite-list/toggle/${id}?_method=PATCH`
    formFavoriteList.submit()
  })
}