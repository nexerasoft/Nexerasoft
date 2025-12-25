function openBrief() {
    document.getElementById("briefOverlay").style.display = "flex";
}

function closeBrief() {
    document.getElementById("briefOverlay").style.display = "none";
}

function sendEmail() {
    const name = document.getElementById("name").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    /* ===== EMPTY FIELD CHECK ===== */
    if (!name || !contact || !email || !message) {
        alert("All fields are mandatory");
        return;
    }

    /* ===== PHONE NUMBER VALIDATION ===== */
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contact)) {
        alert("Please enter a valid 10-digit phone number");
        return;
    }

    /* ===== GMAIL VALIDATION ===== */
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        alert("Please enter a valid Gmail address (example@gmail.com)");
        return;
    }

    /* ===== EMAIL BODY ===== */
    const body = encodeURIComponent(
        `Name: ${name}\nContact: ${contact}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    /* ===== OPEN GMAIL ONLY AFTER VALIDATION ===== */
    window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=himabindhupilla@gmail.com&su=New Inquiry&body=${body}`,
        "_blank"
    );
  }

/* ===== SLIDER ===== 
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
let index = 0;

slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showSlide(i));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[i].classList.add('active');
    dots[i].classList.add('active');
    index = i;
}

setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
}, 4000); */
