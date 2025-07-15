import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import useConfig from '../../hooks/useConfig';
import { useRouter, useLocalSearchParams } from 'expo-router';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
const MonthlyReport = () => {
  const { patientId } = useLocalSearchParams();
  const router = useRouter();
  const { apiBaseUrl } = useConfig();

  const [patientInfo, setPatientInfo] = useState(null);
  const [healthStats, setHealthStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('FETCHING PATIENT ID FROM CAREGIVER MODULE:', patientId);
      try {
        const [healthRes, patientRes] = await Promise.all([
          fetch(`${apiBaseUrl}/health-metrics-reports/${patientId}`),
          fetch(`${apiBaseUrl}/patientsreport/${patientId}`)
        ]);

        const healthData = await healthRes.json();
        const patientData = await patientRes.json();

        setHealthStats(healthData);
        setPatientInfo(patientData);
      } catch (err) {
        console.error('Failed to fetch report or patient info:', err);
      } finally {
        setLoading(false);
      }
    };

    if (apiBaseUrl && patientId) {
      fetchData();
    }
  }, [apiBaseUrl, patientId]);

  const HealthReportCard = ({ title, data, unit }) => (
    <View style={styles.reportCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricText}>Avg: {data.avg} {unit}</Text>
      <Text style={styles.metricText}>Min: {data.min} {unit}</Text>
      <Text style={styles.metricText}>Max: {data.max} {unit}</Text>
    </View>
  );

const generatePDF = async () => {
  if (!healthStats || !patientInfo) return;

  const htmlContent = `
    <h1 style="text-align: center;">Monthly Health Report - July</h1>
    <p><strong>Patient Name:</strong> ${patientInfo.name}</p>
    <p><strong>Age:</strong> ${patientInfo.age}</p>
    <p><strong>Status:</strong> ${patientInfo.status}</p>
    <p><strong>Medical Conditions:</strong> ${patientInfo.medical_conditions}</p>
    <p><strong>Assigned Caregiver ID:</strong> ${patientInfo.caregiver_id}</p>
    <hr />
    <h3>Heart Rate (BPM)</h3>
    <p>Avg: ${healthStats.bpm.avg} bpm</p>
    <p>Min: ${healthStats.bpm.min} bpm</p>
    <p>Max: ${healthStats.bpm.max} bpm</p>
    <h3>Calories</h3>
    <p>Avg: ${healthStats.calories.avg} kcal</p>
    <p>Min: ${healthStats.calories.min} kcal</p>
    <p>Max: ${healthStats.calories.max} kcal</p>
    <h3>Steps</h3>
    <p>Avg: ${healthStats.steps.avg} steps</p>
    <p>Min: ${healthStats.steps.min} steps</p>
    <p>Max: ${healthStats.steps.max} steps</p>
    <h3>Distance</h3>
    <p>Avg: ${healthStats.distance.avg} km</p>
    <p>Min: ${healthStats.distance.min} km</p>
    <p>Max: ${healthStats.distance.max} km</p>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('PDF Created', `Saved to ${uri}`);
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    Alert.alert('Error', 'Failed to generate PDF');
  }
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Monthly Health Report (July)</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : healthStats && patientInfo ? (
        <View>
          <View style={styles.reportCard}>
            <Text style={styles.metricTitle}>Patient Details</Text>
            <Text style={styles.metricText}>Name: {patientInfo.name}</Text>
            <Text style={styles.metricText}>Age: {patientInfo.age}</Text>
            <Text style={styles.metricText}>Status: {patientInfo.status}</Text>
            <Text style={styles.metricText}>Medical Conditions: {patientInfo.medical_conditions}</Text>
            <Text style={styles.metricText}>Caregiver ID: {patientInfo.caregiver_id}</Text>
          </View>

          <HealthReportCard title="Heart Rate (BPM)" data={healthStats.bpm} unit="bpm" />
          <HealthReportCard title="Calories Burned" data={healthStats.calories} unit="kcal" />
          <HealthReportCard title="Steps" data={healthStats.steps} unit="steps" />
          <HealthReportCard title="Distance" data={healthStats.distance} unit="km" />

          <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
            <Text style={styles.downloadButtonText}>Download as PDF</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.errorText}>No data found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  header: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  reportCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  metricText: {
    fontSize: 14,
    marginBottom: 4,
  },
  downloadButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
});

export default MonthlyReport;