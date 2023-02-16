import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SwipeListView } from "react-native-swipe-list-view";
import Icons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("screen");

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const addHandler = async () => {
    if (text.trim().length > 5) {
      const newTodos = [
        ...todos,
        { title: text.trim(), id: Math.random().toString(), complete: false },
      ];
      setTodos(newTodos);
      setText("");
      await AsyncStorage.setItem("todo", JSON.stringify(newTodos)).catch(
        (error) => console.log(error)
      );
    } else if (text.trim().length <= 5) {
      Alert.alert("Todo List", "Task must be above 5 characters.", [
        { text: "Cancel" },
        { text: "Understand" },
      ]);
    }
  };

  const deleteHandler = async (index) => {
    // index
    const result = todos.filter((item, idx) => idx != index);
    setTodos(result);
    await AsyncStorage.setItem("todo", JSON.stringify(result)).catch((error) =>
      console.log(error)
    );

    // id
    // const result = todos.filter((item) => item.id != index);
    // setTodos(result);
  };

  const completeHandler = async (index) => {
    todos[index].complete = !todos[index].complete;
    await AsyncStorage.setItem("todo", JSON.stringify(todos)).then(async () => {
      await AsyncStorage.getItem("todo").then((data) =>
        setTodos(JSON.parse(data))
      );
    });
  };

  useEffect(() => {
    const storeData = async () => {
      const storage = await AsyncStorage.getItem("todo");
      const data = JSON.parse(storage);
      if (data !== null) {
        setTodos(data);
      }
    };
    storeData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar />
        <Text style={styles.title}>Todo</Text>

        <View
          style={{ marginTop: 30, alignItems: "center", paddingHorizontal: 20 }}
        >
          <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            style={styles.inputBox}
            placeholder="Enter Task"
          />
          <TouchableOpacity
            style={[
              styles.button,
              { padding: 15, paddingHorizontal: 30, marginTop: 20 },
            ]}
            onPress={addHandler}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#FFF",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <SwipeListView
          style={{ paddingHorizontal: 20, marginTop: 20 }}
          data={todos}
          keyExtractor={(item) => item.id}
          leftOpenValue={width / 5.5}
          rightOpenValue={-(width / 5.5)}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} activeOpacity={1}>
              <Text
                style={[
                  styles.listItem,
                  {
                    textDecorationLine: item.complete
                      ? "line-through"
                      : undefined,
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          renderHiddenItem={({ item, index }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={[styles.swipButton, { backgroundColor: "#047857" }]}
                onPress={() => completeHandler(index)}
              >
                <Icons name="checkmark-outline" size={30} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.swipButton}
                onPress={() => deleteHandler(index)}
              >
                <Icons name="trash-outline" size={30} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    color: "#0369a1",
    textAlign: "center",
    fontWeight: "900",
    letterSpacing: 5,
    textTransform: "uppercase",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    textShadowColor: "#444",

    paddingVertical: 15,
  },

  inputBox: {
    width: "100%",
    borderWidth: 2,
    fontSize: 18,
    paddingVertical: 15,
    paddingLeft: 20,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },

  button: {
    backgroundColor: "#1d4ed8",
    borderRadius: 10,
    elevation: 10,
  },

  listItem: {
    color: "#FFF",
    fontSize: 20,
    backgroundColor: "#0369a1",
    borderRadius: 5,

    padding: 20,
    marginVertical: 10,
  },

  rowBack: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,

    marginVertical: 10,
    overflow: "hidden",
  },

  swipButton: {
    backgroundColor: "#F94A29",
    justifyContent: "center",
    alignItems: "center",

    padding: 20,
  },
});
