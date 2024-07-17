import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useEffect, useRef} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

export default function OutputPage({route, navigation}){
    //route allowing to send/receive data from one screen to another
    const displayImage = route.params?.selectedImage;
    const prediction = route.params?.predictions;
    //const base64Image = 'data:image/jpg;base64,'+prediction.segmented_image;
    const base64Image = 'data:image/jpg;base64,'+prediction.segmented_image;
    console.log(base64Image);
    const viewShotRef = useRef(null);
    //header functionality
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={captureAndSave}>
                    <MaterialIcons name="save" size={24} color="#124217" />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
                    <Ionicons name="home" size={24} color="#124217" />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    const captureAndSave = async () => {
      try {
        const uri = await viewShotRef.current.capture()
        const asset = await MediaLibrary.createAssetAsync(uri)
        await MediaLibrary.createAlbumAsync('Expo', asset, false)
        alert('Snapshot saved to gallery!')
      } catch (error) {
        console.error('Error capturing and saving snapshot:', error)
      }
    }

  return (
    //Output page layout
        <ScrollView>
            <SafeAreaView style={styles.container}>
            <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}} style={{justifyContent:'center',alignItems:'center'}}>
            {/* <Image source={{uri: displayImage}} style={styles.imageStyle}/> */}
            <Image
            source={{ uri:base64Image}}
            style={styles.imageStyle}
          />
                <View style={styles.outputContainer} >
                    <Text style={styles.statusText}>
                        CHLOROPHYLL STATUS:
                    </Text>
                    
                    {prediction?.image_label == 'High' && (
                      <Text style={styles.resultText}>   
                      HIGH
                      </Text>
                    )}
                   
                    {prediction?.image_label == 'Medium' &&(
                      <Text style={styles.resultYellowText}>
                      MEDIUM
                      </Text>
                    )}

                    {prediction?.image_label == 'Low' &&(
                      <Text style={styles.resultRedText}>
                      LOW
                      </Text>
                    )}
                    
                    {/* <Text style={styles.resultText}> */}
                    {/* {prediction?.image_label?.toUpperCase()} */}
                  {/* </Text> */}
                  {prediction?.image_label === 'High' && (
            <Text style={styles.descriptionText}>
            The Mungbean has sufficient fertilizers. The Mungbean is in good health.
            </Text>
          )}
          {prediction?.image_label === 'Medium' && (
            <Text style={styles.descriptionText}>
              The Mungbean lacks sufficient fertilizers. It is recommended to add 1 table spoon of fertilzer. The Mungbean is in average health.
            </Text>
          )}
          {prediction?.image_label === 'Low' && (
            <Text style={styles.descriptionText}>
            The Mungbean lacks fertlizers. It is recommended to add 2 table spoons of fertilizer. The Mungbean is in bad health.
            </Text>
          )}
                </View>
                </ViewShot>
            </SafeAreaView>
        </ScrollView>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    
  },
  outputContainer: {
    marginTop: 5,
    backgroundColor: '#618264',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 9,
    marginBottom: 20,
  },
  statusText: {
    color: '#D0E7D2',
    fontFamily: 'PopBold',
    fontSize: 15,
  },
  resultText: {
    color: '#124217',
    fontFamily: 'PopBold',
    fontSize: 25,
    marginTop: 10,
  },
  resultYellowText: {
    color: '#FFDA03',
    fontFamily: 'PopBold',
    fontSize: 25,
    marginTop: 10,
  },
  resultRedText: {
    color: '#8B0000',
    fontFamily: 'PopBold',
    fontSize: 25,
    marginTop: 10,
  },
  descriptionText: {
    color: '#D0E7D2',
    fontFamily: 'FredRegular',
    fontSize: 17,
    marginTop: 10,
    textAlign: 'justify',
  },
  imageStyle: {
    width: 340,
    height: 400,
    resizeMode: 'cover',
    borderRadius: 15,
    marginBottom: 10,
  },
});