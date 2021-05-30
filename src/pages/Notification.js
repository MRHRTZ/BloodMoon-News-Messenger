import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import moment from 'moment'
import { useFonts } from 'expo-font'

export default function Notification() {

     const dataNotif = [
          {
               title: 'FYI Notification',
               image: require('../../assets/icon.png'),
               message: 'Your notification will appear here!',
               time: moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
          }
     ]

     const [load] = useFonts({
          'alex': require('../../assets/fonts/AlexandriaFLF.ttf'),
          'alex-bold': require('../../assets/fonts/AlexandriaFLF-Bold.ttf'),
          'alex-bolditalic': require('../../assets/fonts/AlexandriaFLF-BoldItalic.ttf'),
          'alex-italic': require('../../assets/fonts/AlexandriaFLF-Italic.ttf')
     })

     if (!load) return (<></>)

     return (
          <View style={styles.container}>
               <View>
                    <FlatList
                         data={dataNotif}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={({ item }) => {
                              return (
                                   <>
                                        <TouchableOpacity style={styles.notifCard}>
                                             <Image source={item.image} style={{ width: 50, height: 50 }} />
                                             <View style={styles.content}>
                                                  <Text style={styles.title}>{item.title}</Text>
                                                  <Text style={styles.message}>{item.message}</Text>
                                             </View>
                                             <Text style={{ bottom: 5, right: 5, position: 'absolute' }}>{item.time}</Text>
                                        </TouchableOpacity>
                                        <View style={{ backgroundColor: 'black', width: '100%', height: 1 }} />
                                   </>
                              )
                         }}
                    >
                    </FlatList>
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1
     },
     notifCard: {
          height: 100,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: 25
     },
     content: {
          marginLeft: 20
     },
     title: {
          fontSize: 20,
          fontFamily: 'alex-bold'
     },
     message: {
          fontSize: 15,
          fontFamily: 'alex-bold'
     }
})
