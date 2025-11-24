import { useQuery } from "@tanstack/react-query";
import { FlatList, Text, View } from "react-native";
import { loadTasks } from "./http/axios";

export default function Index() {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => loadTasks(),
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <View><Text>{item.title}</Text></View>}
      />
    </View>
  );
}
