// Get DOM elements
const ingredientSearchBtn = document.getElementById('search-btn');
const recipeContainer = document.getElementById('meal');
const recipeModalContent = document.querySelector('.meal-details-content');
const closeModalBtn = document.getElementById('recipe-close-btn');

// Event listeners
ingredientSearchBtn.addEventListener('click', searchMealsByIngredient);
recipeContainer.addEventListener('click', openMealDetails);
closeModalBtn.addEventListener('click', () => {
    recipeModalContent.parentElement.classList.remove('showRecipe');
});

// Search meals by ingredient
async function searchMealsByIngredient() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert('Please enter an ingredient!');
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
        const data = await response.json();

        if (!data.meals) {
            recipeContainer.innerHTML = "No meals found for this ingredient.";
            recipeContainer.classList.add('notFound');
            return;
        }

        recipeContainer.classList.remove('notFound');
        recipeContainer.innerHTML = data.meals.map(meal => createMealCard(meal)).join('');
    } catch (error) {
        console.error('Error fetching meals:', error);
        recipeContainer.innerHTML = "Oops! Something went wrong.";
    }
}

// Build meal card HTML
function createMealCard(meal) {
    return `
        <div class="meal-card" data-mealid="${meal.idMeal}">
            <div class="meal-card-img">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <div class="meal-card-name">
                <h3>${meal.strMeal}</h3>
                <button class="recipe-btn btn">View Recipe</button>
            </div>
        </div>
    `;
}

// Open meal details in modal
async function openMealDetails(event) {
    if (!event.target.classList.contains('recipe-btn')) return;

    const mealCard = event.target.closest('.meal-card');
    const mealID = mealCard.dataset.mealid;

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
        const data = await response.json();
        showMealModal(data.meals[0]);
    } catch (error) {
        console.error('Error fetching recipe:', error);
    }
}

// Display modal with recipe
function showMealModal(meal) {
    recipeModalContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory} | ${meal.strArea}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    recipeModalContent.parentElement.classList.add('showRecipe');
}
