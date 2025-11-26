import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TaskComponent from "./components/TaskComponent";
import { completeTask, createTask, deleteTask, loadTasks } from "./http/axios";

export default function Index() {
  const [taskTitle, setTaskTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
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
      setModalTitle("");
      setModalDescription("");
      setModalVisible(false);
    },
  });

  const { mutate: completeTaskMutation } = useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { mutate: deleteTaskMutation } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleOpenModal = () => {
    setModalTitle(taskTitle); // keep current shown title
    setModalDescription("");
    setModalVisible(true);
  };

  const handleSaveFromModal = () => {
    if (modalTitle.trim()) {
      addTask({ title: modalTitle, description: modalDescription });
      // addTask's onSuccess will clear states and close modal
    }
  };

  const handleAddTask = () => {
    // preserve behavior when quick-adding (if still desired)
    if (taskTitle.trim()) {
      addTask({ title: taskTitle });
    } else {
      // open modal if no title typed yet
      handleOpenModal();
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
        {/* Touchable area that opens modal for title + description */}
        <TouchableOpacity
          onPress={handleOpenModal}
          style={[styles.addTaskInput, { justifyContent: "center" }]}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              color: taskTitle ? "black" : "#888",
            }}
          >
            {taskTitle || "Add a new task..."}
          </Text>
        </TouchableOpacity>

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
        renderItem={({ item }) => (
          <TaskComponent
            task={item}
            onComplete={completeTaskMutation}
            onDelete={deleteTaskMutation}
          />
        )}
        style={{ width: "100%" }}
        contentContainerStyle={{ gap: 8 }}
        ListFooterComponent={<View style={{ height: 32 }} />} // <-- footer spacer
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Bottom modal for entering title and description */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          onPress={() => setModalVisible(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16 }}>
              New task
            </Text>
            <TextInput
              placeholder="Title"
              value={modalTitle}
              onChangeText={(text) => {
                setModalTitle(text);
                setTaskTitle(text); // reflect live in main touchable
              }}
              style={[styles.modalInput, { marginTop: 12 }]}
              onSubmitEditing={handleSaveFromModal}
              returnKeyType="done"
            />
            <TextInput
              placeholder="Description (optional)"
              value={modalDescription}
              onChangeText={setModalDescription}
              style={[
                styles.modalInput,
                { height: 80, textAlignVertical: "top" },
              ]}
              multiline
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={[styles.modalButton, { backgroundColor: "#eee" }]}
              >
                <Text style={{ fontFamily: "Poppins-Regular" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveFromModal}
                style={[styles.modalButton, { backgroundColor: "black" }]}
                disabled={isPending}
              >
                <Text style={{ color: "white", fontFamily: "Poppins-Regular" }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

  modalContainer: {
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    marginTop: 8,
    fontFamily: "Poppins-Regular",
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
