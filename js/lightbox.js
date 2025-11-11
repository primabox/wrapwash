// Simple lightbox for portfolio
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Open lightbox on portfolio item click. If the item has a data-full attribute,
// use that image path for the lightbox; otherwise fall back to the thumbnail src.
document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('click', (e) => {
    // find custom full image path on the item
    const fullPath = item.dataset.full;
    const thumb = item.querySelector('.portfolio-image');

    if (fullPath && fullPath.length) {
      lightboxImg.src = fullPath;
    } else if (thumb) {
      lightboxImg.src = thumb.src;
    }

    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
});

// Close lightbox on click (outside image)
lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.style.display === 'block') {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }
});
