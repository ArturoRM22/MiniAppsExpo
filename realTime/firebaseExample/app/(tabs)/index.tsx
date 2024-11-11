import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Pressable } from 'react-native';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timestamp: Date;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'todos'),
        (snapshot) => {
          const todoList: Todo[] = [];
          snapshot.forEach((doc) => {
            todoList.push({ 
              id: doc.id, 
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate() 
            } as Todo);
          });
          // Sort todos: incomplete first, then by timestamp
          todoList.sort((a, b) => {
            if (a.completed === b.completed) {
              return b.timestamp.getTime() - a.timestamp.getTime();
            }
            return a.completed ? 1 : -1;
          });
          setTodos(todoList);
          setError(null);
        },
        (error) => {
          console.error('Firestore error:', error);
          setError('Error connecting to database. Please check your internet connection.');
          Alert.alert('Error', 'Failed to connect to database. Please check your internet connection.');
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Setup error:', err);
      setError('Failed to initialize database connection');
    }
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() === '') return;

    try {
      await addDoc(collection(db, 'todos'), {
        text: newTodo,
        completed: false,
        timestamp: new Date()
      });
      setNewTodo('');
      setError(null);
    } catch (error) {
      console.error('Error adding todo:', error);
      Alert.alert('Error', 'Failed to add todo. Please try again.');
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, {
        completed: !currentStatus
      });
      setError(null);
    } catch (error) {
      console.error('Error updating todo:', error);
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      setError(null);
    } catch (error) {
      console.error('Error deleting todo:', error);
      Alert.alert('Error', 'Failed to delete todo. Please try again.');
    }
  };

  const renderCheckbox = (completed: boolean) => (
    <View style={{
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: completed ? '#4CAF50' : '#757575',
      backgroundColor: completed ? '#4CAF50' : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10
    }}>
      {completed && (
        <Text style={{ color: 'white', fontSize: 16 }}>✓</Text>
      )}
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
      
  
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginRight: 10,
            borderRadius: 5
          }}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Agrega una nueva tarea"
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 10,
            borderRadius: 5,
            justifyContent: 'center'
          }}
          onPress={addTodo}
        >
          <Text style={{ color: 'white' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View 
            style={{ 
              flexDirection: 'row',
              padding: 15,
              backgroundColor: '#f8f8f8',
              marginBottom: 10,
              borderRadius: 5,
              alignItems: 'center'
            }}
          >
            <Pressable
              onPress={() => toggleTodo(item.id, item.completed)}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            >
              {renderCheckbox(item.completed)}
              <Text style={{ 
                flex: 1,
                textDecorationLine: item.completed ? 'line-through' : 'none',
                color: item.completed ? '#757575' : '#000000'
              }}>
                {item.text}
              </Text>
            </Pressable>

            <TouchableOpacity
              onPress={() => deleteTodo(item.id)}
              style={{
                backgroundColor: '#FF3B30',
                padding: 8,
                borderRadius: 5
              }}
            >
              <Text style={{ color: 'white' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}