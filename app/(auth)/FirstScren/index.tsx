import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics'
import * as MediaLibrary from 'expo-media-library';
import { router } from "expo-router";
const index = () => {
  const [currentCamera, setcurrentCamera] = useState<CameraPosition>("back");
  const device = useCameraDevice(currentCamera, {
    physicalDevices:[
      'ultra-wide-angle-camera',
    'wide-angle-camera',
    'telephoto-camera'
    ]
  });
  const [toggleFlash, settoggleFlash] = useState<boolean>(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionResponse, setPermissionResponse] = MediaLibrary.usePermissions();
  if (!hasPermission) requestPermission();
  const [albums, setAlbums] = useState(null);
  const camera = useRef<Camera>(null)

  // temporary function here
  async function getAlbums() {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }



  // function to switch camera
  const handleSwitchCamera = ()=>{
    let switchedCam = currentCamera == "back" ? "front" : 'back'
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    setcurrentCamera(switchedCam);
  }

  // function to take photo
  const clickPicture = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    try {
      const data = await camera.current?.takePhoto({
        enableAutoRedEyeReduction: true,
        flash: toggleFlash ? "on" : "off"
      });
      if(data){
        router.push({
          pathname: "/image-modal",
          params: data
        })
      }
    } catch (error) {
      console.log("Err", error)
    }
    
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* main camera module */}
      <Camera 
      style={StyleSheet.absoluteFill}
       device={device} 
       isActive={true} 
       photo={true}
       ref={camera}
       />
       {/* switch camera Button */}
      <MaterialCommunityIcons 
       name="camera-front" size={35} color="white"
       onPress={handleSwitchCamera} 
       style={styles.siwthcBtn}
       />
       {/* Flash toggle button */}
    {toggleFlash ? <MaterialIcons name={"flash-on"} 
       size={35} color="white" 
       onPress={()=>settoggleFlash(!toggleFlash)}
       style={[styles.siwthcBtn, {top: 100}]}
       /> :
      <MaterialIcons name={"flash-off"} 
       size={35} color="white" 
       onPress={()=>settoggleFlash(!toggleFlash)}
       style={[styles.siwthcBtn, {top: 100}]}
       />}
       {/* Shutter Button */}
      <Feather name="circle"
       size={70} color="white" 
       style={styles.shutterBtn}
       onPress={()=>clickPicture()}
       />
    </View>
  );
};

const styles = StyleSheet.create({
  siwthcBtn:{
    position: "absolute",
    top: 50,
    right: 25
  },
  shutterBtn:{
    position: "absolute",
    bottom: 50,
    marginHorizontal: "auto"
  }
});

export default index;
