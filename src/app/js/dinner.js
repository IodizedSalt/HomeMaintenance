
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("recipe-search");
    const ingredientFilters = document.getElementById("ingredient-filters");
    const recipeCards = document.querySelectorAll(".recipe-card");

    function filterRecipes() {
        const search = searchInput.value.toLowerCase().trim();

        // Read selected ingredients directly from checkboxes
        const selectedIngredients = Array.from(
            ingredientFilters.querySelectorAll(".ingredient-filter:checked")
        ).map(function (checkbox) {
            return checkbox.value;
        });

        recipeCards.forEach(function (card) {

            const title = card.dataset.title.toLowerCase();
            const keywords = card.dataset.keywords.toLowerCase();
            const ingredients = card.dataset.ingredients.split(",");

            const matchesSearch =
                !search ||
                title.includes(search) ||
                keywords.includes(search);

            const matchesIngredients = selectedIngredients.every(
                function (ingredient) {
                    return ingredients.includes(ingredient);
                }
            );

            card.classList.toggle(
                "d-none",
                !(matchesSearch && matchesIngredients)
            );
        });
    }

    // Search recipes
    searchInput.addEventListener("input", filterRecipes);

    // Ingredient checkbox selection
    ingredientFilters.addEventListener("change", function (event) {
        if (!event.target.matches(".ingredient-filter")) {
            return;
        }

        filterRecipes();
    });

    // Recipe overview modal
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
