const form = document.getElementById('form');
const input = document.getElementById('search');
const randomBtn = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const foods = document.getElementById('meals');
const singleMeal = document.getElementById('single-meal');
const categories = document.getElementById('categories');


function addMeals(e) {
    e.preventDefault();
    
    singleMeal.innerHTML = "";

    const term = input.value;

    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            resultHeading.innerHTML = `<h2>Search results for: ${term}`;
            if (data.meals === null) {
                resultHeading.innerHTML = `<h2>There are no results. Please try again!`;
            } else {
                foods.innerHTML = data.meals.map((meal) => {
                    return `<div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div> `
                }).join('');
            }
            input.value = "";
        });
    } else {
        alert ('Please enter a search term.');
    }
}

function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    })
}


function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        }
        else {
            break;
        }
    }
    singleMeal.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
    </div>
    </div>
`;

}


function getRandomMeal() {
    resultHeading.innerHTML = '';
    foods.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const randMeal = data.meals[0];
        
        addMealToDOM(randMeal);
    });
}


// Event Listeners
form.addEventListener('submit', addMeals);
randomBtn.addEventListener('click', getRandomMeal);

foods.addEventListener('click', (e) => {
    const mealInfo = e.composedPath().find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    // if mealInfo is true
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})

window.addEventListener('DOMContentLoaded', (e) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        if(data.categories !== null) {
            // categories.innerHTML = ``
            
            // console.log(listItems)
            
            let foodCat = data.categories.map((cat) => {
                return `<button class="food-category" href="#">${cat.strCategory}</button>`
            }).join('');
            categories.innerHTML = foodCat;
                
                // const li = document.createElement('li');
                // ul.appendChild('li');
                // const foodCat = document.createElement('a');
                // li.appendChild(foodCat);
                // foodCat.textContent = data.categories.strCategory;
                
        } 
    })
});

categories.addEventListener('click', (e) => {
    if (e.target.classList.contains('food-category')) {
        console.log(e.target.textContent);
        resultHeading.innerHTML = `<h2>Search Results for: ${e.target.textContent}</h2>`;

        fetch (`https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.textContent}`)
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