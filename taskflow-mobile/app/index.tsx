import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TaskComponent from "./components/TaskComponent";
import { loadTasks } from "./http/axios";

export default function Index() {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => loadTasks(),
  });

  // const {mutate} = useMutation({

  // })

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
        <Text style={{ fontFamily: "Poppins-Regular" }}>0 of 0 completed</Text>
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
        />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TaskComponent task={item} />}
        style={{ width: "100%" }}
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
