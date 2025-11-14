import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../styles/theme";

const monthNames = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAY_WIDTH = `${100 / 7 - 1}%`;

const normalizeDate = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
};

const sameDay = (d1, d2) => {
  const date1 = normalizeDate(d1);
  const date2 = normalizeDate(d2);
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export default function CalendarView({ selectedDate, todos, onDateSelect }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const monthStats = useMemo(() => {
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthTodos = todos.filter((todo) => {
      const d = normalizeDate(todo.data);
      return d && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    const completed = monthTodos.filter((todo) => todo.isCompleted).length;
    return {
      total: monthTodos.length,
      completed,
      pending: monthTodos.length - completed,
    };
  }, [todos, viewDate]);

  const selectedDayTodos = useMemo(
    () => todos.filter((todo) => todo.data && sameDay(todo.data, selectedDate)),
    [todos, selectedDate]
  );

  const handleSelectDay = (date) => {
    onDateSelect?.(date);
  };

  const renderDays = () => {
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i += 1) {
      days.push(<View key={`empty-${i}`} style={styles.dayPlaceholder} />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(currentYear, currentMonth, day);
      const tasks = todos.filter((todo) => todo.data && sameDay(todo.data, date));
      const completed = tasks.filter((todo) => todo.isCompleted).length;
      const allCompleted = tasks.length > 0 && tasks.every((todo) => todo.isCompleted);
      const isSelected = sameDay(selectedDate, date);
      const isToday = sameDay(today, date);

      days.push(
        <Pressable
          key={day}
          style={[
            styles.day,
            tasks.length > 0 && styles.dayHasTasks,
            isSelected && styles.daySelected,
            isToday && styles.dayToday,
            allCompleted && styles.dayCompleted,
          ]}
          onPress={() => handleSelectDay(date)}
        >
          <Text
            style={[
              styles.dayText,
              (isSelected || isToday) && { color: "#fff" },
            ]}
          >
            {day}
          </Text>
          {tasks.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{completed}/{tasks.length}</Text>
            </View>
          )}
        </Pressable>
      );
    }

    return days;
  };

  const gotoToday = () => {
    const newToday = new Date(today.getFullYear(), today.getMonth(), 1);
    setViewDate(newToday);
    handleSelectDay(today);
  };

  const previousMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable style={styles.navButton} onPress={previousMonth}>
          <Text style={styles.navText}>←</Text>
        </Pressable>
        <View style={styles.monthInfo}>
          <Text style={styles.monthText}>
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </Text>
          {monthStats.total > 0 && (
            <Text style={styles.monthStats}>
              {monthStats.completed}/{monthStats.total} concluídas
            </Text>
          )}
        </View>
        <Pressable style={styles.navButton} onPress={nextMonth}>
          <Text style={styles.navText}>→</Text>
        </Pressable>
      </View>

      <Pressable style={styles.todayButton} onPress={gotoToday}>
        <Text style={styles.todayText}>Hoje</Text>
      </Pressable>

      <View style={styles.weekdays}>
        {weekdays.map((day) => (
          <Text key={day} style={styles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>{renderDays()}</View>

      <View style={styles.selectedList}>
        <Text style={styles.listTitle}>
          Tarefas de {selectedDate.toLocaleDateString("pt-BR")}:
        </Text>
        {selectedDayTodos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma tarefa neste dia.</Text>
        ) : (
          selectedDayTodos.map((todo) => (
            <Text
              key={todo.id}
              style={[
                styles.todoItem,
                todo.isCompleted && styles.todoItemCompleted,
              ]}
            >
              {todo.text} {todo.isCompleted ? "(Concluída)" : ""}
            </Text>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radii.md,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  monthInfo: {
    alignItems: "center",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  monthStats: {
    color: colors.muted,
    marginTop: spacing.xs,
  },
  todayButton: {
    backgroundColor: colors.success,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  todayText: {
    color: "#fff",
    fontWeight: "600",
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekdayText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: colors.muted,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  dayPlaceholder: {
    width: DAY_WIDTH,
    aspectRatio: 1,
  },
  day: {
    width: DAY_WIDTH,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs / 2,
  },
  dayHasTasks: {
    backgroundColor: "#fff7ed",
    borderColor: colors.warning,
  },
  daySelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayToday: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  dayCompleted: {
    backgroundColor: "#dcfce7",
    borderColor: colors.success,
  },
  dayText: {
    fontWeight: "600",
    color: colors.text,
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.sm,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  badgeText: {
    fontSize: 10,
    color: colors.text,
  },
  selectedList: {
    gap: spacing.xs,
  },
  listTitle: {
    fontWeight: "600",
    color: colors.text,
  },
  emptyText: {
    color: colors.muted,
  },
  todoItem: {
    color: colors.text,
  },
  todoItemCompleted: {
    textDecorationLine: "line-through",
    color: colors.muted,
  },
});

