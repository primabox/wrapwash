// Simple lightbox for portfolio
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Open lightbox on portfolio item click
document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('.portfolio-image');
    lightboxImg.src = img.src;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
});

// Close lightbox on click
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
