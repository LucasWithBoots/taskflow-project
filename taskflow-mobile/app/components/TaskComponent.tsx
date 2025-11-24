import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Task } from "../types";

export default function TaskComponent({ task }: { task: Task }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkTaskTouchable} />
      <Text style={styles.containerTitle}>{task.title}</Text>
    </View>
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
  },
  checkTaskTouchable: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "black",
  },
});
