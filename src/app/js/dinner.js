
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("recipe-search");
    const ingredientSearch = document.getElementById("ingredient-search");
    const ingredientFilters = document.getElementById("ingredient-filters");
    const recipeCards = document.querySelectorAll(".recipe-card");

    function filterRecipes() {
        const search = searchInput.value.toLowerCase().trim();

        const selectedIngredients = ingredientSearch.value
            .toLowerCase()
            .split(",")
            .map(function (ingredient) {
                return ingredient.trim();
            })
            .filter(Boolean);

        recipeCards.forEach(function (card) {

            const title = (card.dataset.title || "").toLowerCase();
            const keywords = (card.dataset.keywords || "").toLowerCase();

            const ingredients = (card.dataset.ingredients || "")
                .toLowerCase()
                .split(",")
                .map(function (ingredient) {
                    return ingredient.trim();
                })
                .filter(Boolean);

            const matchesSearch =
                !search ||
                title.includes(search) ||
                keywords.includes(search);

            const matchesIngredients = selectedIngredients.every(
                function (searchIngredient) {
                    return ingredients.some(function (recipeIngredient) {
                        return recipeIngredient.includes(searchIngredient);
                    });
                }
            );

            card.classList.toggle(
                "d-none",
                !(matchesSearch && matchesIngredients)
            );
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterRecipes);
    }

    if (ingredientSearch) {
        ingredientSearch.addEventListener("input", filterRecipes);
    }

    if (ingredientFilters) {
        ingredientFilters.addEventListener("change", function (event) {
            if (!event.target.matches(".ingredient-filter")) {
                return;
            }

            filterRecipes();
        });
    }

    document.querySelectorAll(".recipe-card-clickable").forEach(function (card) {

        function openRecipe() {
            const recipeCard = card.closest(".recipe-card");
            const title = recipeCard.dataset.recipeTitle;

            const modal = document.getElementById(
                "recipe-overview-modal-" + title
            );

            if (modal) {
                bootstrap.Modal.getOrCreateInstance(modal).show();
            }
        }

        card.addEventListener("click", openRecipe);

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openRecipe();
            }
        });
    });

});
