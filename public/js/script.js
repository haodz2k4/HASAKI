
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
     
      const endpoint = `${getDomain()}/api/products?keyword=${value}&only=title thumbnail&limit=5`;
      console.log(endpoint)
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(data)
      
      if (data && data.products && data.products.length > 0) {
        suggestionsBox.innerHTML = `<ul>` +
          data.products.map(product => `
            <li>
              <img src="${product.thumbnail.length > 0 ? product.thumbnail[0] : 'https://via.placeholder.com/30' }" alt="${product.title}" width="30" height="30"/>
              ${product.title}
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

// Thiết lập thời gian kết thúc (ví dụ: sau 12 giờ từ hiện tại)
const countdownDate = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 giờ từ bây giờ

const timer = setInterval(function () {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  // Tính toán giờ, phút, giây còn lại
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Hiển thị đồng hồ đếm ngược
  document.getElementById('countdown-timer').innerHTML =
    '0 : ' +
    (hours < 10 ? '0' + hours : hours) +
    ' : ' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ' : ' +
    (seconds < 10 ? '0' + seconds : seconds);

  // Nếu hết thời gian, dừng đồng hồ và hiển thị thông báo
  if (distance < 0) {
    clearInterval(timer);
    document.getElementById('countdown-timer').innerHTML = 'Hết giờ';
  }
}, 1000);

function changeColor(color) {
  document.getElementById('selectedColor').innerText = color;
}
