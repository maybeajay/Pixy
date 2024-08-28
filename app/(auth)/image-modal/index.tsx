import { View, Text, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

type Props = {}

const index = (props: Props) => {
    const params = useLocalSearchParams();
    console.log("param", params)
  return (
        <Image source={{uri: `file://${params?.path}`}} style={{height: "100%", width: "100%"}}/>
    // </View>
  )
}

export default index