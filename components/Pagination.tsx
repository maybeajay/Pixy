import { OnboardingData } from '@/data/data'
import {View, Text, StyleSheet} from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import Dot from './Dot'

type Props = {
    data: OnboardingData[],
    x: SharedValue<number>
}

export default function Pagination({data, x}: Props) {
  return (
    <View style={styles.paginationContainer}>
      {
        data?.map((_, index:number)=><Dot key={index} index={index} x={x}/>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  paginationContainer:{
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  }
})