import { View, Text, StyleSheet, Platform } from "react-native";
import React, { Dispatch, RefObject, SetStateAction } from "react";
import { Camera } from "react-native-vision-camera";
import { useRouter } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

type Props = {
  isVideoPlaying: boolean;
  setIsVideoPlaying: Dispatch<SetStateAction<boolean>>;
  flash: boolean;
  setToggleFlash: Dispatch<SetStateAction<boolean>>;
  camera: RefObject<Camera>;
  toggleFlash: boolean;
};

const ShutterButton = ({
  isVideoPlaying,
  setIsVideoPlaying,
  camera,
  toggleFlash,
}: Props) => {
  const router = useRouter();
  const takeVideo = async () => {
    setIsVideoPlaying(true);
    try {
      await camera?.current?.startRecording({
        flash: toggleFlash ? "on" : "off",
        fileType: Platform.OS == "android" ? "mp4" : "mov",
        onRecordingFinished: (video: any) => {
          router.push({
            pathname: "/image-modal",
            params: { type: "video", data: JSON.stringify(video) },
          });
          setIsVideoPlaying(false);
        },
        onRecordingError: (error: Error) => {
          console.error(error);
          setIsVideoPlaying(false);
        },
      });
    } catch (error) {
      console.error("Recording Error:", error);
      setIsVideoPlaying(false);
    }
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
  const handleVideoEnd = async () => {
    await camera?.current?.stopRecording();
  };
  return (
    <View>
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
        <FontAwesome
          name="circle"
          size={70}
          color={"red"}
          style={styles.shutterBtn}
          onPress={() => handleVideoEnd()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shutterBtn: {
    position: "relative",
    bottom: 50,
    alignItems: "center",
  }
});
export default ShutterButton;
