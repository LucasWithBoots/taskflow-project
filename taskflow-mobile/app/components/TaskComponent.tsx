import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Task } from "../types";

interface TaskComponentProps {
  task: Task;
  onComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskComponent({
  task,
  onComplete,
  onDelete,
}: TaskComponentProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInUp}>
      <TouchableOpacity
        style={[
          styles.checkTaskTouchable,
          task.completed && styles.checkTaskCompleted,
        ]}
        onPress={() => onComplete(task.id)}
      >
        {task.completed && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </TouchableOpacity>
      <Text
        style={[
          styles.containerTitle,
          task.completed && styles.containerTitleCompleted,
        ]}
      >
        {task.title}
      </Text>
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Ionicons name="trash-outline" size={20} color="#BAB8B8" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#BAB8B8",
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  containerTitle: {
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  containerTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  checkTaskTouchable: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  checkTaskCompleted: {
    backgroundColor: "black",
  },
});
