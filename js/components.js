const PROFILE_STORAGE_KEY = 'profileName';

async function loadPartial(selector, url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} → HTTP ${response.status}`);
  }

  const target = document.querySelector(selector);

  if (!target) {
    throw new Error(`Selector not found: ${selector}`);
  }

  target.innerHTML = await response.text();
}

/* Reads the name saved by the join form. Storage can throw in private
   browsing, and the stored value may be missing, so both are handled. */
function getProfileName() {
  try {
    const savedName = localStorage.getItem(PROFILE_STORAGE_KEY);
    return typeof savedName === 'string' ? savedName.trim() : '';
  } catch (error) {
    console.warn('Could not read the profile name from localStorage.', error);
    return '';
  }
}

function clearProfileName() {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    console.warn('Could not clear the profile name.', error);
  }
}

/* Fills the empty #profileSlot in the fetched header. The name comes from
   the user, so it is written with textContent and never with innerHTML. */
function renderProfileSlot() {
  const slot = document.querySelector('#profileSlot');

  if (!slot) {
    return;
  }

  slot.textContent = '';
  const name = getProfileName();

  // No profile yet: leave the slot empty. The Join link in the nav is the way in.
  if (!name) {
    return;
  }

  const greeting = document.createElement('span');
  greeting.className = 'profile-name';
  greeting.textContent = `Hi, ${name}`;

  const signOutButton = document.createElement('button');
  signOutButton.type = 'button';
  signOutButton.className = 'profile-signout';
  signOutButton.textContent = 'Sign out';
  signOutButton.addEventListener('click', () => {
    clearProfileName();
    renderProfileSlot();

    if (typeof renderHomeGreeting === 'function') {
      renderHomeGreeting();
    }
  });

  slot.append(greeting, signOutButton);
}

/* Underlines the nav link for the page you are on. recipe.html counts as
   Recipes, since it has no nav entry of its own. */
function markActiveLink() {
  const fileName = window.location.pathname.split('/').pop() || 'index.html';
  const currentPage = fileName === 'recipe.html' ? 'recipes.html' : fileName;

  document.querySelectorAll('.main-nav a, .footer-nav a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

Promise.all([
  loadPartial('#site-header', 'components/header.html'),
  loadPartial('#site-footer', 'components/footer.html')
])
  .then(() => {
    markActiveLink();
    renderProfileSlot();
  })
  .catch((err) => {
    console.error('Partials failed:', err);
  });
