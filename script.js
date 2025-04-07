// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Mobile navigation toggle
const createMobileNav = () => {
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav-links");

  // Create hamburger button
  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.innerHTML = '<i class="fas fa-bars"></i>';

  // Add mobile nav functionality
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.querySelector("i").classList.toggle("fa-bars");
    hamburger.querySelector("i").classList.toggle("fa-times");
  });

  // Add hamburger button to nav
  nav.appendChild(hamburger);

  // Close mobile nav when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      hamburger.querySelector("i").classList.add("fa-bars");
      hamburger.querySelector("i").classList.remove("fa-times");
    }
  });
};

// Form submission handling with validation
const initializeForm = () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const validatePhone = (phone) => {
    // בדיקת תקינות מספר טלפון ישראלי
    const phoneRegex =
      /^((\+972|972)|0)( |-)?([1-468-9]( |-)?\d{7}|(5|7)[0-9]( |-)?\d{7})$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields
    const nameInput = form.querySelector('input[type="text"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const emailInput = form.querySelector('input[type="email"]');
    const serviceSelect = form.querySelector("select");
    const messageInput = form.querySelector("textarea");

    // Validate inputs
    let isValid = true;
    let errorMessage = "";

    if (nameInput.value.length < 2) {
      isValid = false;
      errorMessage = "אנא הזן שם מלא";
    } else if (!validatePhone(phoneInput.value)) {
      isValid = false;
      errorMessage = "אנא הזן מספר טלפון תקין";
    } else if (emailInput.value && !validateEmail(emailInput.value)) {
      isValid = false;
      errorMessage = "אנא הזן כתובת אימייל תקינה";
    } else if (!serviceSelect.value) {
      isValid = false;
      errorMessage = "אנא בחר סוג שירות";
    } else if (messageInput.value.length < 10) {
      isValid = false;
      errorMessage = "אנא הוסף פרטים נוספים להזמנה";
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    // Get form data
    const formData = {
      name: nameInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      service: serviceSelect.value,
      message: messageInput.value,
      timestamp: new Date().toISOString(),
    };

    // Here you would typically send the data to a server
    console.log("Form submitted:", formData);

    // Show success message
    alert("תודה על פנייתך! נחזור אליך בהקדם.");
    form.reset();
  });
};

// Add scroll animations
const initializeScrollAnimations = () => {
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".service-card, .vehicle-card");
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Initial check
};

// Header scroll effect
const initializeHeaderEffect = () => {
  const header = document.querySelector("header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.classList.remove("scroll-up");
      return;
    }

    if (
      currentScroll > lastScroll &&
      !header.classList.contains("scroll-down")
    ) {
      // Scrolling down
      header.classList.remove("scroll-up");
      header.classList.add("scroll-down");
    } else if (
      currentScroll < lastScroll &&
      header.classList.contains("scroll-down")
    ) {
      // Scrolling up
      header.classList.remove("scroll-down");
      header.classList.add("scroll-up");
    }

    lastScroll = currentScroll;
  });
};

// Gallery Lightbox Functionality
const initGallery = () => {
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryItems.length === 0) return;

  // Create lightbox container
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";

  const lightboxContent = document.createElement("div");
  lightboxContent.className = "lightbox-content";

  const lightboxImg = document.createElement("img");
  lightboxImg.className = "lightbox-img";

  const lightboxClose = document.createElement("span");
  lightboxClose.className = "lightbox-close";
  lightboxClose.innerHTML = "&times;";

  const lightboxPrev = document.createElement("span");
  lightboxPrev.className = "lightbox-prev";
  lightboxPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';

  const lightboxNext = document.createElement("span");
  lightboxNext.className = "lightbox-next";
  lightboxNext.innerHTML = '<i class="fas fa-chevron-right"></i>';

  lightboxContent.appendChild(lightboxImg);
  lightboxContent.appendChild(lightboxClose);
  lightboxContent.appendChild(lightboxPrev);
  lightboxContent.appendChild(lightboxNext);
  lightbox.appendChild(lightboxContent);
  document.body.appendChild(lightbox);

  let currentIndex = 0;

  // Open lightbox
  const openLightbox = (index) => {
    currentIndex = index;
    const imgSrc = galleryItems[index].querySelector("img").src;
    const imgAlt = galleryItems[index].querySelector("img").alt;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  // Close lightbox
  const closeLightbox = () => {
    lightbox.classList.remove("active");
    setTimeout(() => {
      lightboxImg.src = "";
      document.body.style.overflow = ""; // Enable scrolling
    }, 300);
  };

  // Navigate to previous image
  const prevImage = () => {
    currentIndex =
      (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    const imgSrc = galleryItems[currentIndex].querySelector("img").src;
    const imgAlt = galleryItems[currentIndex].querySelector("img").alt;

    // Add fade effect
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      lightboxImg.style.opacity = 1;
    }, 200);
  };

  // Navigate to next image
  const nextImage = () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    const imgSrc = galleryItems[currentIndex].querySelector("img").src;
    const imgAlt = galleryItems[currentIndex].querySelector("img").alt;

    // Add fade effect
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      lightboxImg.style.opacity = 1;
    }, 200);
  };

  // Add event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", prevImage);
  lightboxNext.addEventListener("click", nextImage);

  // Close lightbox when clicking outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    } else if (e.key === "ArrowRight") {
      nextImage();
    }
  });
};

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  createMobileNav();
  initializeForm();
  initializeScrollAnimations();
  initializeHeaderEffect();
  initGallery(); // Initialize gallery
});
