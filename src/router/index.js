import React from 'react'
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Ionicons, Entypo } from '@expo/vector-icons';

import DrawerContent from '../pages/Drawer'
import ChatsPage from '../pages/ChatsPage'
import Home from '../pages/Home'
import FeedAndStatus from '../pages/FeedAndStatus'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import Notification from '../pages/Notification'
import AboutPage from '../pages/AboutPage'



const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()
const Bottom = createBottomTabNavigator()

export default function Router() {

     const [load] = useFonts({
          'alex': require('../../assets/fonts/AlexandriaFLF.ttf'),
          'alex-bold': require('../../assets/fonts/AlexandriaFLF-Bold.ttf'),
          'alex-bolditalic': require('../../assets/fonts/AlexandriaFLF-BoldItalic.ttf'),
          'alex-italic': require('../../assets/fonts/AlexandriaFLF-Italic.ttf')
     })

     if (!load) return null



     const LogoIcon = (props) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
               <Image style={{ width: 50, height: 50 }} source={require('../../assets/icon.png')} />
               <Text style={{ paddingLeft: 20, fontFamily: 'alex-bold', fontSize: 17, color: 'white' }} >BloodMoon News Messenger</Text>
          </View>
     )


     const ProfileIcon = (route) => {
          if (!route.params.uri) {
               return (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                         <Image style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'white' }} source={require('../../assets/blank.png')} />
                         <Text style={{ paddingLeft: 20, fontFamily: 'alex-bold', fontSize: 17, color: 'white' }} >{route.params.name}</Text>
                    </View>
               )
          } else {
               return (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                         <Image style={{ width: 50, height: 50, borderRadius: 20 }} source={{ uri: route.params.uri }} />
                         <Text style={{ paddingLeft: 20, fontFamily: 'alex-bold', fontSize: 17, color: 'white' }} >{route.params.name}</Text>
                    </View>
               )
          }
     }

     return (
          <NavigationContainer theme={DefaultTheme}>
               <Stack.Navigator screenOptions={{ headerShown: true }}>
                    <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
                    <Stack.Screen name="RegisterPage" component={RegisterPage} options={{ headerShown: false }} />
                    <Stack.Screen
                         options={{
                              headerTitle: (props) => <LogoIcon {...props} />,
                              headerStyle: {
                                   backgroundColor: '#eb3d23'
                              },
                              headerLeft: () => null,
                              headerBackground: () => <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/headerChats.jpg')} />
                         }}
                         name="Home" component={HomeDrawer} />
                    <Stack.Screen
                         options={({ route }) => ({
                              headerTitle: (props) => <ProfileIcon {...props} {...route} />,
                              headerStyle: {
                                   backgroundColor: '#eb3d23'
                              },
                              headerBackground: () => <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/headerChats.jpg')} />
                         })}
                         name="ChatsPage" component={ChatsPage}
                    />
               </Stack.Navigator>
          </NavigationContainer>
     )
}

const RestApi = () => (
     <Stack.Navigator>
          <Stack.Screen name="api" component={api} />
     </Stack.Navigator>
)


const HomeDrawer = (name, username, following, followers) => (
     <Drawer.Navigator drawerContent={(props) => (
          <DrawerContent {...props} {...{ name: 'MRHRTZ', username: 'hanif', following: 52, followers: 100 }} />
     )} >
          <Drawer.Screen name="Home" component={HomeBottomTab} />
          <Drawer.Screen name="About" component={AboutPage} />
     </Drawer.Navigator>
)


const HomeBottomTab = () => (
     <Bottom.Navigator
          // tabBar={props => (
          //      <View {...props} style={{ height: 100, back }}>
          //           <Ionicons name='md-chatbubbles-sharp' />
          //      </View>
          // )}
          tabBarOptions={{
               activeTintColor: '#eb3d23',
               style: {
                    // marginBottom: 20,
                    borderRadius: 25,
                    margin: 20,
                    // backgroundColor: 'black',
                    position: 'absolute'
               }
               // tabStyle: {
               //      elevation: 2,
               //      marginBottom: 20,
               //      borderRadius: 20,
               //      backgroundColor: 'transparent'
               // }
          }} >
          <Bottom.Screen options={{
               title: 'Chats',
               tabBarIcon: (props) => <Ionicons name='md-chatbubbles-sharp' {...props} />
          }} name="root" component={Home} />
          <Bottom.Screen options={{
               title: 'Feeds',
               tabBarIcon: (props) => <Ionicons name="home-sharp" {...props} />
          }} name="FeedAndStatus" component={FeedAndStatus} />
          <Bottom.Screen options={{
               title: 'Notification',
               tabBarIcon: (props) => <Ionicons name="notifications-circle-sharp" {...props} />
          }} name="ex" component={Notification} />
     </Bottom.Navigator>
)

