import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import OnBoarding from '@/components/OnBoarding'


const index = () => {
  return (
    <View style={styles.container}>
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