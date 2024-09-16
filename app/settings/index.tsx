import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Pressable } from 'react-native';
import { MoveLeft } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeInLeft, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import CustomSwitch from '@/components/CustomSwitch';
type Props = {}

const Index = (props: Props) => {
  const [allSettings, setAllSettings] = useState({
    doubleTap: false,
    notifications: false,
    photHdr: false,
    mirrorCamera: false,
    vhdr: false,
    fps: 30
  });

  useFocusEffect(
    useCallback(() => {
      (async function getAllData() {
        const res = await AsyncStorage.getItem("allSettings");
        if (res) {
          setAllSettings(JSON.parse(res));
        }
      })();
    }, [])
  );

  const fpsTogglePosition = useSharedValue(0);

  const fpsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(fpsTogglePosition.value, { duration: 300 }) }],
    };
  });

  const toggleFps = async () => {
    const newFps = allSettings.fps === 30 ? 60 : 30;
    setAllSettings((prev) => ({ ...prev, fps: newFps }));

    // Update Shared Value for Animation
    fpsTogglePosition.value = newFps === 60 ? 30 : 0;

    // Save to AsyncStorage
    await AsyncStorage.setItem("allSettings", JSON.stringify({ ...allSettings, fps: newFps }));
  };


  const toggleSwitch = async (label: string, value: boolean) => {
    const updatedSettings = { ...allSettings };
    switch (label) {
      case "double-tap":
        updatedSettings.doubleTap = value;
        break;
      case "notifs":
        updatedSettings.notifications = value;
        break;
      case "phototHdr":
        updatedSettings.photHdr = value;
        break;
      case "mirrorCamera":
        updatedSettings.mirrorCamera = value;
        break;
      case "vhdr":
        updatedSettings.vhdr = value
      default:
        break;
    }
    setAllSettings(updatedSettings);
    
    // Save to AsyncStorage after updating state
    await AsyncStorage.setItem("allSettings", JSON.stringify(updatedSettings));
  };

  const switchAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(allSettings.doubleTap ? 1 : 0.3, { duration: 500 }),
      transform: [{ scale: withTiming(allSettings.doubleTap ? 1.2 : 1, { duration: 500 }) }]
    };
  });

  return (
    <Animated.View style={styles.container} entering={FadeInLeft} exiting={FadeOutRight}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <MoveLeft size={30} color={"#2e2e2e"} />
      </TouchableOpacity>

      {/* Multiple Option Example */}
      <View style={styles.content}>
        <Text style={styles.label}>Camera Settings</Text>

        <View style={styles.optionContainer}>
          <View style={styles.textCont}>
            <Text style={styles.switchLabel}>Use Double Tap Gesture</Text>
            <Text>double tap to (switch camera)</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={allSettings.doubleTap ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => toggleSwitch("double-tap", value)}
            value={allSettings.doubleTap}
          />
        </View>

        {/* Add more options below as needed */}
        <View style={styles.optionContainer}>
          <Text style={styles.switchLabel}>Enable Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={allSettings.notifications ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => toggleSwitch("notifs", value)}
            value={allSettings.notifications}
          />
        </View>

        <View style={styles.optionContainer}>
          <View style={styles.textCont}>
            <Text style={styles.switchLabel}>Photo HDR</Text>
            <Text>enables photo HDR for supported device</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={allSettings.photHdr ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => toggleSwitch("phototHdr", value)}
            value={allSettings.photHdr}
          />
        </View>

        <View style={styles.optionContainer}>
          <View style={styles.textCont}>
            <Text style={styles.switchLabel}>Mirror Front Camera</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={allSettings.mirrorCamera ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => toggleSwitch("mirrorCamera", value)}
            value={allSettings.mirrorCamera}
          />
        </View>

        {/* Separator */}
        <View style={styles.separator} />


        {/* video settings */}
        <Text style={styles.label}>Video Settings</Text>
        <View style={styles.optionContainer}>
          <View style={styles.textCont}>
            <Text style={styles.switchLabel}>use HDR</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={allSettings.vhdr ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => toggleSwitch("vhdr", value)}
            value={allSettings.vhdr}
          />
        </View>

        {/* fps */}
        <View style={styles.optionContainer}>
          <View style={styles.textCont}>
            <Text style={styles.switchLabel}>Video Frame Rate</Text>
          </View>
          <Pressable onPress={toggleFps} style={styles.fpsToggle}>
            <Animated.View style={[styles.fpsToggleIndicator, fpsAnimatedStyle]}>
              <Text style={styles.fpsToggleText}>{allSettings.fps} fps</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backBtn: {
    position: 'absolute',
    top: 30,
    left: 25,
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  content: {
    width: '90%',
    marginTop: 95,
    alignSelf: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  fpsToggle: {
    width: 100,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#ddd",
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fpsToggleIndicator: {
    width: '50%',
    height: '100%',
    backgroundColor: "#81b0ff",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  fpsToggleText: {
    color: '#fff',
  },
  textCont: {
    flexDirection: "column"
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },  
});

export default Index;
