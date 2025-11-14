import { Pressable, StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";
import { colors, radii, spacing } from "../styles/theme";

const formatDate = (date) => {
  if (!date) return "";
  try {
    return format(new Date(date), "dd/MM/yyyy");
  } catch {
    return "";
  }
};

export default function TodoCard({ todo, onToggleComplete, onRemove }) {
  return (
    <View style={[styles.card, todo.isCompleted && styles.completedCard]}>
      <View style={styles.content}>
        <Text
          style={[styles.title, todo.isCompleted && styles.completedText]}
          numberOfLines={2}
        >
          {todo.text}
        </Text>
        <Text style={styles.meta}>Categoria: {todo.category}</Text>
        {todo.data && (
          <Text style={styles.meta}>Data: {formatDate(todo.data)}</Text>
        )}
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[
            styles.actionButton,
            todo.isCompleted ? styles.undoButton : styles.completeButton,
          ]}
          onPress={onToggleComplete}
        >
          <Text style={styles.actionText}>
            {todo.isCompleted ? "Desfazer" : "Completar"}
          </Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.removeButton]} onPress={onRemove}>
          <Text style={styles.actionText}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: colors.muted,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
  },
  actions: {
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  actionButton: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  undoButton: {
    backgroundColor: "#facc15",
  },
  removeButton: {
    backgroundColor: colors.error,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
});

