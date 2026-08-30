function getCategoryLabel(category) {
    const map = {
        classic: 'Classic',
        protein: 'Protein',
        sorbet: 'Sorbet'
    };

    return map[category] || category;
}

function createRecipeCard(recipe) {
    const article = document.createElement('article');
    article.className = 'recipe-card';

    const link = document.createElement('a');
    link.href = `recipe.html?id=${recipe.id}`;
    link.className = 'recipe-card-link';
    link.setAttribute('aria-label', `Read recipe: ${recipe.title}`);

    const imageWrap = document.createElement('div');
    imageWrap.className = 'recipe-image-wrap';

    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = recipe.imageAlt || recipe.title;
    img.className = 'recipe-image';

    imageWrap.appendChild(img);

    const chip = document.createElement('span');
    chip.className = 'recipe-category';
    chip.textContent = getCategoryLabel(recipe.category);

    const content = document.createElement('div');
    content.className = 'recipe-content';

    const title = document.createElement('h2');
    title.className = 'recipe-title';
    title.textContent = recipe.title;

    const summary = document.createElement('p');
    summary.className = 'recipe-summary';
    summary.textContent = recipe.summary;

    const meta = document.createElement('p');
    meta.className = 'recipe-meta';
    meta.textContent = `${recipe.freezeHours}h freeze • ${recipe.spinCycle}`;

    content.append(title, summary, meta);

    link.append(imageWrap, chip, content);
    article.appendChild(link);

    return article;
}

function renderRecipes(recipes, filter = 'all') {
    const grid = document.querySelector('#recipes-grid');

    if (!grid) {
        return;
    }

    const visible = filter === 'all'
    ? recipes
    : recipes.filter((recipe) => recipe.category === filter);

    grid.innerHTML = '';

    visible.forEach((recipe) => {
        grid.appendChild(createRecipeCard(recipe));
    });
    if (visible.length === 0) {
        const message = document.createElement('p');
        message.className = 'empty-state';
        message.textContent = 'No recipes in this category yet.';
        grid.appendChild(message);
        return;
    }
}

async function initRecipesPage() {
    const grid = document.querySelector('#recipes-grid');

    if (!grid) {
        return;
    }

    try {
        const response = await fetch('data/recipes.json');

        if (!response.ok) {
            throw new Error(`Failed to load recipes: ${response.status}`);
        }

        const data = await response.json();
        const recipes = data.recipes || [];

        const buttons = document.querySelectorAll('.filter-btn');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const selected = button.dataset.filter;

                buttons.forEach((btn) => {
                    btn.classList.toggle('active', btn === button);
                });

                renderRecipes(recipes, selected);
            });
        });

        renderRecipes(recipes, 'all');
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p>Unable to load recipes right now.</p>';
    }
}

initRecipesPage();