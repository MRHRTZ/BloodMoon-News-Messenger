import React from 'react'
import { StyleSheet, Text, View, Image, TextInput, ImageBackground, Alert } from 'react-native'
import { useFonts } from 'expo-font'
import { AntDesign } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { app } from '../config'

export default function loginPage({ navigation }) {

     const [username, setUsername] = React.useState('')
     const [password, setPassword] = React.useState('')

     const [load] = useFonts({
          'alex': require('../../assets/fonts/AlexandriaFLF.ttf'),
          'alex-bold': require('../../assets/fonts/AlexandriaFLF-Bold.ttf'),
          'alex-bolditalic': require('../../assets/fonts/AlexandriaFLF-BoldItalic.ttf'),
          'alex-italic': require('../../assets/fonts/AlexandriaFLF-Italic.ttf')
     })

     const submit = () => {
          app.auth().signInWithEmailAndPassword(username, password)
               .then((rest) => {
                    console.log('Sukses login', rest.user.email);
                    navigation.navigate('Home')
                    setUsername('')
                    setPassword('')
               })
               .catch(e => {
                    console.log(e);
                    Alert.alert('Login Failed', e.message)
                    setUsername('')
                    setPassword('')
               })
     }

     if (!load) return null
     return (
          <View style={styles.container}>
               <ImageBackground source={require('../../assets/background.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }}>
                    <View style={styles.text}>
                         <Image source={require('../../assets/icon.png')} style={{ width: 100, height: 100 }} />
                         <Text style={{ marginLeft: 20, fontFamily: 'alex-bold', fontSize: 40, color: 'white' }}>Login</Text>
                    </View>
                    <View style={styles.inputText}>
                         <TextInput
                              value={username}
                              onChangeText={setUsername}
                              placeholder='username / email'
                              style={styles.input}
                              placeholderTextColor='rgba(178, 168, 168, 0.61)'
                         />
                         <TextInput
                              placeholderTextColor='rgba(178, 168, 168, 0.61)'
                              value={password}
                              onChangeText={setPassword}
                              placeholder='password'
                              secureTextEntry={true}
                              style={styles.input}
                         />
                    </View>
                    <View style={styles.loginButton}>
                         <TouchableOpacity style={styles.button} onPress={submit}>
                              <Text style={{ fontFamily: 'alex-bold', marginRight: 20, color: 'white' }}>Login</Text>
                              <AntDesign name="login" size={23} color='white' />
                         </TouchableOpacity>
                         <TouchableOpacity onPress={() => navigation.navigate('RegisterPage')}>
                              <Text style={{ fontFamily: 'alex-italic', fontSize: 13, marginTop: 30, color: 'white' }}>Create Account</Text>
                         </TouchableOpacity>
                    </View>
               </ImageBackground>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          // justifyContent: 'center',
          alignItems: 'center',
     },
     text: {
          marginTop: 100,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
     },
     inputText: {
          marginTop: 80,
          width: '100%',
          // backgroundColor: 'grey',
          alignItems: 'center',
     },
     input: {
          color: 'white',
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: 'rgba(250, 183, 184, 0.29)',
          width: '80%',
          height: 50,
          marginVertical: 20,
          borderRadius: 5
     },
     loginButton: {
          marginTop: 90,
          alignItems: 'center'
     },
     button: {
          backgroundColor: '#a8020d',
          width: 200,
          height: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20
     }
})
