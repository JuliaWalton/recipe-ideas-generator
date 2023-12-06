const form = document.getElementById('form');
const input = document.getElementById('search');
const randomBtn = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const foods = document.getElementById('meals');
const singleMeal = document.getElementById('single-meal');
const categoryBtns = document.getElementById('category-btns');

// add meal category buttons to DOM
function createCategoryBtns(categoriesArray) {
    categoriesArray.forEach((category) => {
        const button = document.createElement('button');
        button.className = 'food-category';
        button.textContent = `${category.strCategory}`
        categoryBtns.appendChild(button);
    }) 
}   

// get meals by search input
function getMeals(e) {
    e.preventDefault();
    const term = input.value;

    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            resultHeading.innerHTML = `<h2>Search results for: ${term}</h2>`
            foods.innerHTML = "";
            singleMeal.innerHTML = "";
            if (data.meals === null) {
                resultHeading.innerHTML = `<h2>There are no results. Please try again!</h2>`;

            } else {
                foods.innerHTML = data.meals.map((meal) => {
                    return `<div class="meal">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                                <div class="meal-info" data-mealID="${meal.idMeal}">
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>`
                }).join('');
            }
        })
        input.value = '';
    }
    else {
        alert('Please include a search term!')
    }
}

// get one full meal by ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        const food = data.meals[0];

        addMealToDOM(food);
    })
}

// update DOM to display the full meal's array values
function addMealToDOM(food) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (food[`strIngredient${i}`]) {
            console.log('okay');
            ingredients.push(`${food[`strIngredient${i}`]} - ${food[`strIngredient${i}`]}`)
        } else {
            console.log('wtf');
            break;
        }
    }

    singleMeal.innerHTML = 
        `<h1>${food.strMeal}</h1>
            <img src="${food.strMealThumb}" alt="${food.strMeal}" />
            <div class="single-meal-info">
                ${food.strCategory ? `<p>${food.strCategory}</p>` : ''}
                ${food.strArea ? `<p>${food.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${food.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>`
}

function getRandomMeal() {
    resultHeading.innerHTML = "";
    foods.innerHTML = "";
    singleMeal.innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const randMeal = data.meals[0];
        addMealToDOM(randMeal);
    })
}


// EVENT LISTENERS
form.addEventListener('submit', getMeals);
randomBtn.addEventListener('click', getRandomMeal);

// on page load, display category buttons and a random meal
window.addEventListener('DOMContentLoaded', (e) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        createCategoryBtns(data.categories);
    })

    getRandomMeal();
})

// grab unique id to display a full meal
foods.addEventListener('click', (e) => {
    // console.log(e.composedPath());
    const mealInfo = e.composedPath().find((item) => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        // console.log(mealInfo);
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})

// get a collection of meals by category and display them
categoryBtns.addEventListener('click', (e) => {
    singleMeal.innerHTML = "";

    if (e.target.classList.contains('food-category')) {
        // console.log(e.target.textContent);
        const foodCategory = e.target.textContent;
        resultHeading.innerHTML = `<h2>Search results for: ${foodCategory}</h2>`

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${foodCategory}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            foods.innerHTML = data.meals.map((meal) => {
                    return `<div class="meal">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                                <div class="meal-info" data-mealID="${meal.idMeal}">
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>`
                }).join('');
        })
    }
})