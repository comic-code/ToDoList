import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Keyboard,
  Alert,
  AsyncStorage } from 'react-native';

import { Ionicons, MaterialIcons } from "@expo/vector-icons"

export default function App() {
  
  const[task, setTask] = useState([]);
  const[newTask, setNewTask] = useState('');

  async function addTask() {

    const search = task.filter(task => task === newTask);

    if(search.length !== 0) {
      Alert.alert('Atenção!', 'Tarefa já existe');
      return
    }

    if(newTask == '') {
      Alert.alert('Atenção!', 'É necessário digitar alguma coisa.');
      return
    }

    setTask([ ...task ,newTask]);
    setNewTask('');
    
    Keyboard.dismiss();
  }

  async function removeTask(item) {

    Alert.alert(
      "Deletar Tarefa",
      "Tem certeza que deseja remover esta tarefa?",
      [
        {
          text: "Cancelar",
          onPress: () => {
            return;
          },
          style: 'cancel'
        },
        {
          text: "Prosseguir",
          onPress: () => {
            setTask(task.filter(tasks => tasks !== item));
          }
        }
      ],
      {cancelable: false}
    )
  }

  // Persistência de dados
  

  useEffect(() => {
    async function loadDate() {
      const task = await AsyncStorage.getItem('task');

      if(task) {
        setTask(JSON.parse(task));
      }
    }
    loadDate();
  }, []);


  useEffect(() => {

    async function saveData() {
      AsyncStorage.setItem('task', JSON.stringify(task));
    }
    saveData();
  }, [task]);

  return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#7159C1"/>
        
        <View style={styles.body}>
          <FlatList
            style={styles.flatList}
            data={task}
            keyExtractor={item => item.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.taskView}>
                <Text style={styles.taskText}>{item}</Text>
                <TouchableOpacity onPress={() => removeTask(item)}>
                  <MaterialIcons
                    name="delete-forever"
                    size={25}
                    color="#f64c75"  
                  />
                </TouchableOpacity>
              </View> 
            )}
          />
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Digite uma nova tarefa"
            placeholderTextColor="#aaa"
            onChangeText={text => setNewTask(text)}
            value={newTask}
          />
          <TouchableOpacity style={styles.btn}>
            <Ionicons
              name="ios-add"
              size={40}
              color="#fff"
              onPress={() => addTask()}
            />  
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159C1',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  body: {
    flex: 1
  },

  flatList: {
    flex: 1,
    marginTop: 5
  },

  taskView: {
    marginBottom: 15,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#eee',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  taskText: {
    fontSize: 14,
    fontWeight: 'bold'
  },

  form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },

  btn: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7159C1',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#fff',
    marginLeft: 20
  }

});
