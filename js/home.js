const RECOMMENDED_IDS = [
  'salt-licorice',
  'chocolate-banana',
  'raspberry-lime-sorbet'
];
const FAVORITES_KEY = 'favoriteRecipes';

function getCategoryLabel(category) {
  const map = {
    classic: 'Classic',
    protein: 'Protein',
    sorbet: 'Sorbet'
  };

  return map[category] || category;
}

function readFavorites() {
  try {
    const rawValue = localStorage.getItem(FAVORITES_KEY);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => typeof item === 'string' && item.length > 0)
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 12);
  } catch (error) {
    console.warn('Could not read favorites from localStorage.', error);
    return [];
  }
}

function saveFavorites(nextFavorites) {
  const uniqueFavorites = [...new Set(nextFavorites)];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(uniqueFavorites));
}

function createRecipeCard(recipe, isFavorite) {
  const article = document.createElement('article');
  article.className = 'recipe-card';

  const link = document.createElement('a');
  link.href = `recipe.html?id=${recipe.id}`;
  link.className = 'recipe-card-link';
  link.setAttribute('aria-label', `Read recipe: ${recipe.title}`);

  const imageWrap = document.createElement('div');
  imageWrap.className = 'recipe-image-wrap';

  const image = document.createElement('img');
  image.src = recipe.image;
  image.alt = recipe.imageAlt || recipe.title;
  image.className = 'recipe-image';

  const chip = document.createElement('span');
  chip.className = 'recipe-category';
  chip.textContent = getCategoryLabel(recipe.category);

  const content = document.createElement('div');
  content.className = 'recipe-content';

  const title = document.createElement('h3');
  title.className = 'recipe-title';
  title.textContent = recipe.title;

  const summary = document.createElement('p');
  summary.className = 'recipe-summary';
  summary.textContent = recipe.summary;

  const meta = document.createElement('p');
  meta.className = 'recipe-meta';
  meta.textContent = `${recipe.freezeHours}h freeze • ${recipe.spinCycle}`;

  imageWrap.appendChild(image);
  content.append(title, summary, meta);
  link.append(imageWrap, chip, content);

  const favoriteButton = document.createElement('button');
  favoriteButton.type = 'button';
  favoriteButton.className = 'favorite-toggle';
  favoriteButton.dataset.recipeId = recipe.id;
  favoriteButton.setAttribute('aria-label', isFavorite ? `Remove ${recipe.title} from favorites` : `Save ${recipe.title} to favorites`);
  favoriteButton.setAttribute('aria-pressed', String(isFavorite));
  favoriteButton.textContent = isFavorite ? '♥' : '♡';
  favoriteButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const current = readFavorites();
    const nextFavorites = current.includes(recipe.id)
      ? current.filter((id) => id !== recipe.id)
      : [...current, recipe.id];

    saveFavorites(nextFavorites);
    renderHomePage();
  });

  article.append(link, favoriteButton);
  return article;
}

function renderCards(selector, recipes, favoriteIds) {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!recipes.length) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';

    emptyState.textContent = selector === '#favorites-grid'
      ? 'No favorites saved yet. Use the heart on a recipe to save it.'
      : 'No recommendations available right now.';

    container.appendChild(emptyState);
    return;
  }

  recipes.forEach((recipe) => {
    container.appendChild(createRecipeCard(recipe, favoriteIds.includes(recipe.id)));
  });
}

function renderHomePage() {
  const recommendedGrid = document.querySelector('#recommended-grid');
  const favoritesGrid = document.querySelector('#favorites-grid');

  if (!recommendedGrid || !favoritesGrid) {
    return;
  }

  fetch('data/recipes.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Recipes request failed: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      const recipes = data.recipes || [];
      const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));
      const favoriteIds = readFavorites();
      const recommendedRecipes = RECOMMENDED_IDS
        .map((recipeId) => recipeMap.get(recipeId))
        .filter(Boolean);
      const favoriteRecipes = favoriteIds
        .map((recipeId) => recipeMap.get(recipeId))
        .filter(Boolean);

      renderCards('#recommended-grid', recommendedRecipes, favoriteIds);
      renderCards('#favorites-grid', favoriteRecipes, favoriteIds);
    })
    .catch((error) => {
      console.error(error);
      recommendedGrid.innerHTML = '<p class="empty-state">Unable to load recipes right now.</p>';
      favoritesGrid.innerHTML = '<p class="empty-state">Favorites are unavailable right now.</p>';
    });
}

/* Shows the name saved by the join form on the start page. getProfileName()
   comes from components.js, which loads first. */
function renderHomeGreeting() {
  const greeting = document.querySelector('#home-greeting');

  if (!greeting) {
    return;
  }

  const name = typeof getProfileName === 'function' ? getProfileName() : '';

  if (!name) {
    greeting.hidden = true;
    greeting.textContent = '';
    return;
  }

  greeting.hidden = false;
  greeting.textContent = `Welcome back, ${name} — here are your picks for today.`;
}

renderHomeGreeting();
renderHomePage();
