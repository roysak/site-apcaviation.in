// Simple script to toggle the mobile menu
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
});

// Close mobile menu when a link is clicked
const mobileLinks = menu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
    });
});

document.querySelectorAll('section#events').forEach(section => {
    const list = section.querySelector('[data-events-list]');
    const empty = section.querySelector('[data-events-empty]');
    const buttons = section.querySelectorAll('[data-events-view]');
    if (!list || !empty || !buttons.length) return;

    buttons.forEach(button => button.addEventListener('click', () => {
        const showEmpty = button.dataset.eventsView === 'empty';
        list.hidden = showEmpty;
        empty.hidden = !showEmpty;
        buttons.forEach(option => {
            const selected = option === button;
            option.setAttribute('aria-pressed', String(selected));
            option.classList.toggle('bg-brand-navy', selected);
            option.classList.toggle('text-white', selected);
            option.classList.toggle('bg-brand-light', !selected);
            option.classList.toggle('text-brand-navy', !selected);
        });
    }));
});

const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) {
const formStatus = document.getElementById('form-status');
const submitButton = document.getElementById('form-submit');
const formTarget = document.querySelector('iframe[name="google-form-target"]');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
let submissionPending = false;

const validateName = () => {
    const value = nameInput.value.trim();
    const letterCount = (value.match(/\p{L}/gu) || []).length;
    const containsOnlyNameCharacters = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(value);

    if (!value) {
        nameInput.setCustomValidity('Please enter your full name.');
    } else if (letterCount < 2 || !containsOnlyNameCharacters) {
        nameInput.setCustomValidity('Enter a valid name using at least two letters.');
    } else {
        nameInput.setCustomValidity('');
    }
};

const validatePhone = () => {
    const compactNumber = phoneInput.value.replace(/[\s-]/g, '');
    const indianMobilePattern = /^(?:\+?91)?[6-9]\d{9}$/;

    if (!phoneInput.value.trim()) {
        phoneInput.setCustomValidity('Please enter your phone number.');
    } else if (!indianMobilePattern.test(compactNumber)) {
        phoneInput.setCustomValidity('Enter a valid mobile number.');
    } else {
        phoneInput.setCustomValidity('');
    }
};

nameInput.addEventListener('input', validateName);
phoneInput.addEventListener('input', validatePhone);
nameInput.addEventListener('invalid', validateName);
phoneInput.addEventListener('invalid', validatePhone);

enquiryForm.addEventListener('submit', (event) => {
    validateName();
    validatePhone();

    if (!enquiryForm.checkValidity()) {
        event.preventDefault();
        enquiryForm.reportValidity();
        return;
    }

    nameInput.value = nameInput.value.trim().replace(/\s+/g, ' ');
    phoneInput.value = phoneInput.value.replace(/[\s-]/g, '').replace(/^(?:\+?91)/, '');
    submissionPending = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formStatus.className = 'min-h-6 text-sm text-gray-600';
    formStatus.textContent = 'Sending your enquiry...';
});

formTarget.addEventListener('load', () => {
    if (!submissionPending) return;

    submissionPending = false;
    enquiryForm.reset();
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Enquiry';
    formStatus.className = 'min-h-6 text-sm text-green-700';
    formStatus.textContent = 'Thank you. Your enquiry has been sent successfully.';
});
}
