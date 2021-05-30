import React from 'react'
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useFonts } from 'expo-font'
import Axios from 'axios'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { app } from '../config'

export default function ChatsPage({ navigation, route }) {

     const [messages, setMessages] = React.useState([])
     const [isMe, setIsme] = React.useState([])
     const [Data, setData] = React.useState([])
     const [text, setText] = React.useState('')

     const nameNow = route.params.name
     const userNow = app.auth().currentUser

     React.useEffect(() => {
          const user = app.auth().currentUser
          fetchMessageFromServer(user.email.replace(/@.+/g, ''))
     }, [])


     const timeFormat = (time) => `${time.getHours().toString().length === 1 ? time.getHours() + '0' : time.getHours()}:${time.getMinutes().toString().length === 1 ? '0' + time.getMinutes() : time.getMinutes()}`

     const getUsername = (email) => {
          return new Promise((resolve, reject) => {
               Axios.get('https://rethasicapp-default-rtdb.firebaseio.com/userProfile/' + email.replace(/@.+/g, '') + '/data.json')
                    .then(({ data }) => {
                         resolve(data)
                    }).catch(reject)
          })
     }

     const submit = async (from, to, message, time = new Date()) => {
          console.log(from, to);
          const indexChat = Data.findIndex(i => i.name == nameNow)
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
                         isRead: false,
                         isSent: true,
                         isReceived: false,
                         isMe: [...Data[indexChat].isMe, true],
                         message: [...Data[indexChat].message, message],
                         time: timeFormat(time),
                         timestamp: String(time.valueOf()),
                         totalMessage: String(Number(Data[indexChat].totalMessage + 1))
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
                         isRead: false,
                         isSent: false,
                         isReceived: true,
                         isMe: [...dataTarget.data[indexTarget].isMe, false],
                         message: [...dataTarget.data[indexTarget].message, message],
                         time: timeFormat(time),
                         timestamp: String(time.valueOf()),
                         totalMessage: String(Number(dataTarget.data[indexTarget].totalMessage + 1))
                    }]
               })
          }
          fetchMessageFromServer(from)
     }

     const fetchMessageFromServer = (user) => {
          // console.log(db);
          Axios.get(`https://rethasicapp-default-rtdb.firebaseio.com/users/${user}/chat.json`)
               .then(({ data }) => {

                    console.log('Sukses fetch pesan');
                    // console.log(data);
                    const nameNow = route.params.name
                    const msgIndex = data.findIndex(i => i.name == nameNow)
                    if (msgIndex == -1) {
                         Alert.alert('Error get Messages', 'Not found')
                         return null
                    } else {
                         setData(data)
                         const Messages = data[msgIndex].message
                         const isMes = data[msgIndex].isMe
                         setMessages(Messages)
                         setIsme(isMes)
                         // console.log(Messages);
                    }
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

     if (!load) return (<></>)

     return (
          <View style={styles.container}>
               <SafeAreaView>
                    <FlatList
                         data={messages}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={({ item }) => {
                              const reallyMe = isMe[messages.indexOf(item)]
                              // console.log(reallyMe);
                              return (
                                   <TouchableOpacity style={reallyMe ? styles.selfChat : styles.otherChat}>
                                        <Text>{item}</Text>
                                   </TouchableOpacity>
                              )
                         }}
                    >
                    </FlatList>
               </SafeAreaView>
               <View style={styles.typeArea}>
                    <Entypo name="attachment" style={{ height: 40 }} size={35} />
                    <TextInput
                         style={styles.input}
                         placeholder='Enter your text here'
                         multiline={true}
                         value={text}
                         onChangeText={setText}
                    />
                    <Ionicons name="md-send" color='#2886d1' style={styles.sendIcon} size={30}
                         onPress={() => {
                              getUsername(userNow.email)
                                   .then(data => {
                                        submit(data.username, nameNow, text)
                                        setText('')
                                   }).catch(e => {
                                        Alert.alert('Something wrong', 'Failed to send message')
                                        console.log(e);
                                   })
                         }}
                    />
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     otherChat: {
          width: '50%',
          backgroundColor: 'grey',
          padding: 10,
          marginBottom: 10,
          marginLeft: 10,
          marginTop: 10,
          borderRadius: 5,
     },
     selfChat: {
          width: '50%',
          backgroundColor: '#34a4eb',
          alignSelf: 'flex-end',
          padding: 10,
          marginBottom: 10,
          marginRight: 10,
          marginTop: 10,
          borderRadius: 5,
     },
     typeArea: {
          position: 'absolute',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 5,
          backgroundColor: 'white',
          height: 60,
          bottom: 0,

     },
     input: {
          width: '90%',
          margin: 10,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'black',
          height: 40,
          paddingRight: 55,
          paddingHorizontal: 20
     },
     sendIcon: {
          position: 'absolute',
          right: 0,
          margin: 20
     }
})
