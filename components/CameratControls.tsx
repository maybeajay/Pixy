import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Dispatch, Ref, RefObject, SetStateAction } from 'react'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { FontAwesome } from "@expo/vector-icons";
import { CameraPosition } from 'react-native-vision-camera';


import * as Haptics from "expo-haptics";
import { useRouter } from 'expo-router';
import {
    Camera,
  } from "react-native-vision-camera";

type Props = {
    currentCamera: CameraPosition,
    setCurrentCamera: Dispatch<SetStateAction<CameraPosition>>,
    isvideoPaused: boolean,
    setisVideoPaused: Dispatch<SetStateAction<boolean>>,
    toggleFlash: boolean,
    setToggleFlash: Dispatch<SetStateAction<boolean>>,
    camera: RefObject<Camera>,
    isVideoPlaying: boolean,
    setIsVideoPlaying: Dispatch<SetStateAction<boolean>>,
    isActionModeEnabled: boolean,
    setisActionModeEnabled: Dispatch<SetStateAction<boolean>>
}

const CameratControls = ({currentCamera, setCurrentCamera, isvideoPaused, setisVideoPaused, toggleFlash, setToggleFlash, camera, setIsVideoPlaying, isVideoPlaying, isActionModeEnabled, setisActionModeEnabled}: Props) => {
    const handleSwitchCamera = () => {
        let switchedCam:CameraPosition = currentCamera === "back" ? "front" : "back";
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setCurrentCamera(switchedCam);
      };
      const handleVidePause = async ()=>{
        setisVideoPaused((prev)=>!prev);
        isvideoPaused ? await camera?.current?.resumeRecording() : await camera?.current?.pauseRecording();
      }
      
  return (
    <View style={{position: "absolute"}}>
      <TouchableOpacity 
      style={styles.switchBtn}>
      <MaterialCommunityIcons
        name="camera-front"
        size={35}
        color="white"
        onPress={handleSwitchCamera}
      />
      </TouchableOpacity>

      {toggleFlash ? (
        <MaterialIcons
          name={"flash-on"}
          size={35}
          color="white"
          onPress={() => setToggleFlash(!toggleFlash)}
          style={[styles.switchBtn, { top: 100 }]}
        />
      ) : (
        <MaterialIcons
          name={"flash-off"}
          size={35}
          color="white"
          onPress={() => setToggleFlash(!toggleFlash)}
          style={[styles.switchBtn, { top: 100 }]}
        />
      )}
      
      <MaterialIcons name="video-stable" size={35} color="white" 
      style={[styles.switchBtn, {top: 150}]}
      onPress={()=>setisActionModeEnabled((prev)=>!prev)}
      />     

      {isVideoPlaying && (
        <View style={styles.videoControls}>
          <Entypo
            name="circle-with-cross"
            size={60}
            color="white"
            onPress={() => {
              camera.current?.cancelRecording();
              setIsVideoPlaying(false);
            }}
          />
          <MaterialIcons
            name={isvideoPaused ? "play-circle-filled" : "pause-circle-filled"}
            size={60}
            color="white"
            onPress={() => handleVidePause()}
          />
        </View>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
    switchBtn: {
      position: "absolute",
      top: 50,
      right: 25,
    },
    shutterBtn: {
      position: "absolute",
      bottom: 50,
      alignSelf: "center",
    },
    videoControls: {
      flexDirection: "row",
      position: "absolute",
      bottom: 50,
      right: 25,
      gap: 10,
    },
  });

export default CameratControls