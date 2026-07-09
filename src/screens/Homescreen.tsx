import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { MealCard } from "../components/MealCard";
import { useFavorites } from "../services/useFavorites";
import { useMeals } from "../services/useMeals";

export function HomeScreen({ navigation }: { navigation: any }) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { meals, loading, error } = useMeals();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading meals: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("Details", { id: item.idMeal })}>
            <MealCard
              meal={{ idMeal: item.idMeal, strMeal: item.strMeal, strMealThumb: item.strMealThumb }}
              isFavorite={favoriteIds.includes(item.idMeal)}
              onToggle={toggleFavorite}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
