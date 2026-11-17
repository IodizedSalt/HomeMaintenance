document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("recipe-search");
    const ingredientFilters = document.getElementById("ingredient-filters");
    const recipeCards = document.querySelectorAll(".recipe-card");

    const selectedIngredients = new Set();

    function filterRecipes() {
        const search = searchInput.value.toLowerCase().trim();

        recipeCards.forEach(function (card) {
            const title = card.dataset.title;
            const keywords = card.dataset.keywords;
            const ingredients = card.dataset.ingredients.split(",");

            const matchesSearch =
                !search ||
                title.includes(search) ||
                keywords.includes(search);

            const matchesIngredients = Array.from(selectedIngredients)
                .every(function (ingredient) {
                    return ingredients.includes(ingredient);
                });

            card.classList.toggle(
                "d-none",
                !(matchesSearch && matchesIngredients)
            );
        });
    }

    searchInput.addEventListener("input", filterRecipes);

    ingredientFilters.addEventListener("click", function (event) {
        const button = event.target.closest(".ingredient-filter");

        if (!button) return;

        const ingredient = button.dataset.ingredient;

        if (selectedIngredients.has(ingredient)) {
            selectedIngredients.delete(ingredient);
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        } else {
            selectedIngredients.add(ingredient);
            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");
        }

        filterRecipes();
    });


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