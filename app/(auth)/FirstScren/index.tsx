import { View, Platform, StyleSheet, TouchableOpacity, Pressable, Dimensions, Alert } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Camera,
  CameraPosition,
  CameraProps,
  Frame,
  Point,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";

const SCREEN_HEIGHT = Dimensions.get('window').height

import { Gesture, GestureDetector, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'

import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Extrapolation, interpolate, useSharedValue } from "react-native-reanimated";


import Reanimated, { useAnimatedProps,  useSharedValue as useReanimatedSharedValue, } from 'react-native-reanimated'
import CameratControls from "@/components/CameratControls";
import ShutterButton from "@/components/ShutterButton";
import SwitchCamera  from "@/components/SwitchCanera";
import { Settings } from "lucide-react-native";
import ExposureControl from "@/components/ExposureControl";
import AsyncStorage from "@react-native-async-storage/async-storage";

type allSettings = {
  doubleTap: boolean,
  notifs: boolean
}

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
  const [isExposureVisible, setisExposureVisible] = useState(false);
  const [exposure, setExposure] = useState(5);
  const [allSettings, setAllSettings] = useState<allSettings>({
    doubleTap: false,
    notifs: false
  });

  useFocusEffect(useCallback(()=>{
    (async function getAllData(){
      let res = await AsyncStorage.getItem("allSettings");
      if(res){
        setAllSettings(JSON.parse(res));
      }
    })()
  }, []))

  const device = useCameraDevice(currentCamera, {
    physicalDevices: ["telephoto-camera"]
  });


  const { hasPermission, requestPermission } = useCameraPermission();

  const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
  Reanimated.addWhitelistedNativeProps({
    zoom: true,
  })

  
  const zoom = useSharedValue(device?.neutralZoom || 1);
  const zoomOffset = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
  .onBegin(() => {
    zoomOffset.value = zoom.value;
  })
  .onUpdate(event => {
    const newZoom = zoomOffset.value * event.scale;
    zoom.value = interpolate(
      newZoom,
      [1, 5],
      [device?.minZoom || 1,  5],
      Extrapolation.CLAMP
    );
  }).runOnJS(true)

    // const frameProcessor = useFrameProcessor((frame) => {
    //   'worklet';
    //   const labels = labelImage(frame);
    //   console.log(`you are looking at ${labels}`)
    // }, []);

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


  const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onEnd(() => {
    if (allSettings?.doubleTap) {
      setCurrentCamera(currentCamera === "back" ? 'front' : "back");
    }
  })
.runOnJS(true)

  // for stable videos
  
  const format = useCameraFormat(device, [
    { videoAspectRatio: 16 / 9 },
  { videoResolution: { width: 3048, height: 2160 } },
  { fps: 60 }
  ])
  
  const supportsVideoStabilization = format?.videoStabilizationModes.includes("cinematic");
  // return null if no device
  if(device == null) return ;
  
  console.log(allSettings)
  const composed = Gesture.Exclusive(pinchGesture, doubleTap);

  
  return (
    <GestureDetector gesture={composed}>
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
        videoHdr={format?.supportsVideoHdr}
        photoHdr={format?.supportsPhotoHdr}
        format={format}
        exposure={-2}
        animatedProps={animatedProps}
      />
      {/* Settings */}
      <View style={{position: "absolute", top: 40, right: 25}}>
      <TouchableOpacity onPress={()=>router.push("/settings")}>
        <Settings size={40} color={"#fff"}/>
      </TouchableOpacity>
      </View>

      {/* for other camera controls */}
      <View style={styles.controls}>
      <CameratControls camera={camera}  setIsVideoPlaying={setIsVideoPlaying} isvideoPaused={isvideoPaused} isVideoPlaying={isVideoPlaying} setToggleFlash={setToggleFlash} toggleFlash={toggleFlash} setisVideoPaused={setisVideoPaused}/>
      </View>
      {/* for shutter button and video recording */}
     <View style={styles.shutterBtn}>
     <ShutterButton isVideoPlaying={isVideoPlaying} setIsVideoPlaying={setIsVideoPlaying} camera={camera} toggleFlash={toggleFlash} setToggleFlash={setToggleFlash} flash={toggleFlash}/>
     </View>

     {/* for changing camera */}
     <View style={styles.switchBtn}>
      <SwitchCamera currentCamera={currentCamera} setCurrentCamera={setCurrentCamera} isVideoPlaying={isVideoPlaying}/>
     </View>

     {/* exposure component */}
     {
      isExposureVisible && <ExposureControl setisExposureVisible={setisExposureVisible} exposure={exposure} setExposure={setExposure} maxExposure={device.maxExposure} minExposure={device.minExposure}/>
     }

     <TouchableOpacity style={{position: 'absolute', bottom: 60, left: 30}} onPress={()=>setisExposureVisible((prev)=>!prev)}>
     <MaterialIcons name="exposure" size={50} color="#fff" />
     </TouchableOpacity>
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
