import React from 'react'
import { StyleSheet, Text, View, Image, TextInput, ImageBackground, Alert } from 'react-native'
import { useFonts } from 'expo-font'
import { AntDesign } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { app, firebaseConfig } from '../config'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import Axios from 'axios'

export default function RegisterPage({ navigation }) {

     const [email, setEmail] = React.useState('')
     const [username, setUsername] = React.useState('')
     const [password, setPassword] = React.useState('')
     const [rpassword, setrPassword] = React.useState('')
     const [result, setResult] = React.useState({ confirm: '', verification: '' })
     const [verif, setVerif] = React.useState(false)

     const updateData = (followers, following, username) => {
          const userInfo = app.auth().currentUser
          console.log('Follll : ', followers);
          Axios.get('https://rethasicapp-default-rtdb.firebaseio.com/userProfile/' + userInfo.email.replace(/@.+/g, '') + '/data.json')
               .then(({ data }) => {
                    if (data === null) {
                         Axios({
                              method: 'PUT',
                              url: 'https://rethasicapp-default-rtdb.firebaseio.com/userProfile/' + userInfo.email.replace(/@.+/g, '') + '/data.json',
                              headers: {
                                   'content-type': 'application/json'
                              },
                              data: {
                                   following: following,
                                   followers: followers,
                                   username: username
                              }
                         })
                              .then(({ data }) => {
                                   console.log(data);
                              })
                              .catch(e => {
                                   console.log(e);
                              })
                         setFollowers(followers)
                         setFollowing(following)
                    } else {
                         Axios({
                              method: 'PUT',
                              url: 'https://rethasicapp-default-rtdb.firebaseio.com/userProfile/' + userInfo.email.replace(/@.+/g, '') + '/data.json',
                              headers: {
                                   'content-type': 'application/json'
                              },
                              data: {
                                   following: following,
                                   followers: followers,
                                   username: username
                              }
                         })
                              .then(({ data }) => {
                                   console.log(data);
                              })
                              .catch(e => {
                                   console.log(e);
                              })
                         setFollowers(followers)
                         setFollowing(following)
                    }

                    console.log(data);
               })
               .catch(e => {
                    console.log(e.message);
               })
     }

     const recaptchaVerifier = React.useRef(null);

     const [load] = useFonts({
          'alex': require('../../assets/fonts/AlexandriaFLF.ttf'),
          'alex-bold': require('../../assets/fonts/AlexandriaFLF-Bold.ttf'),
          'alex-bolditalic': require('../../assets/fonts/AlexandriaFLF-BoldItalic.ttf'),
          'alex-italic': require('../../assets/fonts/AlexandriaFLF-Italic.ttf')
     })

     if (!load) return null


     const submit = () => {
          console.log(password, rpassword);
          // return
          if (password != rpassword) return Alert.alert('Warning', "Password doesn't match!")
          if (isNaN(email)) {
               // Email
               if (!email.includes('@')) return Alert.alert('Warning', 'Not a valid email')
               app.auth().createUserWithEmailAndPassword(email, password)
                    .then((rest) => {
                         console.log('Sukses register');
                         updateData(0, 0, username)
                         setEmail('')
                         setUsername('')
                         setPassword('')
                         setrPassword('')
                         setTimeout(() => {
                              navigation.navigate('Home')
                         }, 1000);
                    })
                    .catch((e) => {
                         Alert.alert('Failed Register', String(e).replace(/Error: |\[|\]/g, ''), ['Ok'])
                         console.log(e);
                         setEmail('')
                         setUsername('')
                         setPassword('')
                         setrPassword('')
                    })
          } else {
               // number
               return Alert.alert('Warning', 'Invalid Email!')
               const validatePhoneNumber = () => {
                    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
                    return regexp.test(email)
               }

               // return console.log(validatePhoneNumber());
               if (validatePhoneNumber) {

                    app
                         .auth()
                         .signInWithPhoneNumber(email, appVerifier)
                         .then(confirmResult => {
                              setResult({ confirm: confirmResult, verification: '' })
                              setVerif(true)
                         })
                         .catch(error => {
                              Alert.alert('Failed', error.message)
                              console.log(error)
                         })
               } else {
                    Alert.alert('Failed', 'Phone number invalid!')
               }
          }
     }


     if (verif) {
          if (result.verification.length === 6) {
               result.confirm
                    .confirm()
                    .then((rest) => {
                         console.log(rest);
                         navigation.navigate('Home')
                    })
                    .catch(e => {
                         console.log(e);
                         Alert.alert('Failed', 'Wrong OTP Code!')
                    })
          }

          return (
               <View style={styles.container}>
                    <ImageBackground source={require('../../assets/background.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }}>
                         <View style={styles.text}>
                              <Image source={require('../../assets/icon.png')} style={{ width: 100, height: 100 }} />
                              <Text style={{ marginLeft: 20, fontFamily: 'alex-bold', fontSize: 30, color: 'white', }}>Enter you otp code</Text>
                         </View>
                         <FirebaseRecaptchaVerifierModal
                              style={{ width: 100, height: 100 }}
                              ref={recaptchaVerifier}
                              firebaseConfig={firebaseConfig}
                              attemptInvisibleVerification={false}
                         />
                         <View style={styles.inputText}>
                              <TextInput
                                   placeholderTextColor='rgba(178, 168, 168, 0.61)'
                                   value={result.verification}
                                   onChangeText={text => setResult({ confirm: result.confirm, verification: text })}
                                   placeholder='OTP'
                                   style={[styles.input, { fontFamily: 'alex-bold', fontSize: 30 }]}
                                   textAlign='center'
                                   keyboardType='numeric'
                                   maxLength={6}
                              />
                         </View>
                         {/* <View style={styles.RegisterButton}>
                              <TouchableOpacity style={styles.button}>
                                   <Text style={{ fontFamily: 'alex-bold', marginRight: 20, color: 'white' }}>Register</Text>
                                   <AntDesign name="login" size={23} color='white' />
                              </TouchableOpacity>
                              <TouchableOpacity>
                                   <Text style={{ fontFamily: 'alex-italic', fontSize: 13, marginTop: 30, color: 'white' }}>Back To Login</Text>
                              </TouchableOpacity>
                         </View> */}
                    </ImageBackground>
               </View>
          )
     } else {
          return (
               <View style={styles.container}>
                    <ImageBackground source={require('../../assets/background.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }}>
                         <View style={styles.text}>
                              <Image source={require('../../assets/icon.png')} style={{ width: 100, height: 100 }} />
                              <Text style={{ marginLeft: 20, fontFamily: 'alex-bold', fontSize: 40, color: 'white' }}>Register</Text>
                         </View>
                         <View style={styles.inputText}>
                              <TextInput
                                   placeholderTextColor='rgba(178, 168, 168, 0.61)'
                                   value={email}
                                   onChangeText={setEmail}
                                   placeholder='email'
                                   style={styles.input}
                              />
                              <TextInput
                                   value={username}
                                   onChangeText={setUsername}
                                   placeholder='username'
                                   style={styles.input}
                                   placeholderTextColor='rgba(178, 168, 168, 0.61)'
                              />
                              <TextInput
                                   placeholderTextColor='rgba(178, 168, 168, 0.61)'
                                   value={password}
                                   onChangeText={setPassword}
                                   placeholder='new password'
                                   secureTextEntry={true}
                                   style={styles.input}
                              />
                              <TextInput
                                   placeholderTextColor='rgba(178, 168, 168, 0.61)'
                                   value={rpassword}
                                   onChangeText={setrPassword}
                                   placeholder='retype new password'
                                   secureTextEntry={true}
                                   style={styles.input}
                              />
                         </View>
                         <View style={styles.RegisterButton}>
                              <TouchableOpacity style={styles.button} onPress={submit}>
                                   <Text style={{ fontFamily: 'alex-bold', marginRight: 20, color: 'white' }}>Register</Text>
                                   <AntDesign name="login" size={23} color='white' />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
                                   <Text style={{ fontFamily: 'alex-italic', fontSize: 13, marginTop: 30, color: 'white' }}>Back To Login</Text>
                              </TouchableOpacity>
                         </View>
                    </ImageBackground>
               </View>
          )
     }
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
          marginVertical: 10,
          borderRadius: 5
     },
     RegisterButton: {
          marginTop: 70,
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
