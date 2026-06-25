const BASE = 'https://www.themealdb.com/api/json/v1/1';
const listEl = document.getElementById('list');
const statusEl = document.getElementById('status');

async function loadMeals(){
  try{
    statusEl.textContent = 'Caricamento...';
    const res = await fetch(`${BASE}/filter.php?a=Italian`);
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const meals = data.meals || [];
    if(meals.length === 0){
      statusEl.textContent = 'Nessun piatto trovato.';
      return;
    }
    statusEl.textContent = `Trovati ${meals.length} piatti`;
    render(meals);
  }catch(e){
    statusEl.textContent = 'Errore: ' + e.message;
  }
}

function render(items){
  listEl.innerHTML = '';
  for(const item of items){
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.className = 'thumb';
    img.src = item.strMealThumb;
    img.alt = item.strMeal;
    const name = document.createElement('div');
    name.className = 'mealName';
    name.textContent = item.strMeal;
    card.appendChild(img);
    card.appendChild(name);
    listEl.appendChild(card);
  }
}

loadMeals();
