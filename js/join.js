const PROFILE_NAME_KEY = 'profileName';

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);

  if (!field || !error) {
    return;
  }

  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
  error.hidden = !message;
}

function setFormStatus(message, isSuccess = false) {
  const status = document.getElementById('form-status');

  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle('is-success', isSuccess);
  status.hidden = !message;
}

function readProfileName() {
  try {
    return localStorage.getItem(PROFILE_NAME_KEY) || '';
  } catch (error) {
    console.warn('Could not read profile name from localStorage.', error);
    return '';
  }
}

function saveProfileName(name) {
  try {
    localStorage.setItem(PROFILE_NAME_KEY, name);
  } catch (error) {
    console.warn('Could not save profile name to localStorage.', error);
  }
}

function validateEmail(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Email is required.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(trimmed) ? '' : 'Please enter a valid email address.';
}

function validateUsername(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Username is required.';
  }

  if (trimmed.length < 3) {
    return 'Username must be at least 3 characters.';
  }

  return '';
}

function validatePassword(value) {
  if (!value) {
    return 'Password is required.';
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Password must include letters and numbers.';
  }

  return '';
}

function validateFormData(formData) {
  return {
    email: validateEmail(formData.email),
    username: validateUsername(formData.username),
    password: validatePassword(formData.password),
    confirmPassword: formData.confirmPassword !== formData.password ? 'Passwords do not match.' : ''
  };
}

function updateFieldValidation(fieldId, value, currentPassword) {
  const form = document.getElementById('join-form');
  const data = Object.fromEntries(new FormData(form).entries());

  if (fieldId === 'email') {
    setFieldError(fieldId, validateEmail(data.email));
    return;
  }

  if (fieldId === 'username') {
    setFieldError(fieldId, validateUsername(data.username));
    return;
  }

  if (fieldId === 'password') {
    setFieldError(fieldId, validatePassword(data.password));
    setFieldError('confirmPassword', data.confirmPassword && data.confirmPassword !== data.password ? 'Passwords do not match.' : '');
    return;
  }

  if (fieldId === 'confirmPassword') {
    setFieldError(fieldId, data.confirmPassword && data.confirmPassword !== data.password ? 'Passwords do not match.' : '');
  }
}

function attachFieldValidation() {
  const fields = ['email', 'username', 'password', 'confirmPassword'];

  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if (!field) {
      return;
    }

    field.addEventListener('input', () => {
      updateFieldValidation(fieldId, field.value);
      setFormStatus('');
    });

    field.addEventListener('blur', () => {
      updateFieldValidation(fieldId, field.value);
    });
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form).entries());
  const errors = validateFormData(formData);

  Object.entries(errors).forEach(([fieldId, message]) => {
    setFieldError(fieldId, message);
  });

  if (Object.values(errors).some(Boolean)) {
    setFormStatus('Please fix the highlighted fields and try again.');
    return;
  }

  const username = formData.username.trim();
  saveProfileName(username);
  setFormStatus(`Welcome, ${username}! Your profile has been saved in this browser.`, true);
  form.reset();

  Object.keys(errors).forEach((fieldId) => setFieldError(fieldId, ''));
}

function initJoinPage() {
  const form = document.getElementById('join-form');

  if (!form) {
    return;
  }

  const savedName = readProfileName();

  if (savedName) {
    setFormStatus(`You are signed in as ${savedName}.`, true);
  }

  attachFieldValidation();
  form.addEventListener('submit', handleSubmit);
}

initJoinPage();
