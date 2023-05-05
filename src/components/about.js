const buttons = document.querySelectorAll('.img-slider-button');
const slides = document.querySelector('#slides');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const findNext = button.classList.contains('next') ? 1 : -1;
    const activeSlide = slides.querySelector('.active-slide');
    let newIndex = Array.from(slides.children).indexOf(activeSlide) + findNext;

    if (newIndex < 0) {
      newIndex = slides.children.length - 1;
    } else if (newIndex >= slides.children.length) {
      newIndex = 0;
    }

    activeSlide.classList.remove('active-slide');
    slides.children[newIndex].classList.add('active-slide');
  });
});

