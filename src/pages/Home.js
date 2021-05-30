import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react'
// import * as Notifications from 'expo-notifications'
import { TouchableOpacity, StyleSheet, Text, View, ToastAndroid, SafeAreaView, FlatList, Image, Alert, TextInput } from 'react-native'
import { useFonts } from 'expo-font'
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Modalize } from 'react-native-modalize'
import Modal from 'react-native-modal'
import * as firebase from 'firebase'
import Axios from 'axios';
import { db, app } from '../config'


export default function Dashboard({ navigation, route }) {
     const [Data, setData] = React.useState([])
     const [isEmpty, setIsEmpty] = React.useState(false)
     const [username, setUsername] = React.useState('')
     const [message, setMessage] = React.useState('')
     const [user, setUser] = React.useState({})
     const [names, setNames] = React.useState('hanif')

     console.log(route);

     React.useEffect(() => {
          const userInfo = app.auth().currentUser
          if (!userInfo) {
               navigation.navigate('LoginPage')
          }
          setUser(userInfo)
          console.log('userInfo get sukses');
          getUsername()
               .then(currentUser => {
                    fetchMessageFromServer(currentUser)
               })
               .catch(e => {
                    console.log(e);
                    Alert.alert('Failed Send Message', 'Username ' + username + ' not found!')
               })

     }, [])

     if (!user) return (<></>)
     // const userInfo = app.auth().currentUser
     // if (userInfo) {
     //      db.ref('/users').on('value', () => {
     //           fetchMessageFromServer(names)
     //      })
     // }
     const timeFormat = (time) => `${time.getHours().toString().length === 1 ? time.getHours() + '0' : time.getHours()}:${time.getMinutes().toString().length === 1 ? '0' + time.getMinutes() : time.getMinutes()}`

     const getUsernameTarget = (email) => {
          return new Promise((resolve, reject) => {
               Axios.get('https://rethasicapp-default-rtdb.firebaseio.com/userProfile/' + email.replace(/@.+/g, '') + '/data.json')
                    .then(({ data }) => {
                         resolve(data)
                    }).catch(reject)
          })
     }


     const getUsername = () => {
          return new Promise((resolve, reject) => {
               const userInfo = app.auth().currentUser
               Axios.get('https://rethasicapp-default-rtdb.firebaseio.com/userProfile/' + userInfo.email.replace(/@.+/g, '') + '/data.json')
                    .then(({ data }) => {
                         console.log(data);
                         resolve(data.username)
                    })
                    .catch(reject)
          })
     }

     const requestRead = async (from, to, time = new Date()) => {
          // console.log(from, to);
          const indexChat = Data.findIndex(i => i.name == to)
          {
               //From (self chat)
               Axios({
                    method: 'PUT',
                    url: 'https://rethasicapp-default-rtdb.firebaseio.com/users/' + from + '/chat.json',
                    headers: {
                         'content-type': 'application/json'
                    },
                    data: [{
                         id: Data[indexChat].id,
                         name: to,
                         isRead: true,
                         isSent: true,
                         isReceived: false,
                         isMe: Data[indexChat].isMe,
                         message: Data[indexChat].message,
                         time: Data[indexChat].time,
                         timestamp: Data[indexChat].timestamp,
                         totalMessage: Data[indexChat].totalMessage
                    }]
               }).catch(console.log)
          }
          {
               // Target chat
               const dataTarget = await Axios.get('https://rethasicapp-default-rtdb.firebaseio.com/users/' + to + '/chat.json')
               const indexTarget = dataTarget.data.findIndex(i => i.name == from)
               Axios({
                    method: 'PUT',
                    url: 'https://rethasicapp-default-rtdb.firebaseio.com/users/' + to + '/chat.json',
                    headers: {
                         'content-type': 'application/json'
                    },
                    data: [{
                         id: dataTarget.data[indexTarget].isRead.id,
                         name: from,
                         isRead: true,
                         isSent: false,
                         isReceived: true,
                         isMe: dataTarget.data[indexTarget].isMe,
                         message: dataTarget.data[indexTarget].message,
                         time: dataTarget.data[indexTarget].time,
                         timestamp: dataTarget.data[indexTarget].timestamp,
                         totalMessage: dataTarget.data[indexTarget].totalMessage
                    }]
               })
          }
          fetchMessageFromServer(from)
     }

     const sendMessage = (from, to, message, time = new Date()) => {
          console.log(Data);
          Axios({
               method: 'PUT',
               url: 'https://rethasicapp-default-rtdb.firebaseio.com/users/' + to + '/chat.json',
               headers: {
                    'content-type': 'application/json'
               },
               data: [...Data, {
                    id: String(Data.length + 1),
                    name: from,
                    isRead: false,
                    isSent: false,
                    isReceived: true,
                    isMe: [false],
                    message: [message],
                    time: timeFormat(time),
                    timestamp: String(time.valueOf()),
                    totalMessage: "1"
               }]
          })
               .then(() => {

                    Axios({
                         method: 'PUT',
                         url: 'https://rethasicapp-default-rtdb.firebaseio.com/users/' + from + '/chat.json',
                         headers: {
                              'content-type': 'application/json'
                         },
                         data: [...Data, {
                              id: String(Data.length + 1),
                              name: to,
                              isRead: true,
                              isSent: true,
                              isReceived: false,
                              isMe: [true],
                              message: [message],
                              time: timeFormat(time),
                              timestamp: String(time.valueOf()),
                              totalMessage: "1"
                         }]
                    }).then(() => {
                         fetchMessageFromServer(from)
                    }).catch(e => {
                         console.log(e);
                    })
               })
               .catch(e => {
                    Alert.alert('Send Failed', 'Error send message! maybe you input the wrong user.')
                    console.log(e);
               })
     }

     // sendMessage()

     const updateMessage = (from, to, message, time = new Date()) => {
          if (Data?.length === 0) {
               console.log('new');
               sendMessage(from, to, message, time)
          } else {
               console.log('old');
               const indexName = Data.findIndex(i => i.name == from)

               if (indexName == -1) {
                    sendMessage(from, to, message, time)
                    return
               }
               Data[indexName].message.push(message)
               let newDataTo = {
                    id: Data[indexName].id,
                    name: from,
                    isRead: false,
                    isSent: false,
                    isReceived: true,
                    isMe: [...Data[indexName].isMe, false],
                    message: Data[indexName].message,
                    time: timeFormat(time),
                    timestamp: String(time.valueOf()),
                    totalMessage: String(Number(Data[indexName].totalMessage) + 1)
               }
               Data[indexName] = newDataTo
               console.log(indexName);
               if (!to) {

               }
               Axios({
                    method: 'PUT',
                    url: 'https://rethasicapp-default-rtdb.firebaseio.com/users/' + to + '/chat.json',
                    headers: {
                         'content-type': 'application/json'
                    },
                    data: [...Data]
               })
                    .then(() => {
                         // console.log(data);
                         // fetchMessageFromServer(from)
                         let newDataFrom = {
                              id: Data[indexName].id,
                              name: from,
                              isRead: true,
                              isSent: true,
                              isReceived: false,
                              isMe: [...Data[indexName].isMe, true],
                              message: Data[indexName].message,
                              time: timeFormat(time),
                              timestamp: String(time.valueOf()),
                              totalMessage: String(Number(Data[indexName].totalMessage) + 1)
                         }
                         let meData = {
                              dat: Data[indexName] = newDataFrom
                         }
                         Axios({
                              method: 'PUT',
                              url: 'https://rethasicapp-default-rtdb.firebaseio.com/users/' + from + '/chat.json',
                              headers: {
                                   'content-type': 'application/json'
                              },
                              data: [...meData.dat]
                         })
                              .then(() => {
                                   // console.log(data);
                                   console.log('calvak');
                                   fetchMessageFromServer(from)
                              })
                              .catch(e => {
                                   console.log(e);
                              })
                    })
                    .catch(e => {
                         console.log('eRR');
                         console.log(e);
                    })
          }
     }

     // updateMessage('Ferdi', currentUser)


     const fetchMessageFromServer = (user) => {
          // console.log(db);
          Axios.get(`https://rethasicapp-default-rtdb.firebaseio.com/users/${user}/chat.json`)
               .then(({ data }) => {
                    if (!data) {
                         return setIsEmpty(true)
                    }
                    function compare(a, b) {
                         if (a.timestamp < b.timestamp) {
                              return 1;
                         }
                         if (a.timestamp > b.timestamp) {
                              return -1;
                         }
                         return 0;
                    }

                    console.log('Sukses fetch data');
                    setIsEmpty(false)
                    // console.log(data);
                    data.sort(compare)
                    setData(data)
               })
               .catch(e => {
                    console.log(e);
                    Alert.alert('Error', 'Error fetch data')
               })

     }

     const [load] = useFonts({
          'alex': require('../../assets/fonts/AlexandriaFLF.ttf'),
          'alex-bold': require('../../assets/fonts/AlexandriaFLF-Bold.ttf'),
          'alex-bolditalic': require('../../assets/fonts/AlexandriaFLF-BoldItalic.ttf'),
          'alex-italic': require('../../assets/fonts/AlexandriaFLF-Italic.ttf')
     })



     // var firebaseConfig = {
     //      apiKey: "AIzaSyBETkUN7KUTfRSgPG29NbEYCH8BcSlzHkc",
     //      authDomain: "rethasicapp.firebaseapp.com",
     //      databaseURL: "https://rethasicapp-default-rtdb.firebaseio.com",
     //      projectId: "rethasicapp",
     //      storageBucket: "rethasicapp.appspot.com",
     //      messagingSenderId: "590738393978",
     //      appId: "1:590738393978:web:97039262dc61e29946a4c3",
     //      measurementId: "G-JB5DQBHLV7"
     // };

     // if (!firebase.apps.length) {
     //      firebase.initializeApp(firebaseConfig);
     // }

     // const showToast = (msg) => {
     //      ToastAndroid.showWithGravityAndOffset(msg, 5, ToastAndroid.BOTTOM, 25, 50)
     // }
     const modalizeRef = React.useRef(null)
     const onOpen = () => {
          // console.log('here');
          modalizeRef.current?.open();
     };

     if (!load) return null

     return (
          <View style={styles.container}>
               <View style={styles.content}>
                    {isEmpty ? <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', height: '80%', width: '100%' }}><Text style={{ fontFamily: 'alex', fontSize: 20 }}>Still empty here ...</Text></View> : <></>}
                    <TouchableOpacity style={{
                         width: 60,
                         height: 60,
                         borderRadius: 30,
                         backgroundColor: '#ee6e73',
                         position: 'absolute',
                         bottom: 80,
                         justifyContent: 'center',
                         alignItems: 'center',
                         alignSelf: 'center'
                    }}>
                         <Ionicons name="pencil-sharp" size={30} color='black' onPress={() => {
                              console.log('ya');
                              // updateMessage('Adit', currentUser, 'skuy')
                              // return console.log(user.email.replace(/@.+/, ''));
                              fetchMessageFromServer(user.email.replace(/@.+/, ''))
                              onOpen()
                         }} />
                    </TouchableOpacity>
                    <SafeAreaView>
                         <FlatList
                              data={Data}
                              keyExtractor={(item, index) => item.timestamp}
                              renderItem={({ item }) => {
                                   // console.log(Data);
                                   const TotalMsg = () => {
                                        if (!item.isRead) {
                                             const total = Number(item.totalMessage.replace('+', ''))
                                             const strTotal = total > 99 ? '99+' : item.totalMessage
                                             return (
                                                  <View style={{ margin: 10, backgroundColor: '#03bafc', height: 24, width: 24, borderRadius: 25, alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                                                       <Text style={{ color: 'black', fontFamily: 'alex-bold', fontSize: 10 }} >{strTotal}</Text>
                                                  </View>
                                             )
                                        } else {
                                             return (<></>)
                                        }
                                   }


                                   const CircleCheck = () => {
                                        if (item.isSent && !item.isReceived) {
                                             return (
                                                  <View style={{ marginRight: 20, paddingVertical: 20, position: 'absolute', right: 0, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                       <Text style={{ color: 'black', fontFamily: 'alex', fontSize: 8 }}>{item.time}</Text>
                                                       <View style={{ padding: 10 }} />
                                                       <MaterialIcons name="check-circle" size={18} />
                                                  </View>
                                             )
                                        } else if (item.isSent && item.isReceived) {
                                             return (
                                                  <View style={{ marginRight: 20, paddingVertical: 20, position: 'absolute', right: 0, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                       <Text style={{ color: 'black', fontFamily: 'alex', fontSize: 8 }}>{item.time}</Text>
                                                       <View style={{ padding: 10 }} />
                                                       <MaterialIcons name="check-circle" color='#03bafc' size={18} />
                                                  </View>
                                             )
                                        } else if (!item.isSent && !item.isReceived) {
                                             return (
                                                  <View style={{ marginRight: 20, paddingVertical: 20, position: 'absolute', right: 0, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                       <Text style={{ color: 'black', fontFamily: 'alex', fontSize: 8 }}>{item.time}</Text>
                                                       <View style={{ padding: 10 }} />
                                                       <Ionicons name="timer-outline" size={18} />
                                                  </View>
                                             )
                                        } else {
                                             return (
                                                  <View style={{ marginRight: 20, paddingVertical: 20, position: 'absolute', right: 0, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                       <Text style={{ color: 'black', fontFamily: 'alex', fontSize: 8 }}>{item.time}</Text>
                                                       <View style={{ padding: 10 }} />
                                                  </View>
                                             )
                                        }
                                   }

                                   const PhotoProfile = () => {
                                        if (item.image) {
                                             return (
                                                  <Image style={{ width: 50, height: 50, borderRadius: 20 }} source={{ uri: item.image }} />
                                             )
                                             // console.log('ppp');
                                        } else {
                                             return (
                                                  <Image style={{ width: 50, height: 50, borderRadius: 20 }} source={require('../../assets/blank.png')} />
                                             )
                                             // console.log('non ppp');
                                        }
                                   }

                                   const messageNew = item.message[item.message.length - 1]

                                   // console.log(messageNew);
                                   return (
                                        <>
                                             <TouchableOpacity style={styles.messageContainer}
                                                  onPress={() => {
                                                       getUsernameTarget(item.name)
                                                            .then(console.log)
                                                            .catch(console.log)
                                                       navigation.navigate('ChatsPage', {
                                                            uri: item.image,
                                                            name: item.name
                                                       })

                                                       // onOpen()
                                                       // sendMessage()
                                                       // updateMessage('Agus', currentUser, 'Work')
                                                  }}
                                             >
                                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                       <PhotoProfile />
                                                       {/* <MaterialIcons size={50} style={{ width: 50, height: 50, borderRadius: 20 }} name="account-circle" /> */}
                                                       <View style={{}}>
                                                            <Text style={{ paddingVertical: 5, paddingLeft: 24, paddingRight: 100, fontFamily: 'alex-bold' }}>{item.name}</Text>
                                                            <Text style={{ paddingLeft: 24, paddingRight: 100, fontFamily: 'alex', fontSize: 10 }}>{messageNew.substr(0, 50) + (messageNew.length > 50 ? '...........' : '')}</Text>
                                                       </View>
                                                  </View>
                                                  <TotalMsg />
                                                  <CircleCheck />
                                             </TouchableOpacity>
                                             <View style={{ width: '100%', height: 1, backgroundColor: '#868787' }} />
                                        </>
                                   )
                              }}
                         >
                         </FlatList>
                    </SafeAreaView>
               </View>

               <Modalize ref={modalizeRef}>
                    <View style={styles.modalContent}>
                         <View style={styles.sendMessage}>
                              <Text style={{ fontFamily: 'alex-bold', fontSize: 17 }}>Input your message here to start</Text>
                         </View>
                         <View style={{ marginHorizontal: 20, }}>
                              <TextInput
                                   style={styles.input}
                                   value={username}
                                   onChangeText={setUsername}
                                   placeholder='username'
                              />
                              <TextInput
                                   style={styles.input}
                                   value={message}
                                   onChangeText={setMessage}
                                   placeholder='Your message'
                              />
                         </View>
                         <TouchableOpacity style={styles.sendButton}
                              onPress={() => {
                                   // sendMessage('hanif', 'wabot', 'Hi')
                                   // updateMessage('hanif', 'wabot', 'Hi2')
                                   const indexUser = Data.findIndex(i => i.name === username)
                                   if (indexUser !== -1) {
                                        Alert.alert('Data exist', 'You have this chat on your account')
                                        modalizeRef.current?.close();
                                        setMessage('')
                                        setUsername('')
                                        return
                                   }
                                   // const userN = app.auth().currentUser
                                   // return console.log('USERRRRRRRR', user);
                                   console.log('sent');
                                   console.log('usr : ' + username);
                                   updateMessage(user.email.replace(/@.+/g, ''), username, message)
                                   modalizeRef.current?.close();
                                   setMessage('')
                                   setUsername('')
                              }}
                         >
                              <MaterialCommunityIcons name="rocket-launch" size={70} />
                         </TouchableOpacity>
                    </View>
               </Modalize>
               <StatusBar style="auto" />
          </View >
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
     },
     content: {
          height: '100%',
          width: '100%',
          backgroundColor: 'white'
     },
     messageContainer: {
          // borderWidth: 1,
          paddingHorizontal: 24,
          paddingVertical: 20,
          flexDirection: 'row',
     },
     messageContainerDark: {
          backgroundColor: 'black'
     },
     sendMessage: {
          // backgroundColor: 'red',
          margin: 50,
          alignItems: 'center',
          // width: '100%',
          // height: '100%'
     },
     input: {
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 10,
          paddingHorizontal: 20,
          marginTop: 20,
          marginBottom: 30,
          height: 50,
     },
     sendButton: {
          marginTop: 70,
          alignItems: 'center'
     },
     modalContent: {
          padding: 10,
          paddingTop: 70
     }
})
