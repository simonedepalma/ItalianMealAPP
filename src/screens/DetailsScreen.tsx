import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FavoriteButton } from "../components/FavoriteButton";
import { useFavorites } from "../services/useFavorites";

const DATA = [
  { id: "a1", title: "Alpha", description: "First item" },
  { id: "b2", title: "Beta", description: "Second item" },
  { id: "c3", title: "Gamma", description: "Third item" },
];

export function DetailsScreen({ navigation, route }: any) {
  const id = route.params?.id;
  const { favoriteIds, toggleFavorite } = useFavorites();

  if (!id) return <Text style={{ padding: 16 }}>Invalid route param</Text>;

  const item = DATA.find((x) => x.id === id);
  if (!item) return <Text style={{ padding: 16 }}>Product not found</Text>;

  const isFavorite = favoriteIds.includes(id);

  function handleToggleFavorite() {
    toggleFavorite(id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.title}</Text>
        <FavoriteButton idMeal={id} isFavorite={isFavorite} onToggle={handleToggleFavorite} />
      </View>
      <Text>{item.description}</Text>
      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "700", flex: 1, marginRight: 8 },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  buttonText: { fontWeight: "600" },
});