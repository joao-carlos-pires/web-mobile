import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import Parse from "../services/parseClient";
import { colors, radii, spacing } from "../styles/theme";
import TodoForm from "../components/TodoForm";
import TodoCard from "../components/TodoCard";
import CalendarView from "../components/Calendar";
import AddressLookup from "../components/AddressLookup";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(
    async (currentUser) => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const query = new Parse.Query("Todo");
        query.equalTo("user", currentUser);
        query.ascending("data");
        const results = await query.find();
        setTodos(
          results.map((todo) => {
            const parseDate = todo.get("data");
            return {
              id: todo.id,
              text: todo.get("text"),
              category: todo.get("category"),
              isCompleted: todo.get("isCompleted"),
              data: parseDate
                ? new Date(
                    parseDate.getFullYear(),
                    parseDate.getMonth(),
                    parseDate.getDate()
                  )
                : null,
            };
          })
        );
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as tarefas.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTodos(user);
  }, [user, fetchTodos]);

  const addTodo = async (text, category, date) => {
    if (!user) return;
    try {
      const TodoObj = new Parse.Object("Todo");
      TodoObj.set("text", text.trim());
      TodoObj.set("category", category);
      TodoObj.set("isCompleted", false);
      TodoObj.set("data", date);
      TodoObj.set("user", user);

      const saved = await TodoObj.save();
      setTodos((prev) => [
        ...prev,
        { id: saved.id, text, category, isCompleted: false, data: date },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a tarefa.");
    }
  };

  const toggleComplete = async (id) => {
    try {
      const query = new Parse.Query("Todo");
      const todo = await query.get(id);
      todo.set("isCompleted", !todo.get("isCompleted"));
      const updated = await todo.save();
      setTodos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isCompleted: updated.get("isCompleted") } : item
        )
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    }
  };

  const removeTodo = async (id) => {
    try {
      const query = new Parse.Query("Todo");
      const todo = await query.get(id);
      await todo.destroy();
      setTodos((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover a tarefa.");
    }
  };

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.isCompleted).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [todos]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>📅 Suas Tarefas</Text>
            {user && (
              <Text style={styles.subheading}>Olá, {user.get("username")}</Text>
            )}
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>

        <View style={styles.statsWrapper}>
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Concluídas" value={stats.completed} highlight />
          <StatCard label="Pendentes" value={stats.pending} warning />
        </View>

        <AddressLookup />
        <TodoForm onAddTodo={addTodo} />

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator />
            <Text style={styles.loaderText}>Carregando tarefas...</Text>
          </View>
        ) : todos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TodoCard
                todo={item}
                onToggleComplete={() => toggleComplete(item.id)}
                onRemove={() => removeTodo(item.id)}
              />
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            contentContainerStyle={{ marginBottom: spacing.lg }}
          />
        )}

        <CalendarView
          todos={todos}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, highlight, warning }) {
  return (
    <View
      style={[
        styles.statCard,
        highlight && styles.statHighlight,
        warning && styles.statWarning,
      ]}
    >
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subheading: {
    color: colors.muted,
    marginTop: spacing.xs,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  statsWrapper: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radii.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statHighlight: {
    borderWidth: 1,
    borderColor: colors.success,
  },
  statWarning: {
    borderWidth: 1,
    borderColor: colors.warning,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: spacing.xs,
  },
  loader: {
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  loaderText: {
    color: colors.muted,
  },
  empty: {
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  emptyText: {
    color: colors.muted,
  },
});

