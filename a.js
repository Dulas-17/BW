// --- Button Sound System ---
const sounds = {
  default: new Audio('click.mp3'),
  watchLater: new Audio('watchlater.mp3'),
  back: new Audio('back.mp3'),
  nav: new Audio('nav.mp3')
};

// Global listener for all buttons
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    let soundToPlay = sounds.default; // default for normal buttons

    if (e.target.classList.contains('watch-later-btn') || e.target.classList.contains('remove-watch-later-btn')) {
      soundToPlay = sounds.watchLater;
    } else if (e.target.classList.contains('back')) {
      soundToPlay = sounds.back;
    } else if (e.target.closest('nav')) {
      soundToPlay = sounds.nav;
    }

    try {
      soundToPlay.currentTime = 0; // reset if already playing
      soundToPlay.play();
    } catch (err) {
      console.error('Button sound error:', err);
    }
  }
});