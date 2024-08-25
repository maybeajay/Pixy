import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Camera,
  CameraCaptureError,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from '@expo/vector-icons/Feather';
type Props = {};

const index = (props: Props) => {
  const [currentCamera, setcurrentCamera] = useState<CameraPosition>("back");
  const device = useCameraDevice(currentCamera);
  const { hasPermission, requestPermission } = useCameraPermission();
  if (!hasPermission) requestPermission();
  const camera = useRef<Camera>(null)
  // const isFocused = useIsFocused()
  // const appState = useAppState()

  // function to switch camera
  const handleSwitchCamera = ()=>{
    let switchedCam = currentCamera == "back" ? "front" : 'back'
    setcurrentCamera(switchedCam);
  }

  // function to take photo
  const takePhoto = async () => {
    try {
      const data = await camera.current.takePhoto({
        enableAutoRedEyeReduction: true,
        flash: "on"
      });
      console.log(data);
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
       name="camera-front" size={24} color="white"
       onPress={handleSwitchCamera} 
       style={styles.siwthcBtn}
       />
       {/* Shutter Button */}
      <Feather name="circle"
       size={70} color="white" 
       style={styles.shutterBtn}
       onPress={takePhoto}
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
