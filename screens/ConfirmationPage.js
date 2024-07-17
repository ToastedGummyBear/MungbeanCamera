import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
  Modal,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { predictImage } from '../apiService';
import PagerView from 'react-native-pager-view';
import { Entypo } from '@expo/vector-icons';

//constant variable containing path of an image from a file
const NoneImage = require('../assets/none.png');
const HalfImage = require('../assets/half.png');
const FullImage = require('../assets/full.png');
const AllImage = require('../assets/treatments.png')

const ConfirmationPage = () => {
  const { selectedImage } = useRoute().params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPredictingModalVisible, setIsPredictingModalVisible] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [predictionError, setPredictionError] = useState(null);
  const [isPredictionErrorModalVisible, setIsPredictionErrorModalVisible] = useState(false);


  useEffect(() => {
    console.log('ConfirmationPage: selected image:', selectedImage);
  }, [selectedImage]);

  const convertImageToBase64 = async (imageUri) => {
    try {
      setIsLoading(true);
      setStatusMessage('Converting image to base64...');
      console.log('Converting image to base64...');
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64String = await blobToBase64(blob);
      setStatusMessage('Image converted to base64');
      console.log('Image converted to base64');
      return base64String;
    } catch (error) {
      console.log('Error converting image to base64:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  };

  const predictImageWithLoading = async (base64Image) => {
    setStatusMessage('Predicting Chlorophyll Content');
    setIsPredictingModalVisible(true);

    try {
      const predictions = await predictImage(base64Image);
      console.log('Prediction received:', predictions);
      setPrediction(predictions);
      setStatusMessage('');
      setIsPredictingModalVisible(false);
      navigation.navigate('Output', { selectedImage, predictions });
    } catch (error) {
      setIsPredictionErrorModalVisible(true);
      console.log('Error predicting image:', error);
      setPredictionError("Unable to Predict Chlorophyll Content", error);
    } finally {
      setIsPredictingModalVisible(false);
    }
  };

  const confirmImage = async () => {
    try {
      setIsLoading(true);
      const base64Image = await convertImageToBase64(selectedImage);
      await predictImageWithLoading(base64Image);
    } catch (error) {
      console.log('Error confirming image:', error);
    } finally {
      setIsLoading(false);
    }
  };
 //header functionality
 useEffect(() => {
  navigation.setOptions({
      headerRight: () => (
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <MaterialCommunityIcons name="information" size={27} color="#124217" />
          </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#124217" />
        </TouchableOpacity>
      ),
  });
}, [navigation])
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Menu');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: selectedImage }} style={styles.imageSize} />
      {isLoading && <ActivityIndicator size="large" color="#618264" style={styles.loadingIndicator} />}

      <View style={{flexDirection: 'row', justifyContent:'space-between', marginVertical: 50}}>
        <TouchableOpacity style={styles.button} onPress={confirmImage}>
          <Text style={styles.btnStyle}>PROCEED</Text>
        </TouchableOpacity>
        <View width={20}></View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.btnStyle}>CANCEL</Text>
        </TouchableOpacity>
      </View>
      {/* Modal for prediction error */}
      <Modal visible={isPredictionErrorModalVisible} animationType='slide' transparent={true}>
                <View style={{flex: 1, justifyContent:'center', alignItems:'center',  backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
                <View style={{paddingHorizontal: 100, paddingTop: 25, paddingBottom: 15, backgroundColor:'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center',}}>
                <Text style={{ fontFamily: 'FredBold', fontSize: 18, marginBottom: 30, color: '#124217',}}>{predictionError}</Text>
                <TouchableOpacity style={{marginBottom: 10, backgroundColor:'#618264', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5}} onPress={() => navigation.navigate('Menu')}>
               <Text style={{fontSize: 12, color:'#FFFFFF', fontFamily:'FredBold'}}>Try Again</Text>
              </TouchableOpacity>
                </View>
                </View>
            </Modal> 
      {/* Modal for prediction */}
     <Modal visible={isPredictingModalVisible} animationType='slide' transparent={true}>
                <View style={{flex: 1, justifyContent:'center', alignItems:'center',  backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
                <View style={{paddingHorizontal: 30, paddingTop: 50,backgroundColor:'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center',}}>
                <ActivityIndicator size="large" color="#618264" />
                <Text style={{ fontFamily: 'FredBold', fontSize: 16, marginBottom: 30, color: '#124217',}}>{statusMessage}</Text>
                <Entypo name="warning" size={14} color="red" />
                <Text style={{fontFamily:'FredRegular', fontSize: 10, textAlign: 'justify', color: '#124217', marginTop: 5, paddingBottom: 20}}>
                    Predictions provided by this app are preliminary and require further laboratory tests for confirmation. Future updates may improve the accuracy of these results.
                </Text>
                </View>
                </View>
            </Modal> 


      {/* Modal layout and visibility*/}
      <Modal visible={isModalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome5 name="grip-lines" size={24} color="#D0E7D2" onPress={() => setIsModalVisible(false)} />
          </TouchableOpacity>
          <PagerView style={styles.pagerContainer} initialPage={0}>
            <View style={styles.page} key="1">
              <View style={{ justifyContent:'center', alignItems:'center', marginTop: 50 }}>
                <Image source={AllImage} style={{ width: 300, height: 128 }} />
              </View>
              <View style={{ borderBottomColor: '#D0E7D2', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 45, marginHorizontal: 45, textAlign: 'justify' }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginHorizontal: 20, marginTop: 25, textAlign: 'justify' }}>By clicking the "Proceed" button, the uploaded image will be segmented by the model integrated into this application.</Text>
                <Text style={{ fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginHorizontal: 20, marginTop: 30, textAlign: 'justify' }}>Then the segmented image would be passed onto the classification model where it was trained to determine an output of High, Medium, and Low for the mung bean leaves.</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 0.9 }}>
                <Text style={{ fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13 }}>1/4</Text>
              </View>
            </View>
            <View style={styles.page} key="2">
              <Text style={{ fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 20, marginHorizontal: 25 }}>TREATMENTS</Text>
              <View style={{ borderBottomColor: '#D0E7D2', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 5, marginHorizontal: 24 }} />
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35 }}>
                <Image source={NoneImage} style={{ justifyContent: 'center', alignItems: 'center' }} />
              </View>
              <View style={{ borderBottomColor: '#D0E7D2', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 40, marginHorizontal: 40 }} />
              <Text style={{ marginHorizontal: 20, fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 20, marginTop: 10 }}>LOW</Text>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 10, textAlign: 'justify' }}>An image uploaded could be classified by the model as Low if the proper treatments of that plant was not met in the standard procedure.</Text>
                <Text style={{ marginHorizontal: 20, fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 20, textAlign: 'justify' }}>This class is not the recommended output from the models and should improve further in terms of treatments like watering the plant, fertilizing and growing the plant in proper light conditions.</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 0.45 }}>
                <Text style={{ fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13 }}>2/4</Text>
              </View>
            </View>
            <View style={styles.page} key="3">
              <Text style={{ fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 20, marginHorizontal: 25 }}>TREATMENTS</Text>
              <View style={{ borderBottomColor: '#D0E7D2', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 5, marginHorizontal: 24 }} />
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35 }}>
                <Image source={HalfImage} style={{ justifyContent: 'center', alignItems: 'center' }} />
              </View>
              <View style={{ borderBottomColor: '#D0E7D2', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 40, marginHorizontal: 40 }} />
              <Text style={{ marginHorizontal: 20, fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 20, marginTop: 10 }}>MEDIUM</Text>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 10, textAlign: 'justify' }}>An image uploaded could be classified by the model as Medium if the proper treatments of that plant was met halfway in the standard procedure.</Text>
                <Text style={{ marginHorizontal: 20, fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 20, textAlign: 'justify' }}>This class is not the recommended output from the models and should improve further in terms of treatments like watering the plant, fertilizing and growing the plant in proper light conditions to yield a high output.</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 0.45 }}>
                <Text style={{ fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13 }}>3/4</Text>
              </View>
            </View>
            <View style={styles.page} key="4">
              <Text style={{ fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 20, marginHorizontal: 25 }}>TREATMENTS</Text>
              <View style={{ borderBottomColor: '#D0E7D2', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 5, marginHorizontal: 24 }} />
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35 }}>
                <Image source={FullImage} style={{ justifyContent: 'center', alignItems: 'center' }} />
              </View>
              <View style={{ borderBottomColor: '#D0E7D2', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 40, marginHorizontal: 40 }} />
              <Text style={{ marginHorizontal: 20, fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 20, marginTop: 10 }}>HIGH</Text>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 10, textAlign: 'justify' }}>An image uploaded could be classified by the model as High if the proper treatments of that plant was followed based on the standard procedure.</Text>
                <Text style={{ marginHorizontal: 20, fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 20, textAlign: 'justify' }}>This class is the recommended output from the models and should be considered an achievement in terms of treatments like watering the plant, fertilizing and growing the plant in proper light conditions to yield a high output.</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 0.45 }}>
                <Text style={{ fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13 }}>4/4</Text>
              </View>
            </View>
          </PagerView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  imageSize:{
    marginTop: 65,
    width: 350, 
    height: 400,
    borderRadius: 17,
  },
  button: {
    height: 60,
    width: 150, 
    backgroundColor: '#618264', 
    alignItems:'center',
    justifyContent:'center', 
    borderRadius: 16, 
    elevation: 5,
  },
  btnStyle:{
    color: '#D0E7D2', 
    fontFamily:'PopBold', 
    fontSize: 17
  },
  modalContainer:{
    height: '97%',
    width: '100%',
    backgroundColor: '#618264',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  title: {
      marginTop: 30,
      textAlign: 'center',
      color: '#D0E7D2',
      fontFamily: 'FredBold',
      fontSize: 30,
  },
  icon: {
      marginTop: 15,
      alignItems: 'center',
  },
  paragraph: {
      marginTop: 15,
      marginHorizontal: 20,
      textAlign: 'justify',
      fontFamily: 'PopRegular',
      color: '#D0E7D2',
  },
  page:{
    marginTop: 30,
  },
  pagerContainer:{
      flex: 1,
  },
  settingLogo:{
      width: 300,
      height: 151,
      marginTop: 60,
  },
});

export default ConfirmationPage;
