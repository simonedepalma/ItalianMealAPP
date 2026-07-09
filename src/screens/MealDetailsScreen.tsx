import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/Navigation';
import { FavoriteButton } from '../components/FavoriteButton';
import { useFavorites } from '../services/useFavorites';
import { DetailedMeal, getMealById } from '../services/useMeals';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type MealDetailsScreenProps = {
  route: DetailsScreenRouteProp;
};

const FALLBACK_MEALS: DetailedMeal[] = [
  {
    idMeal: 'a1',
    strMeal: 'Alpha',
    strMealThumb: 'https://via.placeholder.com/120',
    description: 'Primo piatto di esempio.',
  },
  {
    idMeal: 'b2',
    strMeal: 'Beta',
    strMealThumb: 'https://via.placeholder.com/120',
    description: 'Secondo piatto di esempio.',
  },
  {
    idMeal: 'c3',
    strMeal: 'Gamma',
    strMealThumb: 'https://via.placeholder.com/120',
    description: 'Terzo piatto di esempio.',
  },
];

export function MealDetailsScreen({ route }: MealDetailsScreenProps) {
  const mealId = route.params?.id ?? 'a1';
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [meal, setMeal] = useState<DetailedMeal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealDetails = async () => {
      setLoading(true);
      const fetchedMeal = await getMealById(mealId);
      if (fetchedMeal) {
        setMeal(fetchedMeal);
      } else {
        const fallback = FALLBACK_MEALS.find((item) => item.idMeal === mealId) ?? FALLBACK_MEALS[0];
        setMeal(fallback);
      }
      setLoading(false);
    };

    fetchMealDetails();
  }, [mealId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Meal not found</Text>
      </View>
    );
  }

  const isFavorite = favoriteIds.includes(meal.idMeal);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <FavoriteButton
          idMeal={meal.idMeal}
          isFavorite={isFavorite}
          onToggle={() => toggleFavorite(meal.idMeal)}
        />
      </View>
      <Text style={styles.description}>{meal.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});