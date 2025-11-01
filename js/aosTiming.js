 AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // Custom delay pro elementy s delším zpožděním
  document.addEventListener('DOMContentLoaded', function() {
    const delayedElements = document.querySelectorAll('[data-aos-delay="4000"], [data-aos-delay="5000"]');
    
    delayedElements.forEach(element => {
      const delay = parseInt(element.getAttribute('data-aos-delay'));
      element.style.opacity = '0';
      element.style.visibility = 'hidden';
      
      setTimeout(() => {
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.removeAttribute('data-aos-delay');
        AOS.refresh();
      }, delay);
    });
  });