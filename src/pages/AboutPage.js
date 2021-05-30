import React from 'react'
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from 'react-native'
import { MaterialCommunityIcons, Octicons, Entypo } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

export default function AboutPage({ navigation }) {

     const [load] = useFonts({
          'alex': require('../../assets/fonts/AlexandriaFLF.ttf'),
          'alex-bold': require('../../assets/fonts/AlexandriaFLF-Bold.ttf'),
          'alex-bolditalic': require('../../assets/fonts/AlexandriaFLF-BoldItalic.ttf'),
          'alex-italic': require('../../assets/fonts/AlexandriaFLF-Italic.ttf')
     })

     if (!load) return (<></>)
     return (
          <View style={styles.container}>
               <ImageBackground source={require('../../assets/AboutBackground.jpg')} resizeMode='cover' style={{ width: '100%', height: '100%' }}>
                    <View style={styles.header}>
                         <TouchableOpacity style={{ padding: 5, width: 70 }} onPress={() => navigation.navigate('Home')}>
                              <MaterialCommunityIcons name="chevron-left-circle-outline" size={62} color='#eb3d23' />
                         </TouchableOpacity>
                         <View style={styles.headContent}>
                              <Image source={{ uri: 'https://avatars.githubusercontent.com/u/52845610?v=4' }}
                                   style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: 29
                                   }}
                              />
                              <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                   <Text style={{ fontSize: 30, fontFamily: 'alex-bold', marginLeft: 20 }}>Hanif Ahmad Syauqi</Text>
                                   <Text style={{ fontSize: 15, fontFamily: 'alex-bold', marginLeft: 20 }}>React Native developer</Text>
                                   <Text style={{ fontSize: 19, fontFamily: 'alex-bolditalic', marginLeft: 20 }}>hanifsyauqi61@gmail.com</Text>
                              </View>
                         </View>
                         <View style={{ justifyContent: 'center', alignItems: 'center', top: -30 }}>
                              <View style={styles.content}>
                                   <View style={styles.list}>
                                        <Octicons name="mark-github" size={30} />
                                        <Text style={{ fontSize: 25, fontFamily: 'alex-bold', marginLeft: 10 }}>@MRHRTZ</Text>
                                   </View>
                                   <View style={styles.list}>
                                        <MaterialCommunityIcons name="facebook" size={30} />
                                        <Text style={{ fontSize: 25, fontFamily: 'alex-bold', marginLeft: 10 }}>Hanif Ahmad Syauqi</Text>
                                   </View>
                                   <View style={styles.list}>
                                        <Entypo name="instagram" size={30} />
                                        <Text style={{ fontSize: 25, fontFamily: 'alex-bold', marginLeft: 10 }}>@hanif.az.sq.61</Text>
                                   </View>
                              </View>
                         </View>
                         <View style={styles.bm}>
                              <Text style={{ fontSize: 20, fontFamily: 'alex-bold' }}>BloodMoon News Messengger</Text>
                              <Text style={{ fontSize: 18, fontFamily: 'alex-bold' }}>v0.0.21</Text>
                         </View>
                    </View>
               </ImageBackground>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1
     },
     headContent: {
          flexDirection: 'row',
          margin: 30,
          justifyContent: 'center'
     },
     content: {
          width: '80%',
          height: '55%',
          borderWidth: 1,
          borderColor: 'rgba(178, 168, 168, 0.61)',
          padding: 20,
          borderRadius: 5,
     },
     list: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginLeft: 40
     },
     bm: {
          justifyContent: 'center',
          alignItems: 'center'
     }
})
