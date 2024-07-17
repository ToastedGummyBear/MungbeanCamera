import {Button, StyleSheet, Text, View, Image, TouchableOpacity, Modal} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useEffect, useState} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';

const ImageLogo = require('../assets/Logo.png');
const ChlLogo = require('../assets/chlorophyll.png');
const MBLogo = require('../assets/mgbean.jpg');



const LandingPage = ({navigation}) => {
    const [isModalVisible, setIsModalVisible ] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <MaterialCommunityIcons name="leaf-circle-outline" size={30} color="#124217" />
                </TouchableOpacity>
            ),
            headerLeft: ()=> null

        })
    }, [navigation])

    return(
        //Landing page layout
        <SafeAreaView style={styles.container}>
            <Image source={ImageLogo} style={styles.logo}/>
            <Text style={styles.title}>MungBean Camera</Text>
            <Text style={styles.paragraph}>
            MungBean Camera is a mobile application designed to identify the chlorophyll content of mungbean leaves. it provides users with insights into the health of mungbean plants. Whether you're a farmer, researcher, or enthusiast, MungBean Camera empowers you to monitor chlorophyll levels conveniently and make informed decisions to optimize plant growth and health.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Menu")}>
                <Text style={styles.btnStyle}>
                    GET STARTED
                </Text>
            </TouchableOpacity>


            <Modal visible={isModalVisible} animationType='slide'>
                <SafeAreaView style={styles.modalContainer}>
                    <TouchableOpacity style={styles.icon}>
                            <FontAwesome5 name="grip-lines" size={24} color="#D0E7D2" onPress={() => setIsModalVisible(false)}/>
                    </TouchableOpacity>
                    <PagerView style={{flex: 1,}} initialPage={0}>
                        <View style={{marginTop: 30, alignItems:'center'}} key='1'>
                            <Text style={{fontFamily:'FredBold', color: '#D0E7D2',fontSize:28,}}>About Us</Text>
                            <View style={{width: '76%', height: 1, backgroundColor:'#D0E7D2',marginVertical: 8}}></View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{textAlign:'justify', fontSize: 14, fontFamily:'FredRegular', color: '#D0E7D2', marginHorizontal: 15, marginTop: 10 }}>We are students from Mapua Malayan Colleges of Laguna, pursuing a Bachelor of Science in Computer Science. Our thesis study focuses on the "Identification of Chlorophyll Content in Mungbean Leaves Using Deep Learning Algorithm." 
                                        {'\n\n\n'}
                                    In this study, we implemented segmentation and classification models to identify chlorophyll content in mungbean leaves. The segmentation model isolates leaves from the background, and the classification model analyzes these leaves to determine chlorophyll content. Despite challenges, our model achieved 71% accuracy. These advanced techniques aim to enhance agricultural monitoring and management.
                                </Text>
                            </View>
                            <View style={{alignItems:'center', justifyContent:'flex-end', flex: 0.9}}>
                                        <Text style={{fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13}}>1/3</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 30, alignItems:'center'}} key='2'>
                            <Image source={ChlLogo} style={{width: 200, height: 200, objectFit: 'cover', marginTop: 30}}/>
                            <Text style={{fontFamily:'FredBold', color: '#D0E7D2',fontSize:28, marginTop: 40}}>Chlorophyll</Text>
                            <View style={{width: '76%', height: 1, backgroundColor:'#D0E7D2',marginVertical: 8}}></View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{textAlign:'justify', fontSize: 14, fontFamily:'FredRegular', color: '#D0E7D2', marginHorizontal: 15, marginTop: 10 }}>
                                Chlorophyll is an essential compontent of leaves and serves as a measurement of plant health. Chlorophyll is the primary pigment used in photosynthesis and plant growth.
                                </Text>
                            </View>
                            <View style={{alignItems:'center', justifyContent:'flex-end', flex: 0.84}}>
                                        <Text style={{fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13}}>2/3</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 30, alignItems:'center'}} key='3'>
                            <Image source={MBLogo} style={{borderRadius: 10,width: 280, height: 250, objectFit: 'cover', marginTop: 30}}/>
                            <Text style={{fontFamily:'FredBold', color: '#D0E7D2',fontSize:28, marginTop: 40}}>Mung bean</Text>
                            <View style={{width: '76%', height: 1, backgroundColor:'#D0E7D2',marginVertical: 8}}></View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{textAlign:'justify', fontSize: 14, fontFamily:'FredRegular', color: '#D0E7D2', marginHorizontal: 15, marginTop: 10 }}>
                                Mungbean is utilized as a rotation crop between corn and rice. Mungbean is a major legume crop in South and Southeast Asia, as stated in the Department of Agriculture's Mungbean Production Guide.
                                </Text>
                            </View>
                            <View style={{alignItems:'center', justifyContent:'flex-end', flex: 0.84}}>
                                        <Text style={{fontFamily: 'FredBold', color: '#D0E7D2', fontSize: 13}}>3/3</Text>
                            </View>
                        </View>

                    </PagerView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}

export default LandingPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    logo: {
        width: 225,
        height: 225,
        marginTop: 30,
    },
    title: {
        fontSize: 30,
        fontFamily: 'FredBold',
        color: '#124217',
        marginTop: 15,
    },
    paragraph: {
        fontFamily: 'FredRegular',
        fontSize: 13,
        marginTop: 15,
        marginHorizontal: 19,
        color: '#124217',
        textAlign: 'justify',
    },
    button:{
        borderRadius: 10,
        backgroundColor: '#618264',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        marginTop: 50
    },
    btnStyle:{
        paddingHorizontal: 80, 
        paddingVertical: 20,
        fontSize: 22, 
        color: '#D0E7D2',
        fontFamily:'FredBold',
    },
    modalContainer:{
        height: '98%',
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
});