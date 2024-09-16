import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, {interpolateColor, useSharedValue, useAnimatedStyle, withSpring, withTiming, useDerivedValue} from 'react-native-reanimated'
type Props = {}

const CustomSwitch = (props: Props) => {
  const [acitve, setActive] = useState(false);
  const siwtchValue = useSharedValue(0);
  const progress = useDerivedValue(()=>{
    return withTiming(acitve ? 22 : 0)
  })
  const backgroundColorStyle = useAnimatedStyle(()=>{
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 22],
      ["#F2F5F7", "#FF9091"]
    );
    return {backgroundColor}
  })
  useEffect(()=>{
    if(acitve){
      siwtchValue.value = 22;
    }else{
      siwtchValue.value = 4
    }
  }, [acitve, siwtchValue]);

  const customSpringStyles = useAnimatedStyle(()=>{
    return{
      transform:[
        {
          translateX: withSpring(siwtchValue.value, {
            mass: 1,
            damping: 15,
            stiffness: 120,
            overshootClamping: false,
            restDisplacementThreshold: 0.001
          })
        }
      ]
    }
  })
  return (
    <TouchableWithoutFeedback onPress={()=>setActive((prev)=>!prev)}>
      <Animated.View style={[styles.container, backgroundColorStyle]}>
        <Animated.View style={[styles.circle, customSpringStyles]}>

        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default CustomSwitch

const styles = StyleSheet.create({
  container:{
    width: 50,
    height: 28,
    backgroundColor: "#F2F5F7",
    borderTopEndRadius: 30,
    justifyContent: "center"
  },
  circle:{
    width: 24,
    height: 24,
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset:{
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,

  }
})