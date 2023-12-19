import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const firestore = getFirestore();
        const usersCollection = collection(firestore, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const makeAdmin = async (userId) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);
      await updateDoc(userRef, { isAdmin: true });
      updateLocalUser(userId, { isAdmin: true });
    } catch (error) {
      console.error('Error making user admin:', error);
    }
  };

  const makeUser = async (userId) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);
      await updateDoc(userRef, { isAdmin: false });
      updateLocalUser(userId, { isAdmin: false });
    } catch (error) {
      console.error('Error making user a regular user:', error);
    }
  };

  const  activateUser = async (userId) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);
    //   await deleteDoc(userRef);
      await updateDoc(userRef, { isActive: true });
      updateLocalUser(userId, { isActive: true });

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const  disableUser = async (userId) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);
    //   await deleteDoc(userRef);
      await updateDoc(userRef, { isActive: false });
      updateLocalUser(userId, { isActive: false });

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateLocalUser = (userId, newData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, ...newData } : user))
    );
  };
 

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text>ID: {item.id}</Text>
      <Text>Email: {item.email}</Text>
      <Text>isAdmin: {item.isAdmin ? 'Yes' : 'No'}</Text>
      <Text>isActive: {item.isActive ? 'Yes' : 'No'}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.blueButton]} onPress={() => makeAdmin(item.id)}>
          <Text>Make Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.yellowButton]} onPress={() => makeUser(item.id)}>
          <Text>Make User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.greenButton]} onPress={() => activateUser(item.id)}>
          <Text>Activate User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.redButton]} onPress={() => disableUser(item.id)}>
          <Text>Disable User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User List</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.userList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userList: {
    width: '100%',
  },
  userItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    marginRight: 10,
    padding: 6,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  greenButton: {
    backgroundColor: '#00CC33', // Green color for the specific button
  },
  redButton: {
    backgroundColor: '#CC6633', // Green color for the specific button
  },
  blueButton: {
    backgroundColor: '#ADD8E6', // Green color for the specific button
  },
  yellowButton: {
    backgroundColor: '#CCCC00', // Green color for the specific button
  },
});

export default UsersPage;
