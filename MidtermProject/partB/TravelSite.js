var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slides");
  if (n > slides.length) {
    slideIndex = 1;
  }    
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  
  if (slides[slideIndex-1] !== undefined) {
  slides[slideIndex-1].style.display = "block";  
  }
}

function slideshow() {
  setInterval(function(){ plusSlides(1); }, 3000);
}