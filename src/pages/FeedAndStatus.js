import React from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, } from 'react-native'
import { WebView } from 'react-native-webview'
import Axios from 'axios'
import moment from 'moment'
import MarqueeText from 'react-native-marquee';
import cheerio from 'cheerio'
import { Modalize } from 'react-native-modalize'
import { useFonts } from 'expo-font'

export default function FeedAndStatus() {
     const [newsData, setNewsData] = React.useState([])
     const [runningData, setRunningData] = React.useState([])
     const [url, setUrl] = React.useState(null)
     const [expand, setExpand] = React.useState([])
     const modalizeRef = React.useRef(null)

     const onOpen = () => {
          modalizeRef.current?.open();
     };

     const [load] = useFonts({
          'alex': require('../../assets/fonts/AlexandriaFLF.ttf'),
          'alex-bold': require('../../assets/fonts/AlexandriaFLF-Bold.ttf'),
          'alex-bolditalic': require('../../assets/fonts/AlexandriaFLF-BoldItalic.ttf'),
          'alex-italic': require('../../assets/fonts/AlexandriaFLF-Italic.ttf')
     })

     React.useEffect(() => {
          getData()
          getDataRunningText()
     }, [])

     const getDataRunningText = () => {
          Axios.get('https://www.detik.com/terpopuler/news')
               .then(({ data }) => {
                    let result = []
                    const $ = cheerio.load(data)
                    $('article > div > div.media__text > h3 > a').get().map(rest => {
                         result.push($(rest).text())
                    })
                    setRunningData(result)
                    console.log(result);
               })
     }

     const getData = () => {
          Axios.get('https://newsapi.org/v2/top-headlines?country=id&apiKey=78797c7e868e495d84b3a3237a79c91f')
               .then(({ data }) => {
                    setNewsData(data.articles)
                    let dataEx = []
                    data.articles.map(rest => {
                         dataEx.push(false)
                    })
                    setExpand(dataEx)
               }).catch(console.log)
     }


     if (newsData.length === 0) return (<></>)

     if (!load) return (<></>)

     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <MarqueeText
                         style={{ fontSize: 24, fontFamily: 'alex-bold' }}
                         duration={90000}
                         marqueeOnStart
                         loop
                         marqueeDelay={1000}
                         marqueeResetDelay={1000}
                         onMarqueeComplete={() => {

                         }}
                    >
                         {runningData.join(' '.repeat(100))}
                    </MarqueeText>
               </View>
               <View style={styles.content}>
                    <FlatList
                         data={newsData}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={({ item }) => {
                              const datePublish = moment(item.publishedAt).format('HH:mm:ss DD/MMMM/YYYY')
                              return (
                                   <TouchableOpacity style={styles.card} onPress={() => {
                                        setUrl(item.url)
                                        onOpen()
                                   }}>
                                        <View style={styles.contentCard}>
                                             <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'alex-bold' }}>{item.title ? item.title : ''}</Text>
                                             <Image source={{ uri: item.urlToImage ? item.urlToImage : 'data:image/png;base64,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' }} style={{ marginTop: 10, width: '100%', height: 250 }} resizeMode='cover' />
                                             <Text style={{ fontSize: 15, marginTop: 5, fontFamily: 'alex-bolditalic' }}>{item.author ? 'By : ' + item.author : ''}</Text>
                                             <Text style={{ fontSize: 15, marginTop: 5, fontFamily: 'alex-bold' }}>{datePublish ? datePublish : ''}</Text>
                                             <TextInput
                                                  style={styles.desc}
                                                  multiline={true}
                                                  value={(item.description ? item.description : '') + '\n\n' + (item.content ? item.content?.replace(/\[\+.+/g, '') : '')}
                                             />
                                        </View>
                                   </TouchableOpacity>
                              )
                         }}
                    >
                    </FlatList>
                    <Modalize ref={modalizeRef}>
                         <WebView style={styles.modalContent} source={{ uri: url }} scrollEnabled={true} />
                    </Modalize>
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1
     },
     header: {
          height: 50,
          justifyContent: 'center',
          // backgroundColor: 'grey',
          borderWidth: 1,
          borderColor: 'rgba(178, 168, 168, 0.61)'
     },
     content: {
          marginTop: 0,
     },
     card: {
          height: 500,
          width: '97%',
          borderWidth: 1,
          borderColor: 'rgba(178, 168, 168, 0.61)',
          marginBottom: 10,
          backgroundColor: 'rgba(178, 168, 168, 0.61)',
          borderRadius: 25,
          margin: 7,
     },
     contentCard: {
          margin: 20,
          fontFamily: 'alex'
          // backgroundColor: 'grey'
     },
     desc: {
          // backgroundColor: ''
          marginTop: 30
     },
     modalContent: {
          width: '100%',
          height: 9900,
          // backgroundColor: 'black',
     }
})
