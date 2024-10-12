import { StyleSheet, Text, View } from 'react-native';
import { useUserContext } from '../userContext';


export default function TabTwoScreen() {
  // Set the state type to UserInfo | null
  const {userInfo} = useUserContext();

  if (!userInfo) {
    return <Text>Loading user information...</Text>; // Placeholder while loading
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      <Text style={styles.label}>Name: {userInfo.name}</Text>
      <Text style={styles.label}>Last Name: {userInfo.lastName}</Text>
      <Text style={styles.label}>Age: {userInfo.age}</Text>
      <Text style={styles.label}>Gender: {userInfo.gender}</Text>
      <Text style={styles.label}>Address: {userInfo.address}</Text>
      <Text style={styles.label}>Weight: {userInfo.weight} kg</Text>
      <Text style={styles.label}>Height: {userInfo.height} cm</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
});
