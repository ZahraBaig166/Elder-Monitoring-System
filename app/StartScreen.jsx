import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const StartScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.smartText}>SMART</Text>
        <Text style={styles.careText}>CARE</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://placeholder.pics/svg/360x200' }}
          style={styles.mainImage}
        />
      </View>
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login as Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login as User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80A3CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  smartText: {
    fontSize: 50,
    fontWeight: '700',
    color: '#3768AF',
    textAlign: 'center',
  },
  careText: {
    fontSize: 50,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 20,
  },
  mainImage: {
    width: 360,
    height: 200,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#80A3CC',
    borderRadius: 30,
    paddingVertical: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});

export default StartScreen;
