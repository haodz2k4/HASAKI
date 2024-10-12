const slides = document.querySelectorAll('.banner-slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentSlide = 0;
let slideInterval;


function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

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
function showSuggestions() {
  const searchInput = document.getElementById('searchInput').value;
  const suggestionsBox = document.getElementById('suggestionsBox');

  if (searchInput.length > 0) {
      suggestionsBox.classList.remove('d-none');
  } else {
      suggestionsBox.classList.add('d-none');
  }
}
showSuggestions()

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
