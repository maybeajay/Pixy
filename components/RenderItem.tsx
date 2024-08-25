import { View, Text, useWindowDimensions, StyleSheet } from 'react-native'
import React from 'react'
import { OnboardingData } from '@/data/data'
import LottieView from 'lottie-react-native'
import { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import Animated from 'react-native-reanimated';
type props = {
  item: OnboardingData,
  index: number,
  x: SharedValue<number>
}

const RenderItem = ({item , index, x}:props) => {
  const {width: SCREEN_WIDTH} = useWindowDimensions(); 
  const circleAnimator = useAnimatedStyle(()=>{
    const scale = interpolate(
      x.value,
      [
        (index-1)*SCREEN_WIDTH,
        index*SCREEN_WIDTH,
        (index+1)*SCREEN_WIDTH
      ],
      [1,4,4],
      Extrapolation.CLAMP
    )
    return {transform: [{scale: scale}]}
  })
  const LottiesAnimatorStyle = useAnimatedStyle(()=>{
    const translateYAnimation  = interpolate(
      x.value,
      [
        (index-1)*SCREEN_WIDTH,
        index*SCREEN_WIDTH,
        (index+1)*SCREEN_WIDTH
      ],
      [200,0, -200],
      Extrapolation.CLAMP
    )
    return {
      transform: [{translateY: translateYAnimation}]
    }
  })
  return (
    <View style={[styles.itemContainer, {width: SCREEN_WIDTH}]}>
      <View style={styles.circleContainer}>
        <Animated.View 
        style={[{width: SCREEN_WIDTH, 
        height: SCREEN_WIDTH, 
        backgroundColor: item.backgroundColor, 
        borderRadius: SCREEN_WIDTH/2}, circleAnimator]}>
        </Animated.View>
      </View>
      <Animated.View style={LottiesAnimatorStyle}>
        <LottieView source={item.animation} style={{width: SCREEN_WIDTH*0.9, height: SCREEN_WIDTH*0.9}}
        autoPlay
        loop
        />
      </Animated.View>
      <Text style={[styles.itemText, {color: item.textColor}]}>{item?.text}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  itemContainer:{
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 120
  },
  itemText:{
    textAlign: "center",
    fontSize: 44,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  circleContainer:{
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",


  }
})
export default RenderItem