import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import OnBoarding from '@/components/OnBoarding'
import { StatusBar } from 'expo-status-bar';

const index = () => {
  return (
    <View style={styles.container}>
     <StatusBar style="dark" />
      <OnBoarding />
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})
export default index