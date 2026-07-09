import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  Linking,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { fetchItalianMeals } from "./src/services/mealAPI";

interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const lightTheme = {
  background: "#ffffff",
  text: "#111111",
  border: "#cccccc",
  muted: "#555555",
  card: "#fafafa",
};

const darkTheme = {
  background: "#121212",
  text: "#07941a",
  border: "#09860f",
  muted: "#b0b0b0",
  card: "#1e1e1e",
};

export default function App() {
  const [isDark, setIsDark] = React.useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const [state, setState] = React.useState<{
    status: "idle" | "loading" | "success" | "error";
    items: MealSummary[];
    message: string;
  }>({
    status: "idle",
    items: [],
    message: "",
  });
  const [view, setView] = React.useState<"meals" | "location">("meals");

  async function loadMeals() {
    setState({ status: "loading", items: [], message: "" });
    try {
      const data = await fetchItalianMeals();
      setState({ status: "success", items: data, message: "" });
    } catch {
      setState({
        status: "error",
        items: [],
        message: "Caricamento fallito.",
      });
    }
  }

  React.useEffect(() => {
    loadMeals();
  }, []);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: 16,
          gap: 12,
          backgroundColor: theme.background,
        },
        centered: {
          flex: 1,
          padding: 16,
          gap: 8,
          justifyContent: "center",
          backgroundColor: theme.background,
        },
        title: { fontSize: 22, fontWeight: "700", color: theme.text },
        subtitle: { color: theme.muted },
        switchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
        switchLabel: { flex: 1, color: theme.text },
        error: { color: "#B00020" },
        button: {
          alignSelf: "flex-start",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 8,
          backgroundColor: theme.card,
        },
        buttonText: { fontWeight: "600", color: theme.text },
        row: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        thumb: { width: 48, height: 48, borderRadius: 8 },
        mealName: { flex: 1, fontWeight: "600", color: theme.text },
        pressed: { opacity: 0.7 },
      }),
    [theme],
  );

  if (state.status === "loading") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator />
          <Text style={{ color: theme.text }}>Caricamento...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (state.status === "error") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.error}>{state.message}</Text>
          <Pressable style={styles.button} onPress={loadMeals}>
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Text accessibilityRole="header" style={styles.title}>
            Piatti italiani
          </Text>
          <Pressable
            style={[styles.button, { marginLeft: "auto" }]}
            onPress={() => setView(view === "meals" ? "location" : "meals")}
          >
            <Text style={styles.buttonText}>{view === "meals" ? "Posizione" : "Piatti"}</Text>
          </Pressable>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tema scuro</Text>
          <Switch
            accessibilityLabel="Attiva o disattiva tema scuro"
            value={isDark}
            onValueChange={setIsDark}
          />
        </View>
        {view === "meals" ? (
          <FlatList
            data={state.items}
            keyExtractor={(item) => item.idMeal}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Apri ${item.strMeal}`}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
                <Text
                  style={styles.mealName}
                  maxFontSizeMultiplier={1.4}
                  numberOfLines={2}
                >
                  {item.strMeal}
                </Text>
              </Pressable>
            )}
          />
        ) : (
          <LocationScreen />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function LocationScreen() {
  type PermissionState = "unknown" | "denied" | "granted";
  type LocationState = "idle" | "loading" | "ready" | "error";

  function formatCoords(pos: Location.LocationObject) {
    return `Lat: ${pos.coords.latitude.toFixed(5)} | Lng: ${pos.coords.longitude.toFixed(5)}`;
  }

  async function readPosition(): Promise<Location.LocationObject> {
    try {
      return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    } catch {
      const last = await Location.getLastKnownPositionAsync();
      if (last) return last;
      throw new Error("GPS non disponibile. Attiva la posizione e riprova.");
    }
  }

  const [bootstrapping, setBootstrapping] = React.useState(true);
  const [permission, setPermission] = React.useState<PermissionState>("unknown");
  const [locationState, setLocationState] = React.useState<LocationState>("idle");
  const [coords, setCoords] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then(({ status }: { status: string }) => {
        if (status === "granted") setPermission("granted");
        else if (status === "denied") setPermission("denied");
        else setPermission("unknown");
      })
      .finally(() => setBootstrapping(false));
  }, []);

  async function onReadLocation() {
    setError("");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermission("denied");
      setLocationState("idle");
      return;
    }

    setPermission("granted");
    setLocationState("loading");

    try {
      const pos = await readPosition();
      setCoords(formatCoords(pos));
      setLocationState("ready");
    } catch (err) {
      setLocationState("error");
      setError(err instanceof Error ? err.message : "GPS non disponibile. Attiva la posizione e riprova.");
    }
  }

  return (
    <View style={{ gap: 12 }}>
      {bootstrapping && <Text>Controllo permesso…</Text>}

      {!bootstrapping && permission === "unknown" && (
        <Text>Tocca il pulsante per consentire l'accesso alla posizione.</Text>
      )}

      {!bootstrapping && permission === "denied" && (
        <View style={{ gap: 12 }}>
          <Text>Permesso posizione negato.</Text>
          <Pressable style={locationStyles.button} onPress={() => Linking.openSettings()}>
            <Text style={locationStyles.buttonText}>Apri Impostazioni</Text>
          </Pressable>
        </View>
      )}

      {!bootstrapping && permission === "granted" && locationState === "idle" && (
        <Text>Permesso concesso. Tocca il pulsante per leggere le coordinate.</Text>
      )}

      {!bootstrapping && permission === "granted" && locationState === "loading" && (
        <Text>Lettura coordinate…</Text>
      )}

      {!bootstrapping && permission === "granted" && locationState === "ready" && <Text>{coords}</Text>}

      {!bootstrapping && permission === "granted" && locationState === "error" && (
        <Text style={locationStyles.error}>{error}</Text>
      )}

      <Pressable style={locationStyles.button} onPress={onReadLocation}>
        <Text style={locationStyles.buttonText}>Leggi posizione</Text>
      </Pressable>
    </View>
  );
}

const locationStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#555" },
  error: { color: "#B00020" },
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
