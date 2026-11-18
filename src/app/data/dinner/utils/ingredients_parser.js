
/*
 * Build the dinner ingredient dictionary from every recipe JSON file.
 *
 * Run from the project root:
 * node src/app/data/dinner/utils/ingredients_parser.js
 */

const fs = require("fs");
const path = require("path");

const recipesDir = path.resolve(
    process.cwd(),
    "dinner/recipes"
);

const outputFile = path.resolve(
    process.cwd(),
    "dinner/utils/ingredients_dictionary.json"
);


function toDisplayName(id) {
    return String(id)
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, function (character) {
            return character.toUpperCase();
        });
}


function isRecipeObject(value) {
    return value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (
            Array.isArray(value.ingredients_list) ||
            Array.isArray(value.recipe_ingredients)
        );
}


function getRecipesFromFile(data, filename) {

    // Support a JSON file containing one recipe directly.
    if (isRecipeObject(data)) {
        return [{
            title: data.title || path.basename(filename, ".json"),
            data: data
        }];
    }

    // Support JSON files containing multiple recipes,
    // where the recipe title is the object key.
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return [];
    }

    return Object.keys(data)
        .filter(function (title) {
            return isRecipeObject(data[title]);
        })
        .map(function (title) {
            return {
                title: data[title].title || title,
                data: data[title]
            };
        });
}


function buildDictionary() {

    if (!fs.existsSync(recipesDir)) {
        throw new Error(
            "Recipe directory does not exist: " + recipesDir
        );
    }

    const files = fs.readdirSync(recipesDir)
        .filter(function (filename) {
            return filename.toLowerCase().endsWith(".json");
        })
        .sort();

    const ingredientMap = new Map();
    const recipes = [];

    files.forEach(function (filename) {

        const fullPath = path.join(recipesDir, filename);
        let parsed;

        try {
            parsed = JSON.parse(
                fs.readFileSync(fullPath, "utf8")
            );
        } catch (error) {
            console.error(
                "Skipping invalid JSON:",
                filename,
                error.message
            );
            return;
        }

        const fileRecipes = getRecipesFromFile(
            parsed,
            filename
        );

        fileRecipes.forEach(function (recipeEntry) {

            const recipe = recipeEntry.data;
            const title = String(recipeEntry.title);

            // Remove duplicate ingredients within a recipe.
            const ingredients = Array.from(new Set(
                (recipe.ingredients_list || [])
                    .filter(function (ingredient) {
                        return typeof ingredient === "string";
                    })
                    .map(function (ingredient) {
                        return ingredient.trim();
                    })
                    .filter(Boolean)
            ));

            const keywords = Array.isArray(recipe.keywords)
                ? recipe.keywords.filter(function (keyword) {
                    return typeof keyword === "string";
                })
                : [];

                recipes.push({
                    title: title,
                    keywords: recipe.keywords,
                    ingredients: recipe.ingredients_list,
                    recipe_ingredients: recipe.recipe_ingredients,
                    ingredients_list: recipe.ingredients_list,
                    recipe_steps: recipe.recipe_steps,
                    image: recipe.image || null,
                    filename: filename
                });

            ingredients.forEach(function (ingredientId) {

                if (!ingredientMap.has(ingredientId)) {
                    ingredientMap.set(ingredientId, {
                        id: ingredientId,
                        label: toDisplayName(ingredientId),
                        count: 0,
                        recipes: []
                    });
                }

                const entry = ingredientMap.get(ingredientId);

                entry.count += 1;
                entry.recipes.push(title);
            });
        });
    });

    // Most frequently occurring ingredients first.
    const ingredients = Array.from(ingredientMap.values())
        .map(function (entry) {
            entry.recipes.sort();
            return entry;
        })
        .sort(function (a, b) {
            return b.count - a.count ||
                a.label.localeCompare(b.label);
        });

    const dictionary = {
        generated_at: new Date().toISOString(),
        recipe_count: recipes.length,
        ingredient_count: ingredients.length,
        ingredients: ingredients,
        recipes: recipes.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        })
    };

    fs.mkdirSync(path.dirname(outputFile), {
        recursive: true
    });

    fs.writeFileSync(
        outputFile,
        JSON.stringify(dictionary, null, 4) + "\n",
        "utf8"
    );

    console.log(
        "Dinner dictionary generated:",
        recipes.length + " recipes,",
        ingredients.length + " ingredients."
    );

    console.log("Output:", outputFile);
}


try {
    buildDictionary();
} catch (error) {
    console.error(
        "Could not build dinner ingredient dictionary:",
        error
    );

    process.exitCode = 1;
}
