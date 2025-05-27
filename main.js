// Theme Switching
function initTheme() {
    // Check for saved theme preference, default to dark if none found
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme on page load
initTheme();

// Theme toggle functionality
document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Lightbox functionality for project images
function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Fermer">&times;</button>
            <button class="lightbox-prev" aria-label="Précédent">&larr;</button>
            <button class="lightbox-next" aria-label="Suivant">&rarr;</button>
            <img src="" alt="Capture d'écran du projet">
        </div>
    `;
    document.body.appendChild(lightbox);
    return lightbox;
}

const lightbox = createLightbox();
let currentGallery = [];
let currentIndex = 0;

// Add click handlers to all gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        // Get all images in the current project gallery
        const gallery = this.closest('.gallery-grid');
        currentGallery = Array.from(gallery.querySelectorAll('.gallery-item'));
        currentIndex = currentGallery.indexOf(this);
        showImage(currentIndex);
        lightbox.classList.add('active');
    });
});

// Lightbox controls
lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showImage(currentIndex);
});

lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showImage(currentIndex);
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            showImage(currentIndex);
            break;
        case 'ArrowRight':
            currentIndex = (currentIndex + 1) % currentGallery.length;
            showImage(currentIndex);
            break;
        case 'Escape':
            lightbox.classList.remove('active');
            break;
    }
});

function showImage(index) {
    const img = lightbox.querySelector('img');
    img.src = currentGallery[index].src;
    img.alt = currentGallery[index].alt;
}

// Form submission handling with validation
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate form
    if (!name || !email || !message) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Veuillez entrer une adresse e-mail valide', 'error');
        return;
    }
    
    // Here you would typically send this data to a server
    console.log('Formulaire envoyé:', { name, email, message });
    
    // Clear form
    this.reset();
    showNotification('Merci pour votre message ! Je vous répondrai bientôt.', 'success');
});

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll behavior
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});
