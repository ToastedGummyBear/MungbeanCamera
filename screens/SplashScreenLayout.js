import { StyleSheet, View, Image, Text} from "react-native";


const SplashLogo = require('../assets/SplashLogo.png');

export default function SplashScreenLayout(){
    return (
        <View style={styles.container}>
                <Image source={SplashLogo} style={styles.logoStyle} />

                <Text style={{fontFamily: 'FredBold', fontSize: 11, color: 'white', textAlign:'center'}}>Mungbean Camera</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#124217',
    },
    logoStyle:{
        width: 70,
        height: 70,
        alignItems:'center',
        justifyContent:'center',
        marginBottom: 5,
    }
})