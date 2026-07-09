import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type FavoriteButtonProps = {
  idMeal: string;
  isFavorite: boolean;
  onToggle?: (idMeal: string) => void;
};

export function FavoriteButton({
  idMeal,
  isFavorite,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      style={styles.favButton}
      onPress={() => onToggle?.(idMeal)}
    >
      <Text style={styles.favText}>{isFavorite ? "♥" : "♡"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  favButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#080606",
    backgroundColor: "#ac0505",
  },
  favText: {
    fontSize: 18,
  },
});
