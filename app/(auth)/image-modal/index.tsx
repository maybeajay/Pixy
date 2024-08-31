import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import * as MediaLibrary from "expo-media-library";
import Feather from '@expo/vector-icons/Feather';
import { Video, ResizeMode } from 'expo-av';

const index = () => {
    const params = useLocalSearchParams();
    const parsedData = JSON.parse(params?.data);
    console.log("parsed data", parsedData)
    const navigation = useNavigation();
    const video = React.useRef(null);

    const saveMedia = async (uri:any) => {
        try {
            await MediaLibrary.saveToLibraryAsync(uri);
            console.log("Media successfully saved");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            {params?.type === "image" ? (
                <Image source={{ uri: `file://${parsedData?.path}` }} style={styles.media} />
            ) : (
                <Video
                    ref={video}
                    style={styles.media}
                    source={{ uri: `file://${parsedData?.path}` }}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    useNativeControls
                />
            )}

            <Entypo name="cross" size={30} color="white" onPress={() => navigation.goBack()} style={styles.cancel} />

            <TouchableOpacity onPress={() => saveMedia(`file://${parsedData?.path}`)} style={styles.saveBtn}>
                <Feather name="download" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "transparent"
  },
  media: {
    width: "100%",
    height: "100%",
  },
  cancel: {
    position: "absolute",
    top: 35,
    left: 30,
  },
  saveBtn: {
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default index;
