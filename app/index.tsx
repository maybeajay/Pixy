import { View, Text } from 'react-native'
import React from 'react'
import OnBoarding from '@/components/OnBoarding'
import { StatusBar } from 'expo-status-bar'
type Props = {}

const index = (props: Props) => {
  return (
    <>
    <StatusBar style='dark'/>
    <OnBoarding />
    </>
  )
}

export default index