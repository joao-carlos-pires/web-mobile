import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors, radii, spacing } from "../styles/theme";
import backgroundImage from "../../assets/images/background.jpg";

export default function SignupScreen({ navigation }) {
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username.trim() || !password) {
      setMessage({ type: "error", text: "Informe usuário e senha." });
      return;
    }
    setLoading(true);
    try {
      await signUp(username.trim(), password);
      setMessage({
        type: "success",
        text: "Usuário cadastrado! Você pode fazer login.",
      });
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.wrapper}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {message && (
              <View
                style={[
                  styles.message,
                  message.type === "error" ? styles.error : styles.success,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            )}
            <Text style={styles.title}>Cadastro</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </Pressable>
            <Pressable
              style={styles.linkWrapper}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.linkText}>Já possui conta? Faça login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wrapper: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    backgroundColor: "#fdfdfd",
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  message: {
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  success: {
    backgroundColor: "#dcfce7",
  },
  error: {
    backgroundColor: "#fee2e2",
  },
  messageText: {
    color: colors.text,
    textAlign: "center",
  },
  linkWrapper: {
    marginTop: spacing.sm,
  },
  linkText: {
    textAlign: "center",
    color: colors.accent,
    fontWeight: "600",
  },
});

