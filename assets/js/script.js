/* Google Forms setup:
   1. Create a Google Form with fields matching this enquiry form.
   2. In Google Forms, choose "Get pre-filled link" and inspect each entry.######## ID.
   3. Replace FORM_ACTION and every field value below.
   4. In Google Forms, enable email notifications for new responses to receive them in Gmail.
*/
const GOOGLE_FORM = {
  action: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse',
  fields: {
    name: 'entry.1111111111',
    phone: 'entry.2222222222',
    email: 'entry.3333333333',
    course: 'entry.4444444444',
    message: 'entry.5555555555'
  }
};

const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');
toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('enquiry-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  status.className = 'form-status';
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Please complete all required fields.';
    status.classList.add('error');
    return;
  }
  if (GOOGLE_FORM.action.includes('YOUR_FORM_ID')) {
    status.textContent = 'Form setup pending: add the Google Form ID and field IDs in script.js.';
    status.classList.add('error');
    return;
  }
  const data = new FormData();
  Object.entries(GOOGLE_FORM.fields).forEach(([localName, googleName]) => data.append(googleName, form.elements[localName].value));
  fetch(GOOGLE_FORM.action, { method: 'POST', mode: 'no-cors', body: data })
    .then(() => {
      form.reset();
      status.textContent = 'Thank you. Your enquiry has been sent successfully.';
      status.classList.add('success');
    })
    .catch(() => {
      status.textContent = 'We could not send your enquiry. Please call or email the admissions team.';
      status.classList.add('error');
    });
});
