import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import * as MediaLibrary from "expo-media-library";
import Feather from '@expo/vector-icons/Feather';
const index = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();

    // save to device
    const saveImage = async (uri:string) => {
      try {
          await MediaLibrary.saveToLibraryAsync(uri);
          console.log("Image successfully saved");
      } catch (error) {
        console.log(error);
      }
    };
    
  return (
        <View style={styles.container}>
        <Image source={{uri: `file://${params?.path}`}} style={{height: "100%", width: "100%"}}/>
        {/* cancel button */}
        <Entypo name="cross" size={30} color="white"  onPress={()=>navigation.goBack()} style={styles.cancel}/>

          <TouchableOpacity onPress={()=>saveImage(`file://${params?.path}`)} style={styles.saveBtn}>
          <Feather name="download" size={30} color="black" />
          </TouchableOpacity>
       </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
  },
  cancel:{
    position: "absolute",
    top: 35,
    left: 30
  },
  saveBtn:{
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 50,
    height: 50,
    borderRadius: 25  ,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default index