import { StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { CameraPosition } from 'react-native-vision-camera'
import * as Haptics from "expo-haptics";
import { SwitchCamera } from 'lucide-react-native';
import Animated , { useAnimatedStyle, withTiming} from 'react-native-reanimated';

type Props = {
    currentCamera: CameraPosition,
    setCurrentCamera: Dispatch<SetStateAction<CameraPosition>>,
    isVideoPlaying: boolean
}


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SwitchCanera = ({currentCamera, setCurrentCamera, isVideoPlaying}: Props) => {
    const [expanded, setExpanded] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(expanded ? 200 : 100, { duration: 500 }), // Change width from 100 to 200
    };
  });
  const handleSwitchCamera = () => {
    setExpanded((prev)=>!prev)
    let switchedCam:CameraPosition = currentCamera === "back" ? "front" : "back";
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setCurrentCamera(switchedCam);
};
  return (
    <>
    {
        !isVideoPlaying && 
        <AnimatedTouchableOpacity 
        onPress={handleSwitchCamera}
        >
        <SwitchCamera  
        size={50}
        color="white"
        />
        </AnimatedTouchableOpacity>
    }
    </>

  )
}


export default SwitchCanera