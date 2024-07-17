import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Image, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';

const ImageLogo = require('./assets/wifi.png');
const RefreshLogo = require('./assets/refresh.png');

const NetworkCheck = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Network state changed: ', state); // Log network state changes
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const retryConnection = () => {
    NetInfo.fetch().then(state => {
      console.log('Retry network state: ', state); // Log network state on retry
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
  };

  if (isConnected === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={{fontFamily:'FredBold', fontSize:14, color: 'white', marginTop: 20}}>Checking network status...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={ImageLogo} style={{width: 230, height: 180, resizeMode:'cover'}}/>
        <Text style={{fontFamily:'FredBold', fontSize:24, color: 'white', marginTop: 50}}>Network Connection!</Text>
        <Text style={{fontFamily:'FredRegular', fontSize:13, color: 'white', marginTop: 20, textAlign:'center', marginHorizontal: 20}}>Please ensure you are connected to Wi-Fi or mobile data to enjoy seamless functionality of the Mungbean Camera app.</Text>
        <TouchableOpacity style={{marginTop: 100}} onPress={retryConnection}>
            <Image source={RefreshLogo} style={{width: 30, height: 30, resizeMode:'cover'}}/>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#124217',
    justifyContent:'center',
    alignItems:'center',
}
});

export default NetworkCheck;
