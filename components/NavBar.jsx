import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';


const NavBar = () => {
  const router = useRouter();
 
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.navIcon}>
        <Icon name="th-large" size={20} color="#576574" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navIcon}>
        <Icon name="pie-chart" size={20} color="#576574" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navCenter}>
        <View style={styles.plusButton}>
          <Icon name="comment" size={24} color="#576574" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navIcon}>
        <Icon name="bell" size={20} color="#576574" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navIcon}>
        <Icon name="user" size={20} color="#576574" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    backgroundColor: '#ADC1D8', 
    height: 100, 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navIcon: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    width:"70%",
    height:"70%",
  },
  navCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, 
  },
  plusButton: {
    backgroundColor: '#FFFFFF',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'absolute',
    top: -25,
  },
});

export default NavBar;
