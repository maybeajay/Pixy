import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native'
import React from 'react'
import { MoveLeft } from 'lucide-react-native'
import { router } from 'expo-router'

type Props = {}

const index = (props: Props) => {
  return (
    <View style={styles.conainer}>
      {/* back button */}
      <TouchableOpacity style={styles.backBTn} onPress={()=>router.back()}>
      <MoveLeft size={30} color={"#2e2e2e"}/>
      </TouchableOpacity>
      {/* Camera Specific */}
      <View>
        <Text>Camera</Text>
        <Switch />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
    conainer:{
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    backBTn:{
        position: 'absolute',
        top: 30,
        left: 25,
        backgroundColor: "#fff",
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    }
})
export default index