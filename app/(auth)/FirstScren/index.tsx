import { View, Platform, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Camera,
  CameraPosition,
  CameraProps,
  Point,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";


import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'

import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import { Extrapolation, interpolate, runOnJS } from "react-native-reanimated";

import Reanimated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated'
import CameratControls from "@/components/CameratControls";
import ShutterButton from "@/components/ShutterButton";
import SwitchCamera  from "@/components/SwitchCanera";


const index = () => {
  const [currentCamera, setCurrentCamera] = useState<CameraPosition>("back");
  const [toggleFlash, setToggleFlash] = useState<boolean>(false);
  const [permissionResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [audioReq, requestAudioPermission] = Audio.usePermissions();
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const camera = useRef<Camera>(null);
  const [isvideoPaused, setisVideoPaused] = useState<boolean>(false);
  const [isActionModeEnabled, setisActionModeEnabled] = useState<boolean>(false);

  const device = useCameraDevice(currentCamera);

  const zoom = useSharedValue(device?.neutralZoom)

  const { hasPermission, requestPermission } = useCameraPermission();

  Reanimated.addWhitelistedNativeProps({
    zoom: true,
  })
  const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
  Reanimated.addWhitelistedNativeProps({
    zoom: true,
  })
  


  const zoomOffset = useSharedValue(0);
  const zoomGesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value
    })
    .onUpdate(event => {
      const newZoom = zoomOffset.value * event.scale
      zoom.value = interpolate(
        newZoom,
        [1, 10],
        [device?.minZoom ?? 1, device?.maxZoom ?? 10],
        Extrapolation?.CLAMP,
      )
    })

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom]
  )

  // for focusing by tap events

  const focus = useCallback((point: Point) => {
    const c = camera.current
    if (c == null) return
    c.focus(point)
  }, [])

  const gesture = Gesture.Tap()
    .onEnd(({ x, y }) => {
      runOnJS(focus)({ x, y })
    })
  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (audioReq?.status !== "granted") {
          await requestAudioPermission();
        }
        if (!hasPermission) {
          await requestPermission();
        }
        if (permissionResponse?.status !== "granted") {
          await requestMediaLibraryPermission();
        }
      })();
    }, [hasPermission, audioReq, permissionResponse])
  );

  // for stable videos
  
  const format = useCameraFormat(device, [
    { videoStabilizationMode: 'cinematic-extended' }
  ])

  const supportsVideoStabilization = format?.videoStabilizationModes.includes("cinematic");
  // return null if no device
  if(device == null) return ;
  return (
    <GestureDetector gesture={Gesture.Simultaneous(zoomGesture, gesture)}>
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ReanimatedCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        video={true}
        audio={true}
        ref={camera}
        videoStabilizationMode={supportsVideoStabilization ? "cinematic" : "off"}
      />
      

      {/* for other camera controls */}
      <View style={styles.controls}>
      <CameratControls camera={camera} isActionModeEnabled={isActionModeEnabled} setIsVideoPlaying={setIsVideoPlaying} setisActionModeEnabled={setisActionModeEnabled} isvideoPaused={isvideoPaused} isVideoPlaying={isVideoPlaying} setToggleFlash={setToggleFlash} toggleFlash={toggleFlash} setisVideoPaused={setisVideoPaused}/>
      </View>
      {/* for shutter button and video recording */}
     <View style={styles.shutterBtn}>
     <ShutterButton isVideoPlaying={isVideoPlaying} setIsVideoPlaying={setIsVideoPlaying} camera={camera} toggleFlash={toggleFlash} setToggleFlash={setToggleFlash} flash={toggleFlash}/>
     </View>

     {/* for changing camera */}
     <View style={styles.switchBtn}>
      <SwitchCamera currentCamera={currentCamera} setCurrentCamera={setCurrentCamera} isVideoPlaying={isVideoPlaying}/>
     </View>
    </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  switchBtn: {
    position: "absolute",
    right: 35,
    bottom: 60,
    
  },
  shutterBtn: {
    position: "absolute",
    bottom: 0
  },
  controls:{
    position: "absolute",
    top: 0,
    right: 0
  }
});

export default index;
