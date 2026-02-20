import { StyleSheet, Text, View, Dimensions } from 'react-native'
import SplashScreen from '../assets/SplashScreen'

const EntryScreen = () => {
  return (
    <View style={styles.container}>
      <SplashScreen style={styles.splash} />
    </View>
  )
}

export default EntryScreen

const styles = StyleSheet.create({
    splash: {
        width: 275,
        height: 100,
        alignSelf: "center",
        marginTop: 356,
        gap: 10,

    }
})