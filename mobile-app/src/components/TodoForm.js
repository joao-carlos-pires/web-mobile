import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { colors, radii, spacing } from "../styles/theme";

const categories = ["Trabalho", "Pessoal", "Estudos", "Saúde"];

export default function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Campo obrigatório", "Por favor, digite o título da tarefa");
      return;
    }
    if (!category) {
      Alert.alert("Campo obrigatório", "Por favor, escolha uma categoria");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Campo obrigatório", "Por favor, selecione uma data");
      return;
    }
    onAddTodo(title.trim(), category, selectedDate);
    setTitle("");
    setCategory("");
    setSelectedDate(new Date());
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Criar tarefa:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o título da tarefa"
        value={title}
        onChangeText={setTitle}
      />
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.picker}
        >
          <Picker.Item label="Escolha uma categoria" value="" />
          {categories.map((cat) => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
      </View>
      <Pressable
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Data: {selectedDate.toLocaleDateString("pt-BR")}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={(_, date) => {
            if (Platform.OS !== "ios") {
              setShowPicker(false);
            }
            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}

      <Pressable style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Criar tarefa</Text>
      </Pressable>
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
  heading: {
    fontWeight: "600",
    fontSize: 18,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.sm,
  },
  dateButtonText: {
    color: colors.text,
  },
  submit: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});

