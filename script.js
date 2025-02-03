
// API credentials
const appId = 'b836005f';
const appKey = '24785da2b1a1613785439a8fffef3d22';
// Event listener for DOMContentLoaded to set up event handlers and initial fetch
document.addEventListener("DOMContentLoaded", () => {
    const breakfastBtn = document.getElementById("breakfast");
    const brunchBtn = document.getElementById("brunch");
    const snackBtn = document.getElementById("snack");
    const teatimeBtn = document.getElementById("teatime");
    const button = document.getElementById("btn");
    const query = document.getElementById("search");
    const dietaryDropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    // const loginBtn = document.getElementById("loginBtn");


    
    breakfastBtn.addEventListener("click", () => fetchResult("", "breakfast"));
    brunchBtn.addEventListener("click", () => fetchResult("", "brunch"));
    snackBtn.addEventListener("click", () => fetchResult("", "snack"));
    teatimeBtn.addEventListener("click", () => fetchResult("", "teatime"));

    button.addEventListener("click", (event) => {
        event.preventDefault();
        const searchQuery = query.value;
        searchRes(searchQuery);
    });

    dietaryDropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const diet = event.target.getAttribute('data-diet');
            fetchResult(query.value, '', diet);
        });
    });

    // loginBtn.addEventListener("click", () => {
    //     window.location.href = 'login.html';
    // });
    

    fetchResult("", "breakfast");
    displayFavoriteRecipes();
});
// Fetch recipes from the Edamam API mealType and diet filters
const fetchResult = async (query, mealType = '', diet = '') => {
    try {
        let url = `https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${appId}&app_key=${appKey}&from=0&to=52`;

        if (mealType) {
            url += `&mealType=${encodeURIComponent(mealType)}`;
        }
        if (diet) {
            url += `&diet=${encodeURIComponent(diet)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText}. Error: ${errorText}`);
        }
        const data = await response.json();
        displayRecipes(data.hits);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
// Search recipes by query
const searchRes = async (searchInput) => {
    try {
        const response = await fetch(`https://api.edamam.com/search?q=${searchInput}&app_id=${appId}&app_key=${appKey}&from=0&to=52`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayRecipes(data.hits);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
// Function to display recipes
function displayRecipes(recipes) {
    const recipeContainer = document.getElementById("recipecontainer");
    recipeContainer.innerHTML = "";

    if (recipes.length === 0) {
        recipeContainer.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    recipes.forEach((recipeData) => {
        const recipe = recipeData.recipe;
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe-card");
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h3>${recipe.label}</h3>
            <p><strong>Source:</strong> ${recipe.source}</p>
            <a href="${recipe.url}" target="_blank" class="btn btn-primary">View Recipe</a>
            <button class="favorite-btn">${isFavorite(recipe.uri) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        `;

        recipeElement.addEventListener("click", () => displayRecipe(recipe));

        const favoriteBtn = recipeElement.querySelector(".favorite-btn");
        favoriteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleFavorite(recipe);
        });

        recipeContainer.appendChild(recipeElement);
    });
}
// Function to add a recipe to favorites
function addFavorite(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(recipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
// Function to remove a recipe to favorites
function removeFavorite(uri) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.uri !== uri);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
// Function to toggle favorite status
function toggleFavorite(recipe) {
    if (isFavorite(recipe.uri)) {
        removeFavorite(recipe.uri);
        alert(`${recipe.label} has been removed from favorites.`);
    } else {
        addFavorite(recipe);
        alert(`${recipe.label} has been added to favorites.`);
    }
    displayFavoriteRecipes();
}
// Function to check if a recipe is a favorite
function isFavorite(uri) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.uri === uri);
}

// Function to display favorite recipes
// function displayFavoriteRecipes() {
//     const favoriteContainer = document.getElementById("favorites");
//     favoriteContainer.innerHTML = "";
//     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//     console.log(favorites);
//     if (favorites.length === 0) {
//         favoriteContainer.innerHTML = "<p>No favorite recipes found.</p>";
//         return;
//     }
//     favorites.forEach((recipe) => {
//         const recipeElement = document.createElement("div");
//         recipeElement.classList.add("recipe-card");
//         recipeElement.innerHTML = `
//             <img src="${recipe.image}" alt="${recipe.label}">
//             <h3>${recipe.label}</h3>
//             <p><strong>Source:</strong> ${recipe.source}</p>
//             <a href="${recipe.url}" target="_blank" class="btn btn-primary">View Recipe</a>
//             <button class="favorite-btn">Remove from Favorites</button>
//         `;
//         const favoriteBtn = recipeElement.querySelector(".favorite-btn");
//         favoriteBtn.addEventListener("click", () => {
//             removeFavorite(recipe.uri);
//             alert(`${recipe.label} has been removed from favorites.`);
//             displayFavoriteRecipes();
//         });
//         favoriteContainer.appendChild(recipeElement);
//     });
// }


