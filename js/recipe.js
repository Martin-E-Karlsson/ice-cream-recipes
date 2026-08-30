const UNIT_STORAGE_KEY = 'unitSystem';

function getStoredUnitSystem() {
  try {
    const savedValue = localStorage.getItem(UNIT_STORAGE_KEY);

    if (savedValue === 'metric' || savedValue === 'imperial') {
      return savedValue;
    }
  } catch (error) {
    console.warn('Could not read unit system from localStorage.', error);
  }

  return 'metric';
}

function saveUnitSystem(unitSystem) {
  try {
    localStorage.setItem(UNIT_STORAGE_KEY, unitSystem);
  } catch (error) {
    console.warn('Could not save unit system to localStorage.', error);
  }
}

function getIngredientValue(ingredient, unitSystem) {
  if (unitSystem === 'imperial') {
    return ingredient.imperial || ingredient.metric;
  }

  return ingredient.metric || ingredient.imperial;
}

function getCategoryLabel(category) {
  const map = {
    classic: 'Classic',
    protein: 'Protein',
    sorbet: 'Sorbet'
  };

  return map[category] || category;
}

function createInfoRow(label, value) {
  const item = document.createElement('span');

  const strong = document.createElement('strong');
  strong.textContent = `${label}:`;

  const text = document.createTextNode(` ${value}`);

  item.append(strong, text);
  return item;
}

function createIngredientList(ingredients, unitSystem) {
  const list = document.createElement('ul');
  list.className = 'recipe-ingredients';

  ingredients.forEach((ingredient) => {
    const item = document.createElement('li');
    item.textContent = getIngredientValue(ingredient, unitSystem);
    list.appendChild(item);
  });

  return list;
}

function createStepsList(steps) {
  const list = document.createElement('ol');
  list.className = 'recipe-steps';

  steps.forEach((step) => {
    const item = document.createElement('li');

    const title = document.createElement('div');
    title.className = 'recipe-step-title';
    title.textContent = step.title;

    const detail = document.createElement('p');
    detail.textContent = step.detail;

    item.append(title, detail);
    list.appendChild(item);
  });

  return list;
}

function createVideoEmbed(youtubeId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'recipe-video';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
  iframe.title = 'Recipe video';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;

  wrapper.appendChild(iframe);
  return wrapper;
}

function createRecipePage(recipe) {
  const page = document.createElement('article');
  page.className = 'recipe-page';

  const header = document.createElement('header');
  header.className = 'recipe-hero';

  const imagePanel = document.createElement('div');
  imagePanel.className = 'recipe-image-panel';

  const image = document.createElement('img');
  image.src = recipe.image;
  image.alt = recipe.imageAlt || recipe.title;

  imagePanel.appendChild(image);

  const headingWrap = document.createElement('div');
  headingWrap.className = 'recipe-heading';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = getCategoryLabel(recipe.category);

  const title = document.createElement('h1');
  title.textContent = recipe.title;

  const subtitle = document.createElement('p');
  subtitle.className = 'recipe-subtitle';
  subtitle.textContent = recipe.summary;

  const metaRow = document.createElement('div');
  metaRow.className = 'recipe-meta-row';

  metaRow.append(
    createInfoRow('Freeze', `${recipe.freezeHours}h`),
    createInfoRow('Spin', recipe.spinCycle),
    createInfoRow('Prep', `${recipe.prepMinutes} min`),
    createInfoRow('Serves', String(recipe.servings))
  );

  headingWrap.append(eyebrow, title, subtitle, metaRow);
  header.append(imagePanel, headingWrap);

  const articleContent = document.createElement('div');
  articleContent.className = 'recipe-article';

  const unitToggle = document.createElement('fieldset');
  unitToggle.className = 'unit-switch';

  const legend = document.createElement('legend');
  legend.textContent = 'Units';

  const optionWrap = document.createElement('div');
  optionWrap.className = 'unit-switch-options';

  const metricLabel = document.createElement('label');
  const metricInput = document.createElement('input');
  metricInput.type = 'radio';
  metricInput.name = 'unitSystem';
  metricInput.value = 'metric';
  metricInput.checked = getStoredUnitSystem() === 'metric';
  metricInput.addEventListener('change', () => {
    if (metricInput.checked) {
      saveUnitSystem('metric');
      renderRecipe(recipe);
    }
  });

  const metricText = document.createElement('span');
  metricText.textContent = 'Metric';
  metricLabel.append(metricInput, metricText);

  const imperialLabel = document.createElement('label');
  const imperialInput = document.createElement('input');
  imperialInput.type = 'radio';
  imperialInput.name = 'unitSystem';
  imperialInput.value = 'imperial';
  imperialInput.checked = getStoredUnitSystem() === 'imperial';
  imperialInput.addEventListener('change', () => {
    if (imperialInput.checked) {
      saveUnitSystem('imperial');
      renderRecipe(recipe);
    }
  });

  const imperialText = document.createElement('span');
  imperialText.textContent = 'Imperial';
  imperialLabel.append(imperialInput, imperialText);

  optionWrap.append(metricLabel, imperialLabel);
  unitToggle.append(legend, optionWrap);

  const layout = document.createElement('div');
  layout.className = 'recipe-layout';

  const ingredientsPanel = document.createElement('section');
  ingredientsPanel.className = 'recipe-panel';

  const ingredientsHeading = document.createElement('h2');
  ingredientsHeading.textContent = 'Ingredients';

  const ingredientsList = createIngredientList(recipe.ingredients, getStoredUnitSystem());

  ingredientsPanel.append(ingredientsHeading, unitToggle, ingredientsList);

  const stepsPanel = document.createElement('section');
  stepsPanel.className = 'recipe-panel';

  const stepsHeading = document.createElement('h2');
  stepsHeading.textContent = 'Method';

  const stepsList = createStepsList(recipe.steps);
  stepsPanel.append(stepsHeading, stepsList);

  layout.append(ingredientsPanel, stepsPanel);
  articleContent.append(layout);

  if (recipe.youtubeId) {
    articleContent.append(createVideoEmbed(recipe.youtubeId));
  }

  if (recipe.tips && recipe.tips.length > 0) {
    const tipsPanel = document.createElement('section');
    tipsPanel.className = 'recipe-panel';

    const tipsHeading = document.createElement('h2');
    tipsHeading.textContent = 'Helpful notes';

    const tipsList = document.createElement('ul');
    tipsList.className = 'recipe-tips';

    recipe.tips.forEach((tip) => {
      const item = document.createElement('li');
      item.textContent = tip;
      tipsList.appendChild(item);
    });

    tipsPanel.append(tipsHeading, tipsList);
    articleContent.append(tipsPanel);
  }

  const backLink = document.createElement('a');
  backLink.href = 'recipes.html';
  backLink.className = 'recipe-backlink';
  backLink.textContent = '← Back to all recipes';

  page.append(header, articleContent, backLink);
  return page;
}

function renderRecipe(recipe) {
  const container = document.querySelector('#recipe-page');

  if (!container) {
    return;
  }

  container.innerHTML = '';
  container.appendChild(createRecipePage(recipe));
}

async function initRecipePage() {
  const container = document.querySelector('#recipe-page');

  if (!container) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get('id') || 'salt-licorice';

  try {
    const response = await fetch('data/recipes.json');

    if (!response.ok) {
      throw new Error(`Failed to load recipes: ${response.status}`);
    }

    const data = await response.json();
    const recipe = (data.recipes || []).find((item) => item.id === recipeId);

    if (!recipe) {
      container.innerHTML = '<p class="empty-state">Recipe not found.</p>';
      return;
    }

    renderRecipe(recipe);
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p class="empty-state">Unable to load this recipe right now.</p>';
  }
}

initRecipePage();
