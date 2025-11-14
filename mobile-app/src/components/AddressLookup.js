import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, radii, spacing } from "../styles/theme";

export default function AddressLookup() {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setAddress(null);
    const numeric = cep.replace(/\D/g, "");
    if (numeric.length !== 8) {
      setError("CEP inválido (use 8 dígitos).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${numeric}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError("CEP não encontrado.");
        return;
      }

      setAddress({
        rua: data.logradouro || "(sem logradouro)",
        cidade: data.localidade || "",
        uf: data.uf || "",
      });
    } catch (err) {
      setError("Falha ao consultar o CEP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Pesquisar endereço:</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={cep}
          onChangeText={setCep}
          placeholder="Digite o CEP (ex: 01001-000)"
          keyboardType="number-pad"
          maxLength={9}
        />
        <Pressable style={styles.button} onPress={handleSearch}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Buscar</Text>
          )}
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {address && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Endereço encontrado</Text>
          <View style={styles.grid}>
            <Text style={styles.label}>Rua</Text>
            <Text style={styles.value}>{address.rua}</Text>
            <Text style={styles.label}>Cidade</Text>
            <Text style={styles.value}>{address.cidade}</Text>
            <Text style={styles.label}>UF</Text>
            <Text style={styles.value}>{address.uf}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  button: {
    backgroundColor: colors.success,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  error: {
    backgroundColor: "#fee2e2",
    padding: spacing.sm,
    borderRadius: radii.sm,
    color: colors.error,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 14,
    color: colors.muted,
  },
  grid: {
    gap: spacing.xs,
  },
  label: {
    fontWeight: "600",
    color: colors.text,
  },
  value: {
    color: colors.muted,
  },
});

