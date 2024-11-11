import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Pressable } from 'react-native';
import useSocket from '../../socket';

interface Todo {
  ID: string;
  NAME: string;
  TIMESTAMP: Date;
  STATUS: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const socket = useSocket();

  useEffect(() => {
    // Fetch tasks when the component mounts
    socket.fetchTasks();
  
    socket.onTaskFetched((tasks: Todo[]) => {
      setTodos(tasks); // Correctly set the fetched tasks
    });
  
    // Task added listener
    socket.onTaskAdded((task: Todo) => {
      setTodos((prevTodos) => [...prevTodos, task]);
    });
  
    // Task toggled listener
    socket.onTaskToggled((updatedTask: Todo) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.ID === updatedTask.ID ? { ...todo, STATUS: updatedTask.STATUS } : todo
        )
      );
    });
  
    // Task deleted listener
    socket.onTaskDeleted((taskId: string) => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.ID !== taskId));
    });
  
    // Cleanup listeners
    return () => {
      socket.onTaskFetched(() => {});
      socket.onTaskAdded(() => {});
      socket.onTaskToggled(() => {});
      socket.onTaskDeleted(() => {});
    };
  }, [socket]);
  


  const addTodo = () => {
    if (!newTodo.trim()) {
      setError('Todo text cannot be empty');
      return;
    }

    const taskData = newTodo;
    socket.addTask(taskData);
    setNewTodo('');
    setError(null);
  };

  const toggleTodo = (id: string, completed: boolean) => {
    socket.toggleTask({ id, completed: !completed });
  };

  const deleteTodo = (id: string) => {
    socket.deleteTask(id);
  };

  const renderCheckbox = (completed: boolean) => (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: completed ? '#4CAF50' : '#757575',
        backgroundColor: completed ? '#4CAF50' : 'transparent', // Green when completed, transparent otherwise
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
      }}
    >
      {/* No text rendering, just a circle */}
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      {error && (
        <View style={{ padding: 10, backgroundColor: '#ffebee', marginBottom: 10, borderRadius: 5 }}>
          <Text style={{ color: '#c62828' }}>{error}</Text>
        </View>
      )}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 50 }}>To do list</Text>
      <View style={{ flexDirection: 'row', marginTop: 50 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, padding: 10, marginRight: 10, borderRadius: 5 }}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todooo"
        />
        <TouchableOpacity onPress={addTodo} style={{ backgroundColor: '#007AFF', padding: 10 }}>
          <Text style={{ color: 'white' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
  data={todos}
  keyExtractor={(item) => item.ID} // Ensure this ID is unique
  renderItem={({ item }) => (
    <View style={{ flexDirection: 'row', padding: 15, marginBottom: 10, alignItems: "center" }}>
      <Pressable onPress={() => toggleTodo(item.ID, item.STATUS)} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        {renderCheckbox(item.STATUS)}
        <Text style={{ textDecorationLine: item.STATUS ? 'line-through' : 'none' }}>
          {item.NAME}
        </Text>
      </Pressable>
      <TouchableOpacity onPress={() => deleteTodo(item.ID)} style={{ backgroundColor: '#FF3B30', padding: 8, borderRadius: 5 }}>
        <Text style={{ color: 'white' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  )}
/>

    </View>
  );
}
