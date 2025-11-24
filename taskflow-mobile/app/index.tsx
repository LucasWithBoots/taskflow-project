import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TaskComponent from "./components/TaskComponent";
import { createTask, loadTasks } from "./http/axios";

export default function Index() {
  const [taskTitle, setTaskTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => loadTasks(),
  });

  const { mutate: addTask, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTaskTitle("");
    },
  });

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      addTask({ title: taskTitle });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        gap: 20,
        paddingHorizontal: 16,
        paddingTop: 40,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 21 }}>
          Tasks
        </Text>
        <Text style={{ fontFamily: "Poppins-Regular" }}>
          {tasks?.filter((t) => t.completed).length || 0} of{" "}
          {tasks?.length || 0} completed
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          width: "100%",
        }}
      >
        <TextInput
          placeholder="Add a new task..."
          style={styles.addTaskInput}
          value={taskTitle}
          onChangeText={setTaskTitle}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTask}
          disabled={isPending}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TaskComponent task={item} />}
        style={{ width: "100%" }}
        contentContainerStyle={{ gap: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addTaskInput: {
    borderWidth: 1,
    padding: 13,
    flex: 1,
    fontFamily: "Poppins-Regular",
  },
  addButton: {
    backgroundColor: "black",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  addButtonText: {
    color: "white",
    fontFamily: "Poppins-Regular",
  },
});
