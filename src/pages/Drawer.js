import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {
     DrawerItem,
     DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
     useTheme,
     Avatar,
     Title,
     Caption,
     Paragraph,
     Drawer,
     Text,
     TouchableRipple,
     Switch,
} from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { app } from '../config'
import Axios from 'axios'
import * as ImagePicker from 'expo-image-picker';


export default function DrawerContent(props) {
     const [user, setUser] = React.useState({})
     const [following, setFollowing] = React.useState(0)
     const [followers, setFollowers] = React.useState(0)
     const [dark, setDark] = React.useState(props.themenow)

     React.useEffect(() => {
          // setFollowers(2)
          const userInfo = app.auth().currentUser
          setUser(userInfo)
          console.log(followers);
          updateData()
          // updateData()
     }, [])


     if (!user) return (<></>)
     let userimage
     if (user?.photoURL) {
          userimage = { uri: user.photoURL }
     } else {
          userimage = require('../../assets/blank.png')
     }

     // var users = app.auth().currentUser;
     // console.log(users);
     // users.updateProfile({
     //      displayName: "MRHRTZ",
     //      photoURL: 'https://avatars.githubusercontent.com/u/52845610?v=4'
     // }).then(function () {
     //      // Update successful.
     // }).catch(function (error) {
     //      // An error happened.
     // });

     // const userimage = 'https://avatars.githubusercontent.com/u/52845610?v=4'

     const [image, setImage] = React.useState(null);


     const launchPick = () => {
          ImagePicker.launchImageLibraryAsync({
               mediaTypes: ImagePicker.MediaTypeOptions.All,
               allowsEditing: true,
               aspect: [4, 4],
               quality: 1,
          })
               .then(result => {

                    console.log(result);

                    // if (!result.cancelled) {
                    setImage(result.uri);
                    // }
               })
               .catch(console.log)

     }

     const updateData = () => {
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
                                   followers: followers
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
                                   following: data.following,
                                   followers: data.followers
                              }
                         })
                              .then(({ data }) => {
                                   console.log(data);
                              })
                              .catch(e => {
                                   console.log(e);
                              })
                         setFollowers(data.followers)
                         setFollowing(data.following)
                    }
                    console.log(data);
               })
               .catch(e => {
                    console.log(e.message);
               })
     }


     const userInfo = app.auth().currentUser

     if (!userInfo) {
          return (<></>)
     }

     return (
          <DrawerContentScrollView {...props}>
               <View
                    style={styles.drawerContent}
               >
                    <View style={styles.userInfoSection}>
                         <TouchableOpacity style={styles.avatar}
                              onPress={launchPick}
                         >
                              {user ? (
                                   <Avatar.Image
                                        source={userimage}
                                        size={150}
                                        style={{ backgroundColor: 'white' }}
                                   />
                              ) : (
                                   <MaterialIcons size={150} name="account-circle" />
                              )}
                         </TouchableOpacity>
                         <Title style={styles.title}>{userInfo.email.replace(/@.+/g, '')}</Title>
                         <Caption style={styles.caption}>{userInfo.email}</Caption>
                         <View style={styles.row}>
                              <View style={styles.section}>
                                   <Paragraph style={[styles.paragraph, styles.caption]}>{following}</Paragraph>
                                   <Caption style={styles.caption}>Following</Caption>
                              </View>
                              <View style={styles.section}>
                                   <Paragraph style={[styles.paragraph, styles.caption]}>{followers}</Paragraph>
                                   <Caption style={styles.caption}>Followers</Caption>
                              </View>
                         </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                         <DrawerItem
                              icon={({ color, size }) => (
                                   <MaterialCommunityIcons
                                        name="account-outline"
                                        color={color}
                                        size={size}
                                   />
                              )}
                              label="Profile"
                              onPress={() => { Alert.alert('Profile?', 'Available soon') }}
                         />
                         <DrawerItem
                              icon={({ color, size }) => (
                                   <MaterialCommunityIcons name="tune" color={color} size={size} />
                              )}
                              label="Preferences"
                              onPress={() => { Alert.alert('Wanna setting your theme?', 'Available soon..') }}
                         />
                         <DrawerItem
                              icon={({ color, size }) => (
                                   <MaterialCommunityIcons
                                        name="information-outline"
                                        color={color}
                                        size={size}
                                   />
                              )}
                              label="About"
                              onPress={() => {
                                   props.navigation.navigate('About')
                              }}
                         />
                    </Drawer.Section>
                    <Drawer.Section title="Preferences">
                         <TouchableRipple onPress={() => {
                              setDark(!dark)
                              // setTimeout(() => {
                              // updateData(52, 128)
                              // }, 3000);
                         }}>
                              <View style={styles.preference}>
                                   <Text>Dark Theme</Text>
                                   <View pointerEvents="none">
                                        <Switch value={dark} />
                                   </View>
                              </View>
                         </TouchableRipple>
                    </Drawer.Section>
                    <Drawer.Section title="Account">
                         <DrawerItem
                              icon={({ color, size }) => (
                                   <MaterialCommunityIcons
                                        name="logout"
                                        color={color}
                                        size={size}
                                   />
                              )}
                              label="logout"
                              onPress={() => {
                                   app.auth().signOut()
                                        .then(() => {
                                             console.log('Berhasil logout');
                                             props.navigation.navigate('LoginPage')
                                        })
                                        .catch(e => {
                                             console.log(e);
                                             Alert.alert('Logout Failed', '', ['Ok'])
                                        })
                              }}
                         />
                    </Drawer.Section>
               </View>
          </DrawerContentScrollView>
     );
}

const styles = StyleSheet.create({
     drawerContent: {
          flex: 1,
     },
     userInfoSection: {
          paddingLeft: 20,
          paddingRight: 20,
     },
     avatar: {
          alignItems: 'center',
          justifyContent: 'center',
     },
     title: {
          marginTop: 20,
          fontWeight: 'bold',
     },
     caption: {
          fontSize: 14,
          lineHeight: 14,
     },
     row: {
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
     },
     section: {
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 15,
     },
     paragraph: {
          fontWeight: 'bold',
          marginRight: 3,
     },
     drawerSection: {
          marginTop: 15,
     },
     preference: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 12,
          paddingHorizontal: 16,
     },
});