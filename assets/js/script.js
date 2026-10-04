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
const resultFrame = document.getElementById('enquiry-result-frame');
const requestIdInput = document.getElementById('enquiry-request-id');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const courseInput = document.getElementById('course');
const courseBySlug = {
    'airport-management-diploma': 'International Diploma in Airport Management',
    'airport-management-bba': 'BBA with Airport Management',
    'logistics-management-diploma': 'International Diploma in Logistics Management',
    'logistics-management-bba': 'BBA with Logistics Management',
    'front-office-management-diploma': 'Diploma in Front Office Management'
};
const selectedCourse = courseBySlug[new URLSearchParams(window.location.search).get('course')];
if (selectedCourse) courseInput.value = selectedCourse;
const newRequestId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)),
    byte => byte.toString(16).padStart(2, '0')).join('');
const handshakeId = newRequestId();
let inlineResultReady = false;
let pendingRequestId = '';
let responseTimeout;

window.addEventListener('message', (event) => {
    const trustedOrigin = event.origin === 'https://script.google.com' ||
        /^https:\/\/[a-z0-9-]+-script\.googleusercontent\.com$/.test(event.origin);
    const result = event.data;
    if (!trustedOrigin || !result || result.source !== 'apc-enquiry') return;

    if (result.status === 'ready') {
        if (result.requestId === handshakeId) {
            inlineResultReady = true;
        }
        return;
    }

    if (!['success', 'error'].includes(result.status) ||
        !pendingRequestId || result.requestId !== pendingRequestId) return;
    clearTimeout(responseTimeout);
    pendingRequestId = '';
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Enquiry';

    if (result.status === 'success') {
        enquiryForm.reset();
        formStatus.className = 'min-h-6 text-sm text-green-700';
        formStatus.textContent = 'Thank you. Your enquiry has been submitted. We will contact you soon.';
    } else {
        formStatus.className = 'min-h-6 text-sm text-red-700';
        formStatus.textContent = 'Your enquiry could not be submitted. Please check your details and try again.';
    }
});

// Submit only after the deployed script confirms it can report an in-page result.
const handshakeUrl = new URL(enquiryForm.action);
handshakeUrl.searchParams.set('handshake', handshakeId);
resultFrame.src = handshakeUrl.href;

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
    if (!inlineResultReady) {
        event.preventDefault();
        formStatus.className = 'min-h-6 text-sm text-red-700';
        formStatus.textContent = 'The enquiry service is unavailable right now. Please call or email us.';
        return;
    }

    formStatus.className = 'min-h-6 text-sm text-gray-600';
    pendingRequestId = newRequestId();
    requestIdInput.value = pendingRequestId;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formStatus.textContent = 'Sending your enquiry...';
    responseTimeout = setTimeout(() => {
        pendingRequestId = '';
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Enquiry';
        formStatus.className = 'min-h-6 text-sm text-red-700';
        formStatus.textContent = 'We could not confirm whether your enquiry was saved. Please contact us before submitting again.';
    }, 30000);
});
}
