import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React from 'react'
import { Extrapolation, interpolate, interpolateColor, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'
type Props = {
    index: number
    x: SharedValue<number>
}

const Dot = ({x, index}: Props) => {
    const {width: SCREEN_WIDTH} = useWindowDimensions();
    const animatedDotStyle = useAnimatedStyle(()=>{
        const widthAnimation  = interpolate(
            x.value,
            [
                (index-1)* SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index+1) * SCREEN_WIDTH
            ],
            [10,20,30],
            Extrapolation.CLAMP
        )
        const opacityAnimation  = interpolate(
            x.value,
            [
                (index-1)* SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index+1) * SCREEN_WIDTH
            ],
            [0.5,1,0.5],
            Extrapolation.CLAMP
        )
        return {width: widthAnimation, opacity: opacityAnimation}
    })
    const animateColor = useAnimatedStyle(()=>{
        const backgroundColor = interpolateColor(
            x.value,
            [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
            ["#005b4f", "#1e2a69", "#f15937"]
        )
        return {
            backgroundColor: backgroundColor
        }
    })
  return (
    <Animated.View style={[styles.dot, animatedDotStyle, animateColor]}>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 10,

    }
})

export default Dot