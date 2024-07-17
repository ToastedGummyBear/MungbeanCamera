import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Camera, CameraType} from 'expo-camera/legacy';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../src/components/Button';
import { useCameraPermissions } from 'expo-image-picker';

const CameraPage = ({navigation}) => {
    //constant variables and state variables
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const cameraRef = useRef(null);


    //function to allow tha application to access the user's camera from his/her device
    useEffect(() => {
        (async () =>{
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, [])

    if(hasCameraPermission === false) {
        return <Text>No access to camera</Text>
    }

    //function for capturing image
    const takePicture = async () => {
        if(cameraRef) {
            try{
                const data = await cameraRef.current.takePictureAsync();
                console.log(data);
                setImage(data.uri);
                //passes the captured image into the confirmation page
                navigation.navigate("Confirmation", {selectedImage: data.uri})
                
            } catch(e) {
                console.log(e);
            }
        }
    }



  return (
    //Camera layout
    <SafeAreaView style={styles.container}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>  
            <View>
                <Button icon="circle-slice-8" iconSize={70} onPress={takePicture} />
            </View>
        </Camera>
    </SafeAreaView>
  )
}

export default CameraPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
    }
});