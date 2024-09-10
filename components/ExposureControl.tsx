import React, { Dispatch, SetStateAction, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
type Props = {
    setisExposureVisible: Dispatch<SetStateAction<boolean>>,
    exposure: number ,
    setExposure: Dispatch<SetStateAction<number>>,
    minExposure: number,
    maxExposure: number
}

const ExposureControl = ({setisExposureVisible, exposure, setExposure, minExposure, maxExposure}: Props) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
      }, []);

  const snapPoints = useMemo(() => ['30%'], []);
  const animatedExposure = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - (animatedExposure.value / 100),
      filter: `brightness(${1 + animatedExposure.value / 100})`, // To control brightness/exposure
    };
  });

  const onSliderChange = (value:any) => {
    setExposure(value);
    animatedExposure.value = value;
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        onClose={()=>setisExposureVisible((prev)=>!prev)}
        enablePanDownToClose 
      >
        <BottomSheetView style={styles.contentContainer} >
          <BlurView style={styles.contentContainer}>
            <Text style={styles.title}>Exposure</Text>
            <Slider 
            value={exposure}
            onValueChange={onSliderChange}
            style={styles.slider}
            minimumValue={minExposure}
            maximumValue={maxExposure}
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1EB1FC"
            />
          </BlurView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      width: "100%"
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
    slider: {
        width: '100%',
        height: 40,
      },
      title:{
        fontSize: 25,
      },
  });
export default ExposureControl