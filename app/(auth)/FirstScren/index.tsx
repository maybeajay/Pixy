import { View, Platform, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";

const index = () => {
  const [currentCamera, setCurrentCamera] = useState<CameraPosition>("back");
  const [toggleFlash, setToggleFlash] = useState<boolean>(false);
  const [permissionResponse, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const [audioReq, requestAudioPermission] = Audio.usePermissions();
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const camera = useRef<Camera>(null);
  const [isvideoPaused, setisVideoPaused] = useState<boolean>(false);


  const device = useCameraDevice(currentCamera);

  const { hasPermission, requestPermission } = useCameraPermission();

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

  const handleSwitchCamera = () => {
    let switchedCam = currentCamera === "back" ? "front" : "back";
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setCurrentCamera(switchedCam);
  };

  const clickPicture = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    try {
      const data = await camera.current?.takePhoto({
        enableAutoRedEyeReduction: true,
        flash: toggleFlash ? "on" : "off",
      });
      if (data) {
        router.push({
          pathname: "/image-modal",
          params: { type: "image", data: JSON.stringify(data) },
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const takeVideo = async () => {
    setIsVideoPlaying(true);
    try {
      await camera.current.startRecording({
        flash: toggleFlash ? "on" : "off" ,
        fileType: Platform.OS  == 'android' ? "mp4" : "mov",
        onRecordingFinished: (video) => {
          router.push({
            pathname: "/image-modal",
            params: { type: "video", data: JSON.stringify(video) },
          });
          setIsVideoPlaying(false);
        },
        onRecordingError: (error) => {
          console.error(error);
          setIsVideoPlaying(false);
        },
      });
    } catch (error) {
      console.error("Recording Error:", error);
      setIsVideoPlaying(false);
    }
  };

  const handleVideoEnd = async () => {
    await camera?.current?.stopRecording();
  };

  const handleVidePause = async ()=>{
    setisVideoPaused((prev)=>!prev);
    isvideoPaused ? await camera?.current?.resumeRecording() : await camera?.current?.pauseRecording();
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        video={true}
        audio={true}
        ref={camera}
      />

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

      {!isVideoPlaying ? (
        <Feather
          name={"circle"}
          size={70}
          color={"white"}
          style={styles.shutterBtn}
          onPress={() => clickPicture()}
          onLongPress={() => takeVideo()}
        />
      ) : (
        <FontAwesome name="circle"  size={70}
        color={"red"}
        style={styles.shutterBtn}
        onPress={() => handleVideoEnd()} />
      )}

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
  );
};

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

export default index;
