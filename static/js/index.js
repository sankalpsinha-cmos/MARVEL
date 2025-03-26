


function copyText(elementId, buttonId) {
  const textToCopy = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(textToCopy).then(() => {
      // Change the button text to a tick mark
      const button = document.getElementById(buttonId);
      button.innerHTML = "✅ Copied!";
      button.disabled = true; // Disable the button temporarily

      // Revert back to original text after 3 seconds
      setTimeout(() => {
          button.innerHTML = "📋";
          button.disabled = false;
      }, 1000);
  }).catch(err => {
      console.error('Error copying text: ', err);
  });
}


// window.onload = function () {
//   let currentSlide = 0;
//   const slides = document.querySelectorAll('.slide');
//   const totalSlides = slides.length;

//   function showSlide(index) {
//     if (slides.length === 0) return;

//     slides.forEach((slide, i) => {
//       slide.style.display = i === index ? "block" : "none"; // Show only the active slide
//     });
//   }

//   function nextSlide() {
//     currentSlide = (currentSlide + 1) % totalSlides;
//     showSlide(currentSlide);
//   }

//   function prevSlide() {
//     currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
//     showSlide(currentSlide);
//   }

//   // Attach event listeners to buttons
//   document.querySelector(".slider-btn.left").addEventListener("click", prevSlide);
//   document.querySelector(".slider-btn.right").addEventListener("click", nextSlide);

//   showSlide(currentSlide); // Show the first slide
// };

window.onload = function () {
  let currentIndex = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  function showSlide(index) {
    // Wrap around if index is out of range
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentIndex = index;

    // Hide all slides and remove 'active' class from dots
    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    // Show the current slide and highlight the current dot
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function goToSlide(index) {
    showSlide(index);
  }

  // Attach event listeners to buttons
  document.querySelector(".slider-btn.left").addEventListener("click", prevSlide);
  document.querySelector(".slider-btn.right").addEventListener("click", nextSlide);

  // Make dots clickable by adding event listeners to each dot
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  // Initialize slider
  showSlide(currentIndex);
}
