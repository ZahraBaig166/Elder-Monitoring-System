import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useConfig from "../hooks/useConfig";
import useAuth from '../hooks/useAuth';
import Icon from "react-native-vector-icons/FontAwesome";

const UserQueries = () => {
  const [queries, setQueries] = useState([]);
  const [expandedQueries, setExpandedQueries] = useState({});
  const { apiBaseUrl, loading, error } = useConfig();
  const { user, loading: authLoading } = useAuth();

  // Fetch user queries only if authLoading is false
  useEffect(() => {
    if (authLoading || loading || !apiBaseUrl || !user) return; // Ensure auth is ready before fetching queries

    const fetchQueries = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/allfamily`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sender_id: user.userId, sender_type: 'family' }),
        });
        const familyResult = await response.json();
        
        if (!familyResult.success) {
          throw new Error(familyResult.message || 'Failed to fetch caregiver queries');
        }
        
        setQueries(familyResult.data); // Assuming familyResult contains a data field with the queries
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, [authLoading, loading, apiBaseUrl, user]);

  const toggleExpand = (index) => {
    setExpandedQueries(prevState => ({
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
          <Text style={styles.headerText}>My Queries</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={wp(5)} color="#000" />
          </TouchableOpacity>
        </View>

        {/* User Queries List */}
        <ScrollView style={styles.queriesContainer}>
          {queries.map((query, index) => (
            <View key={index} style={styles.queryCard}>
              <View style={styles.cardContent}>
                <Text style={styles.querySubject}>{query.subject}</Text>
                <Text style={styles.queryMessage}>{query.message}</Text>
              </View>

              <View
                style={[
                  styles.statusField,
                  query.is_resolved === true ? styles.resolved : styles.unresolved,
                ]}
              >
                <Text style={styles.statusFieldText}>
                  {query.is_resolved === true ? "Responded" : "Pending"}
                </Text>
              </View>

              {query.is_resolved && (
                <TouchableOpacity
                  style={styles.responseButton}
                  onPress={() => toggleExpand(index)}
                >
                  <Text style={styles.responseButtonText}>
                    {expandedQueries[index] ? "Hide Response" : "Show Response"}
                  </Text>
                </TouchableOpacity>
              )}

              {expandedQueries[index] && query.response && (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseText}>{query.response}</Text>
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
  queriesContainer: {
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
  queryCard: {
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
  querySubject: {
    fontSize: wp(4),
    fontWeight: "700",
    color: "#000",
  },
  queryMessage: {
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
  resolved: {
    backgroundColor: "#4CAF50", // Green for responded queries
  },
  unresolved: {
    backgroundColor: "#F44336", // Red for pending queries
  },
  statusFieldText: {
    fontSize: wp(3.5),
    fontWeight: "600",
    color: "#FFF",
    textAlign:'center'


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
    textAlign:'center'
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

export default UserQueries;
