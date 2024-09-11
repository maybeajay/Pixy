import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { MoveLeft } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Props = {}

const Index = (props: Props) => {
  const [allSettings, setAllSettings] = useState({
    doubleTap: false,
    notifications: false,
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

  const toggleSwitch = async (label: string, value: boolean) => {
    const updatedSettings = { ...allSettings };
    switch (label) {
      case "double-tap":
        updatedSettings.doubleTap = value;
        break;
      case "notifs":
        updatedSettings.notifications = value;
        break;
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
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <MoveLeft size={30} color={"#2e2e2e"} />
      </TouchableOpacity>

      {/* Multiple Option Example */}
      <View style={styles.content}>
        <Text style={styles.label}>Settings</Text>

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

        {/* Separator */}
        <View style={styles.separator} />
      </View>
    </View>
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
    padding: 10,
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
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  textCont: {
    flexDirection: "column"
  }
});

export default Index;
