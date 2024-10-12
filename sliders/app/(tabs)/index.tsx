import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useUserContext } from '../userContext'; // Adjust the path accordingly
import {Slider} from '@miblanchard/react-native-slider';
import SliderExample from '@/components/slider';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Get the setUserInfo function from the context
  const { setUserInfo } = useUserContext();

  const handleSubmit = async () => {
    if (!name || !lastName || !age || !gender || !address || !weight || !height) {
      Alert.alert('Error', 'Please fill in all fields');
      console.log('Error', 'Please fill in all fields');
      return;
    }

    const userInfo = {
      name,
      lastName,
      age: parseInt(age),
      gender,
      address,
      weight: parseFloat(weight),
      height: parseFloat(height), 
    };

    try {
      // Call setUserInfo to save the user info
      await setUserInfo(userInfo);

      console.log('Success', 'User information saved successfully!');
      Alert.alert('Success', 'User information saved successfully!');

      setName('');
      setLastName('');
      setAge('');
      setGender('');
      setAddress('');
      setWeight('');
      setHeight('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user information.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        inputMode="numeric"
        value={age}
        onChangeText={setAge}
      />

      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        inputMode="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        inputMode="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10, // Horizontal padding for input
  },
  button: {
    backgroundColor: '#007BFF', // Button color
    paddingVertical: 10, // Vertical padding for the button
    paddingHorizontal: 20, // Left and right padding for the button
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 16,
  },
});
