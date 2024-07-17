import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import React, { useCallback, useState, useEffect } from 'react';

// Import the NetworkCheck component
import NetworkCheck from './NetworkCheck';


//import for accessibility of different screen pages of the app
import LandingPage from './screens/LandingPage';
import MenuPage from './screens/MenuPage';
import ConfirmationPage from './screens/ConfirmationPage';
import CameraPage from './screens/CameraPage';
import OutputPage from './screens/OutputPage';
import SplashScreenLayout from './screens/SplashScreenLayout';

const Stack = createNativeStackNavigator()

export default function App() {


  const [isShownSplash, setIsShownSplash] = useState(true);
  useEffect(()=> {
    setTimeout(()=>{
      setIsShownSplash(false);
    },2500);
  });

  //function for the usability of the imported fonts into the app
  const [fontsLoaded] = useFonts({
    FredRegular: require('./assets/fonts/Fredoka-Regular.ttf'),
    FredBold: require('./assets/fonts/Fredoka-Bold.ttf'),
    PopRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    PopBold: require('./assets/fonts/Poppins-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async ()=> {
    if(fontsLoaded){
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded){
    return null;
  }

  return (
    <>
    {isShownSplash ? (<SplashScreenLayout/>):(

    //Stack navigation allows the application to switch from one screen to another
    //Here we include all the screen pages of the app to allow users to navigate through different pages
    <NetworkCheck>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerTintColor:"#124217"}}>
          <Stack.Screen name='Landing' component={LandingPage} options={{title: ""}}/>
          <Stack.Screen 
            name='Menu' 
            component={MenuPage} 
            options={{title: "MENU",headerTitleAlign:'center',headerTitleStyle:{fontFamily:'FredBold',color: '#124217', fontSize:25}}}/>  
          <Stack.Screen name='Camera' component={CameraPage} options={{headerShown: false}}/>
          <Stack.Screen name='Confirmation' component={ConfirmationPage} options={{title: ""}}/>
          <Stack.Screen name='Output' component={OutputPage} options={{title: ""}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </NetworkCheck>
  )} 
  </>
  );
}


