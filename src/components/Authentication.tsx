import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type AuthenticationProps = {
  onAuthenticate?: (mode: 'login' | 'signup', email: string, password: string) => void;
};

export default function Authentication({ onAuthenticate }: AuthenticationProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Dati mancanti', 'Inserisci email e password per continuare.');
      return;
    }

    onAuthenticate?.(mode, email.trim(), password);
    Alert.alert(
      mode === 'login' ? 'Accesso' : 'Registrazione',
      mode === 'login'
        ? 'Autenticazione completata.'
        : 'Account creato con successo.',
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{mode === 'login' ? 'Bentornato' : 'Crea il tuo account'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'login'
            ? 'Accedi per continuare a esplorare le ricette italiane.'
            : 'Registrati per salvare i tuoi preferiti e non perdere nulla.'}
        </Text>

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          value={email}
        />

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        <Pressable onPress={handleSubmit} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {mode === 'login' ? 'Accedi' : 'Registrati'}
          </Text>
        </Pressable>

        <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          <Text style={styles.switchText}>
            {mode === 'login' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f7f2e8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2f2a24',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7a6d61',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2d7c7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
    color: '#2f2a24',
  },
  primaryButton: {
    backgroundColor: '#b64f2f',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#b64f2f',
    fontWeight: '600',
  },
});
