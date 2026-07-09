import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { FavoriteButton } from "./FavoriteButton";

type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

type MealCardProps = {
  meal: MealSummary;
  isFavorite: boolean;
  onToggle: (idMeal: string) => void;
};

export function MealCard({ meal, isFavorite, onToggle }: MealCardProps) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.thumb} />
      <Text style={styles.mealName} numberOfLines={2}>
        {meal.strMeal}
      </Text>
      <View style={styles.actions}>
        <FavoriteButton idMeal={meal.idMeal} isFavorite={isFavorite} onToggle={onToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0c0909",
  },
  thumb: { width: 48, height: 48, borderRadius: 8 },
  mealName: { flex: 1, fontWeight: "600", marginHorizontal: 10 },
  actions: { marginLeft: 8 },
});
