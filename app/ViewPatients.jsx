import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../components/NavBarPatients';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";
import useAuth from "../hooks/useAuth";
import { Link, router } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { apiBaseUrl, loading, error } = useConfig();
  const { user, loading: authLoading } = useAuth();
  const navigation = useNavigation();
  const fastApiURL = 'http://192.168.100.70:8001/api/upload';
  const [recording, setRecording] = useState(null);
  const [activeRecordingId, setActiveRecordingId] = useState(null);
  const [loadingPatientId, setLoadingPatientId] = useState(null);
  const [patientResults, setPatientResults] = useState({});
  



  useEffect(() => {
    const fetchPatients = async () => {
      if (!apiBaseUrl) {
        return;
      }

      setIsLoading(true);
      try {
        console.log('IN FETCH PATIENTS');
        const response = await fetch(`${apiBaseUrl}/caregiver/${user.userId}/patients`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching patients: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [apiBaseUrl]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const startRecording = async (patientId) => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert("Microphone permission is required.");
        return;
      }

      setActiveRecordingId(patientId);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
    } catch (err) {
      console.error("Start recording error:", err);
    }
  };

  const stopRecording = async (patientId) => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setLoadingPatientId(patientId);
      await uploadRecording(uri, patientId);
    } catch (err) {
      console.error("Stop recording error:", err);
    }
  };

  const uploadRecording = async (uri, patientId) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const formData = new FormData();
    formData.append('audio', {
      uri: fileInfo.uri,
      name: 'recording.m4a',
      type: 'audio/mp4',
    });

    // 💡 Add patientId to formData so backend knows who this is for
   formData.append('patient_id', patientId);
    console.log("Uploading recording for patientId:", patientId);
    console.log("FormData:", formData);

    const response = await axios.post(fastApiURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 400000,
    });

    const { prediction } = response.data;
    setPatientResults(prev => ({ ...prev, [patientId]: prediction }));
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload failed. Check server connection.");
  } finally {
    setLoadingPatientId(null);
    setActiveRecordingId(null);
  }
};



  return (
<View style={styles.container}>
      <View style={styles.main}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Patients List</Text>
            <Icon name="user-circle" size={20} color="#000" style={styles.profileIcon} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search...."
              placeholderTextColor="#ADC1D8"
              value={searchText}
              onChangeText={setSearchText}
            />
            <Icon name="search" size={15} style={styles.searchIcon} />
          </View>
        </View>
      <View style={styles.patientsContainer}>
  <ScrollView>
  {filteredPatients.length > 0 ? (
    filteredPatients.map((patient) => (
      <View key={patient.patient_id} style={styles.patientCard}>
        {/* Patient Info Section */}
        <View style={styles.patientInfo}>
          <Image
            source={{
              uri: patient.image || 'https://via.placeholder.com/50',
            }}
            style={styles.patientImage}
          />
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientCondition}>
              {patient.medical_conditions || 'No condition specified'}
            </Text>

            {/* Details Button */}
           <View style={styles.buttonRow}>
  {/* Details Button */}
  <TouchableOpacity
    style={styles.detailsButton}
    onPress={() =>
      router.push({
        pathname: "/IndividualPatientProfile",
        params: { patientId: patient.patient_id },
      })
    }
  >
    <Text style={styles.detailsButtonText}>Details</Text>
  </TouchableOpacity>

  {/* Record Button */}
  <TouchableOpacity
    style={[
      styles.recordBtn,
      recording && activeRecordingId === patient.patient_id && { backgroundColor: '#b00020' },
    ]}
    onPress={() =>
      recording && activeRecordingId === patient.patient_id
        ? stopRecording(patient.patient_id)
        : startRecording(patient.patient_id)
    }
    disabled={loadingPatientId === patient.patient_id}
  >
    <Text style={styles.recordBtnText}>
      {recording && activeRecordingId === patient.patient_id ? 'Stop' : 'Record'}
    </Text>
  </TouchableOpacity>
</View>


            {loadingPatientId === patient.patient_id && (
              <ActivityIndicator size="small" color="#000" style={{ marginTop: 5 }} />
            )}

            {patientResults[patient.patient_id] && (
              <Text style={styles.resultText}>
                 Result: {patientResults[patient.patient_id]}
              </Text>
            )}
          </View>
        </View>

        {/* Action Icons */}
        <View style={styles.patientActions}>
          <Icon name="heart" size={16} color="#F28F8F" style={styles.icon} />
          <Icon name="phone" size={16} color="#000" style={styles.icon} />
          <Icon name="envelope" size={16} color="#000" style={styles.icon} />
        </View>
      </View>
    ))
  ) : (
    <Text style={styles.noPatientsText}>No patients found.</Text>
  )}
</ScrollView>
</View>
      </View>
      <NavBar />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 30,
  
  },
  topSection: {
    backgroundColor: '#ADC1D8',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: -20,
    marginBottom: 30,
    height: 200,
    marginTop: -50,
    paddingTop: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  profileIcon: {
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,

  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#ADC1D8',
  },
  searchIcon: {
    color: '#ADC1D8',
    marginLeft: 10,
  },
  patientsContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 100,
  },
  patientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  allPatientsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  filterIcon: {
    padding: 10,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  patientCondition: {
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 60,
  },
  detailsButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000',
  },
  patientActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  noPatientsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  recordBtn: {
    backgroundColor: '#0057b7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex:1,
  },
  recordBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',},

    buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
  gap: 10, // or use marginRight in button styles if needed
},

detailsButton: {
  backgroundColor: '#FFF',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  flex: 1,
},

recordBtn: {
  backgroundColor: '#0057b7',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  flex: 1.5,
},

recordBtnText: {
  fontSize: 11,
  color: 'white',
  textAlign: 'center',
},


});

export default ViewPatients;
