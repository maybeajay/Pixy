import { View, FlatList, ViewToken, StyleSheet } from 'react-native';
import React from 'react';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import data from '@/data/data';
import RenderItem from './RenderItem';
import Pagination from './Pagination';
import CreateButton from './CreateButton';

const OnBoarding = () => {
  const flatListRef = useAnimatedRef<FlatList<any>>();
  const x = useSharedValue(0);
  
  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const flatListIndex =useSharedValue(0)

  const onViewableItemsChanged = ({viewableItems}: {viewableItems: ViewToken[]})=>{
    if(viewableItems[0].index !== null){
      flatListIndex.value = viewableItems[0].index
    }
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        renderItem={({ item, index }) => <RenderItem item={item} index={index} x={x} />}
        ref={flatListRef}
        onScroll={onScroll}
        keyExtractor={(item:any)=> item.id}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold:10
        }}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={data} x={x}/>
        <CreateButton 
        flatListRef={flatListRef}
        flatListIndex={flatListIndex}
        dataLength={data.length}
        x={x}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer:{
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 30,
    paddingVertical: 30
  },
  container:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default OnBoarding;
