import { StyleSheet, Text, TouchableOpacity, Image, Modal, View, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect} from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker"
import { LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import { Entypo } from '@expo/vector-icons';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();


//constant variables containing path of an image from the file
const ImageLogo = require('../assets/Logo.png');
//const ImageLogo = require('../assets/laptop.png');
const SettingLogo = require('../assets/settings-new.png');
const NewLogo = require('../assets/settings-new.png');
const GuidelineImage = require('../assets/Group 3.png');

export default function MenuPage() {

    //constant variables
    const [isModalVisible, setIsModalVisible ] = useState(false);
    const targetWidth = 293;
    const targetHeight = 353;
    const aspectRatio = [targetWidth,targetHeight];
    const navigation = useNavigation();
    const [hasGalleryPermission,setHasGalleryPermission] = useState(null);
    const [galPhoto, galSetPhoto] = useState(" ");

    //header functionality
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <FontAwesome name="question-circle" size={30} color="#124217" />
                </TouchableOpacity>
            )
        })
    }, [navigation])
    
    //Permission to access the user's gallery from his/her device
    useEffect(() => {
        (async() => {
        const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryPermission.status === "granted");
        })();
    },[]);
    if (hasGalleryPermission === false){
        return <Text>No Access to Internal Storage...</Text>
    }

    //function to allow the user to choose a photo from the user's gallery
    const galleryImage = async() =>{
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspectRatio,
          quality: 1,
          base64: true,
          exif: false,
        });
          console.log(result);
          if(!result.canceled){
            galSetPhoto(result.assets[0].uri);
            navigation.navigate('Confirmation', { selectedImage: result.assets[0].uri });
          }
        };



    return (
        /* Menu page layout */
        <SafeAreaView style={styles.container}>
            <Image source={ImageLogo} style={styles.logo}/>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Camera")}>
                <Entypo name="camera" size={20} color="#D0E7D2" />
                <Text style={styles.btnStyle}>
                    TAKE A PHOTO
                </Text>
            </TouchableOpacity>
            <Text style={styles.txtStyle}>
                or
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => {galleryImage()}}>
                <Entypo name="images" size={20} color="#D0E7D2" style={{paddingLeft: 10}} />
                <Text style={styles.btnStyle}>
                    CHOOSE FROM CAMERA ROLL
                </Text>
            </TouchableOpacity>
            
            {/* Modal visibility */}            
            <Modal visible={isModalVisible} animationType='slide'>
                    <SafeAreaView style={styles.modalContainer}>
                        <TouchableOpacity style={styles.icon}>
                            <FontAwesome5 name="grip-lines" size={24} color="#D0E7D2" onPress={() => setIsModalVisible(false)}/>
                        </TouchableOpacity>
                            <PagerView style={styles.pagerContainer} initialPage={0}>
                                <View style={styles.page} key="1">
                                    <View style={{alignItems:'center'}}>
                                        <Image source={NewLogo} style={styles.settingLogo}/>
                                        <Text style={{fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 30, marginTop:50,}}>HOW TO USE</Text>
                                        <Text style={{fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 20, marginHorizontal: 20, textAlign: 'justify'}}>To begin using the app, the user have two options on the main menu: "TAKE A PHOTO" or "CHOOSE FROM CAMERA ROLL". </Text>
                                        <Text style={{fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 30, marginHorizontal: 20, textAlign: 'justify'}}>If you choose to take a photo, click on the "TAKE A PHOTO" button to access your device’s camera and capture a new image. Alternatively, you can select an existing photo from your device by clicking on the "CHOOSE FROM CAMERA ROLL" button. </Text>
                                    </View>
                                    <View style={{alignItems:'center', justifyContent:'flex-end', flex: 0.9}}>
                                        <Text style={{fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13}}>1/2</Text>
                                    </View>
                                </View>
                                <View style={styles.page} key="2">
                                    <Text style={{fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 25, marginHorizontal: 33}}>TAKING A PHOTO</Text>
                                    <View style={{ borderBottomColor: '#D0E7D2', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 5, marginHorizontal: 24}}/>
                                    <View style={{alignItems:'center', marginTop: 40}}>
                                        <Image source={GuidelineImage}></Image>
                                        <Text style={{marginHorizontal: 20, fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 35, textAlign:'justify'}}>Once you have selected or taken a photo, make sure the subject of the image is well-centered and clearly visible. Use the provided guidelines to adjust the position and size of the image accordingly.</Text>
                                        <Text style={{marginHorizontal: 20, fontFamily: 'FredRegular', color: '#D0E7D2', fontSize: 15, marginTop: 25, textAlign:'justify'}}>After you have aligned the image to your satisfaction, confirm your selection by following the on-screen prompts.</Text>
                                    </View>

                                    <View style={{alignItems:'center', justifyContent:'flex-end', flex: 0.9}}>
                                        <Text style={{fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13}}>2/2</Text>
                                    </View>
                                    
                                </View>      
                            </PagerView>
                    </SafeAreaView> 
            </Modal>
        </SafeAreaView>
    )
}





const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        alignItems: 'center',
    },
    button:{
        backgroundColor: '#618264',
        borderRadius: 10,
        height: 90,
        width: 270,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        flexDirection: 'row',
    },
    btnStyle:{
        paddingHorizontal: 10,
        fontFamily: 'FredBold',
        color: '#D0E7D2',
        fontSize: 15,
        textAlign: 'center',
    },
    txtStyle: {
        fontFamily: 'FredBold',
        fontSize: 20,
        color: '#124217',
        marginTop: 15,
        marginBottom: 15,
    },
    logo: {
        marginTop: 30,
        height: 225,
        width: 225,
        resizeMode:'cover',
        marginBottom: 60,
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
    icon: {
        marginTop: 15,
        alignItems: 'center',
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