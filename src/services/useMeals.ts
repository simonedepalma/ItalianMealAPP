import { useEffect, useState } from 'react';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface DetailedMeal extends Meal {
  description?: string;
}

const BASE = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchItalianMeals() {
  const res = await fetch(`${BASE}/filter.php?a=Italian`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.meals ?? [];
}

export async function fetchMealById(id: string) {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.meals?.[0] ?? null;
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const meals = await fetchItalianMeals();
      setMeals(meals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meals');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  return { meals, loading, error, refetch: fetchMeals };
}

export async function getMealById(mealId: string): Promise<DetailedMeal | null> {
  try {
    const meal = await fetchMealById(mealId);
    
    if (meal) {
      return {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        description: meal.strInstructions || meal.strTags || '',
      };
    }

    return null;
  } catch (err) {
    console.error('Failed to fetch meal details:', err);
    return null;
  }
}
