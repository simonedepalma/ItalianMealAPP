import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { FavoriteButton } from "../components/FavoriteButton";
import { useFavorites } from "../services/useFavorites";
import { getMealById } from "../services/useMeals";

export function DetailsScreen({ navigation, route }: any) {
  const id = route.params?.id;
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [meal, setMeal] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isActive = true;
    async function loadMeal() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMealById(id);
        if (isActive) setMeal(data);
      } catch {
        if (isActive) setError("Impossibile caricare il dettaglio del piatto.");
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadMeal();
    return () => {
      isActive = false;
    };
  }, [id]);

  if (!id) return <Text style={{ padding: 16 }}>Invalid route param</Text>;
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error || !meal) return <Text style={{ padding: 16 }}>{error ?? "Product not found"}</Text>;

  const isFavorite = favoriteIds.includes(id);

  function handleToggleFavorite() {
    toggleFavorite(id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <FavoriteButton idMeal={id} isFavorite={isFavorite} onToggle={handleToggleFavorite} />
      </View>
      <Text style={styles.description}>{meal.description || "Nessuna descrizione disponibile."}</Text>
      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { justifyContent: "center", alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "700", flex: 1, marginRight: 8 },
  description: { fontSize: 16, lineHeight: 22 },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginTop: 16,
  },
  buttonText: { fontWeight: "600" },
});