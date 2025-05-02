import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useConfig from "../hooks/useConfig";
import useAuth from '../hooks/useAuth';
import Icon from "react-native-vector-icons/FontAwesome";

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [expandedNotes, setExpandedNotes] = useState({});
  const { apiBaseUrl, loading, error } = useConfig();
  const { user, loading: authLoading } = useAuth();

  // Fetch patient notes based on the patient_id (or family_id) when the component loads
  useEffect(() => {
    if (authLoading || loading || !apiBaseUrl || !user) return; // Ensure auth is ready before fetching notes
  
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/family/getPatientNotes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ family_id: user.userId }), 
        });
  
        if (!response.ok) {
          // If not 200 OK, throw error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  console.log("RESPONSE:", response);
console.log('NOTES:', notes);
        const result = await response.json();
  
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch patient notes');
        }
  
        setNotes(result.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
  
    fetchNotes();
  }, [authLoading, loading, apiBaseUrl, user]);
  

  const toggleExpand = (index) => {
    setExpandedNotes(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  if (authLoading || loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={wp(5)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Patient Notes</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={wp(5)} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Notes List */}
        <ScrollView style={styles.notesContainer}>
          {notes.map((note, index) => (
            <View key={index} style={styles.noteCard}>
              <View style={styles.cardContent}>
                <Text style={styles.noteContent}>{note.note}</Text>
                <Text style={styles.noteDate}>{new Date(note.timestamp).toLocaleDateString()}</Text>
              </View>
{/* 
              <View style={styles.statusField}>
                <Text style={styles.statusFieldText}>
                  {note.is_urgent ? "Urgent" : "Normal"}
                </Text>
              </View> */}

              {note.is_urgent && (
                <TouchableOpacity
                  style={styles.responseButton}
                  onPress={() => toggleExpand(index)}
                >
                  <Text style={styles.responseButtonText}>
                    {expandedNotes[index] ? "Hide Details" : "Show Details"}
                  </Text>
                </TouchableOpacity>
              )}

              {expandedNotes[index] && note.details && (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseText}>{note.details}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  main: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  backButton: {
    padding: wp(2.5),
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: "700",
    color: "#1D1617",
  },
  menuButton: {
    padding: wp(2.5),
  },
  notesContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderRadius: wp(5),
    padding: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 4,
  },
  noteCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#ADC1D8",
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
  },
  cardContent: {
    flex: 1,
  },
  noteContent: {
    fontSize: wp(4),
    fontWeight: "700",
    color: "#000",
  },
  noteDate: {
    fontSize: wp(3.5),
    color: "#333",
    marginTop: hp(0.5),
  },
  statusField: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    marginTop: hp(1),
  },
  statusFieldText: {
    fontSize: wp(3.5),
    fontWeight: "600",
    color: "#FFF",
    textAlign: 'center',
  },
  responseButton: {
    marginTop: hp(1),
    backgroundColor: "#2196F3",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
  },
  responseButtonText: {
    color: "#FFF",
    fontSize: wp(3.5),
    fontWeight: "600",
    textAlign: 'center',
  },
  responseContainer: {
    marginTop: hp(2),
    padding: wp(4),
    backgroundColor: "#E1F5FE",
    borderRadius: wp(4),
  },
  responseText: {
    fontSize: wp(3.5),
    color: "#333",
  },
});

export default ViewNotes;
