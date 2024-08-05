document.addEventListener("DOMContentLoaded", () => {
    const APP_ID = "b836005f";
    const APP_KEY = "24785da2b1a1613785439a8fffef3d22";
    const BASE_URL = "https://api.edamam.com/search";

    const breakfastBtn = document.getElementById("breakfast");
    const brunchBtn = document.getElementById("brunch");
    const snackBtn = document.getElementById("snack");
    const teatimeBtn = document.getElementById("teatime");
    const button = document.getElementById("btn");
    const query = document.getElementById("search");
    const recipecontainer = document.getElementById("recipecontainer");

    breakfastBtn.addEventListener("click", () => fetchRecipes("breakfast"));
    brunchBtn.addEventListener("click", () => fetchRecipes("brunch"));
    snackBtn.addEventListener("click", () => fetchRecipes("snack"));
    teatimeBtn.addEventListener("click", () => fetchRecipes("teatime"));

    button.addEventListener("click", (event) => {
        event.preventDefault();
        const searchQuery = query.value;
        fetchRecipes("", searchQuery);
    });

    window.onload = function () {
        fetchRecipes("breakfast");
    };

    // function fetchRecipes(mealType, searchQuery = "") {
    //   let url = `${BASE_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`;
    //   if (mealType) {
    //     url += `&mealType=${mealType}`;
    //   }
    //   if (searchQuery) {
    //     url += `&q=${searchQuery}`;
    //   }

    //   fetch(url)
    //     .then((response) => {
    //         console.log(response)
    //       if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log(JSON.parse(data));
    //       displayRecipes(data.hits);
    //     })
    //     .catch((error) => console.error("Error fetching data:", error));
    // }
    //   function fetchRecipes(mealType, searchQuery = "") {
    //     let url = `${BASE_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`;
    //     if (mealType) {
    //       url += `&mealType=${mealType}`;
    //     }
    //     if (searchQuery) {
    //       url += `&q=${searchQuery}`;
    //     }

    //     fetch(url)
    //       .then((response) => {
    //         console.log(response);
    //         if (!response.ok) {
    //           throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         return response.text(); // Read response as text initially
    //       })
    //       .then((text) => {
    //         try {
    //           return JSON.parse(text); // Try parsing the text to JSON
    //         } catch (error) {
    //           throw new Error(
    //             "Failed to parse JSON: " +
    //               error.message +
    //               "\nResponse text: " +
    //               text
    //           );
    //         }
    //       })
    //       .then((data) => {
    //         console.log(data); // Process your JSON data here
    //       })
    //       .catch((error) => {
    //         console.error("Fetch error: ", error.message);
    //       });
    //   }

    function fetchRecipes(mealType, searchQuery = "") {
        let url = `${BASE_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`;
        if (mealType) {
            url += `&mealType=${mealType}`;
        }
        if (searchQuery) {
            url += `&q=${searchQuery}`;
        }

        fetch(url)
            .then((response) => {
                console.log("HTTP response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); // Read response as text initially
            })
            .then((text) => {
                console.log("Response text:", text); // Log the response text
                if (!text) {
                    throw new Error("Received empty response text");
                }
                try {
                    return JSON.parse(text); // Try parsing the text to JSON
                } catch (error) {
                    throw new Error(
                        "Failed to parse JSON: " +
                        error.message +
                        "\nResponse text: " +
                        text
                    );
                }
            })
            .then((data) => {
                console.log("Parsed JSON data:", data); // Process your JSON data here
            })
            .catch((error) => {
                console.error("Fetch error: ", error.message);
            });
    }

    function displayRecipes(recipes) {
        recipecontainer.innerHTML = "";
        recipes.forEach((recipeData) => {
            const recipe = recipeData.recipe; // Access the actual recipe object
            const recipeElement = document.createElement("div");
            recipeElement.classList.add("recipe-card");
            recipeElement.innerHTML = `
          <span class="close-btn">&times;</span>
          <h2>${recipe.label}</h2>
          <img src="${recipe.image}" alt="${recipe.label}">
          <p><strong>Source:</strong> ${recipe.source}</p>
          <p><strong>Calories:</strong> ${recipe.calories.toFixed(2)}</p>
          <p><strong>Diet Labels:</strong> ${recipe.dietLabels.join(", ")}</p>
          <p><strong>Health Labels:</strong> ${recipe.healthLabels.join(
                ", "
            )}</p>
          <h3>Ingredients:</h3>
          <ul>
            ${recipe.ingredientLines
                    .map((ingredient) => `<li>${ingredient}</li>`)
                    .join("")}
          </ul>
          <a href="${recipe.url
                }" target="_blank" class="btn btn-primary">View Recipe</a>
        `;
            recipecontainer.appendChild(recipeElement);
        });
    }
});
