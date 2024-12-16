import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../components/NavBar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";
import { Link, useLocalSearchParams } from 'expo-router';
import { useRouter } from "expo-router";
import useAuth from "../backend/../hooks/useAuth";
import { useFocusEffect } from '@react-navigation/native';

const QueriesPage = () => {
  const router = useRouter();
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedCaregiverFilter, setSelectedCaregiverFilter] = useState('ALL');
  const { apiBaseUrl, loading: configLoading, error: configError } = useConfig();
  const { userId } = useLocalSearchParams;
  const [expandedQueries, setExpandedQueries] = useState([]);

  const { user, loading: authLoading } = useAuth();
  const toggleExpand = (index) => {
    setExpandedQueries(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };


  useFocusEffect(
    useCallback(() => {
      const fetchAllQueries = async () => {
        if (!user || !apiBaseUrl || configLoading || authLoading) return;

        setLoading(true);
        setError(null);

        try {
          let fetchedQueries = [];

          console.log("this is user id", user.userId);
          // Admin: Fetch queries directly from /admin/queries
          const response = await fetch(`${apiBaseUrl}/admin/queries`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.userId ? user.userId : null,
              type: user.type,
            }),
          });
          const result = await response.json();
          console.log(result);
          if (result.success) {
            fetchedQueries = result.data; // Only fetched data for admin
          } else {
            throw new Error(result.message || 'Failed to fetch queries');
          }
          console.log("im fetched queries before sent queries", fetchedQueries);

          if (user.type === 'caregiver') {
            // Caregiver: Fetch queries from /admin/allqueries
            const caregiverResponse = await fetch(`${apiBaseUrl}/admin/allqueries`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user.userId ? user.userId : null,
                sender_type: 'caregiver',
              }),
            });
            const caregiverResult = await caregiverResponse.json();

            if (!caregiverResult.success) {
              throw new Error(caregiverResult.message || 'Failed to fetch caregiver queries');
            }

            // Combine the fetched queries with caregiver queries
            // First ensure the queries are unique by query_id
            const combinedQueries = [
              ...fetchedQueries, // Add the fetched queries from the first call
              ...caregiverResult.data, // Add caregiver-specific queries
            ];

            // Ensure uniqueness of queries by query_id
            fetchedQueries = combinedQueries.reduce((acc, current) => {
              if (!acc.some((query) => query.query_id === current.query_id)) {
                acc.push(current);
              }
              return acc;
            }, []);
          }
          console.log(fetchedQueries);

          // Update states with the combined and unique queries
          setQueries(fetchedQueries);
          setFilteredQueries(fetchedQueries);
        } catch (err) {
          setError(err.message || 'An error occurred while fetching queries');
        } finally {
          setLoading(false);
        }
      };

      fetchAllQueries();
    }, [apiBaseUrl, configLoading, authLoading, user, userId])
  );



  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'ALL') {
      setFilteredQueries(queries);
    } else {
      setFilteredQueries(queries.filter((query) => query.sender_type === filter.toLowerCase()));
    }
  };

  const handleCaregiverFilterChange = (filter) => {
    setSelectedCaregiverFilter(filter);
    if (filter === 'ALL') {
      setFilteredQueries(queries);
    } else if (filter === 'SENT') {
      console.log("before filtering sent",queries);
      const sentQueries = queries.filter((query) => query.sender_type === 'caregiver');
      setFilteredQueries(sentQueries);
    } else if (filter === 'RECEIVED') {
      const receivedQueries = queries.filter((query) => query.recepient === 'caregiver');
      setFilteredQueries(receivedQueries);
    }
  };

  if (configLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading configuration...</Text>
      </View>
    );
  }

  if (configError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading configuration: {configError}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading queries...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={wp(5)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>QUERIES</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={wp(5)} color="#000" />
          </TouchableOpacity>
        </View>

        {user.type !== 'caregiver' && (
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'ALL' && styles.activeFilter]}
              onPress={() => handleFilterChange('ALL')}
            >
              <Text style={[styles.filterText, selectedFilter === 'ALL' && styles.activeFilterText]}>ALL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'FAMILY' && styles.activeFilter]}
              onPress={() => handleFilterChange('FAMILY')}
            >
              <Text style={[styles.filterText, selectedFilter === 'FAMILY' && styles.activeFilterText]}>FAMILY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'CAREGIVER' && styles.activeFilter]}
              onPress={() => handleFilterChange('CAREGIVER')}
            >
              <Text style={[styles.filterText, selectedFilter === 'CAREGIVER' && styles.activeFilterText]}>CAREGIVER</Text>
            </TouchableOpacity>
          </View>
        )}

        {user.type === 'caregiver' && (
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, selectedCaregiverFilter === 'ALL' && styles.activeFilter]}
              onPress={() => handleCaregiverFilterChange('ALL')}
            >
              <Text style={[styles.filterText, selectedCaregiverFilter === 'ALL' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedCaregiverFilter === 'SENT' && styles.activeFilter]}
              onPress={() => handleCaregiverFilterChange('SENT')}
            >
              <Text style={[styles.filterText, selectedCaregiverFilter === 'SENT' && styles.activeFilterText]}>Sent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedCaregiverFilter === 'RECEIVED' && styles.activeFilter]}
              onPress={() => handleCaregiverFilterChange('RECEIVED')}
            >
              <Text style={[styles.filterText, selectedCaregiverFilter === 'RECEIVED' && styles.activeFilterText]}>Received</Text>
            </TouchableOpacity>
          </View>
        )}


        <View style={styles.queriesContainer}>
          <ScrollView>
          {filteredQueries.length > 0 ? (
  filteredQueries.map((query, index) => (
    <View key={query.query_id} style={styles.queryCard}>
      {/* User Info Section */}
      <View style={styles.queryInfo}>
        <Image
          source={{
            uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
          }}
          style={styles.userImage}
        />
        <View style={styles.queryDetails}>
          <Text style={styles.userName}> Sender ID: {query.sender_id}</Text>
          <Text style={styles.querySubject}>{query.subject}</Text>
          <Text style={styles.queryDescription}>{query.message}</Text>
        </View>
      </View>

      {query.sender_type !== 'caregiver' && (
  <Link
    href={{
      pathname: '/responsepage',
      params: { query: query, queryId: query.query_id }, // Passing the entire query object
    }}
    style={styles.respondButton}
  >
    <Text style={styles.respondButtonText}>Respond</Text>
  </Link>
)}


      {(selectedCaregiverFilter === 'SENT' || query.sender_type === 'caregiver') && (
        <View>
          <View
            style={[
              styles.statusField,
              query.is_resolved === true ? styles.resolved : styles.unresolved,
            ]}
          >
            <Text style={styles.statusFieldText}>
              {query.is_resolved === true ? 'Responded' : 'Pending'}
            </Text>
          </View>

          {query.is_resolved && (
            <TouchableOpacity
              style={styles.responseButton}
              onPress={() => toggleExpand(index)} // Toggling the response
            >
              <Text style={styles.responseButtonText}>
                {expandedQueries[index] ? 'Hide Response' : 'Show Response'}
              </Text>
            </TouchableOpacity>
          )}

          {expandedQueries[index] && query.response && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseText}>{query.response}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  ))
) : (
  <Text>No queries found.</Text>
)}

          </ScrollView>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: wp(4),
    color: 'red',
    textAlign: 'center',
  },
  main: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
  },
  noQueriesContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: wp(5),
},
noQueriesText: {
  fontSize: wp(4),
  color: '#888',
  textAlign: 'center',
},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  backButton: {
    padding: wp(2.5),
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#1D1617',
  },
  menuButton: {
    padding: wp(2.5),
  },
  queriesContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: wp(5),
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 4,
  },
  // queryCard: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   backgroundColor: '#ADC1D8',
  //   borderRadius: wp(4),
  //   padding: wp(4),
  //   marginBottom: hp(2),
  // },
  queryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  queryDetails: {
    flex: 1,
  },
  queryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
  },
statusField: {
  paddingVertical: hp(0.8),
  paddingHorizontal: wp(3),
  borderRadius: wp(3),
  marginTop: 'auto',  // Pushes this element to the bottom
  width: wp(28), // Set a fixed width (e.g., 80% of the screen width)

},

  resolved: {
    backgroundColor: "#4CAF50", // Green for responded queries
  },
  unresolved: {
    backgroundColor: "#F44336", // Red for pending queries
  },
  statusFieldText: {
    fontSize: wp(2.5),
    fontWeight: "600",
    color: "#FFF",
    textAlign:'center'

  },
  responseButton: {
    marginTop: hp(1),
    backgroundColor: "#2196F3",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
  width: wp(28),
    
  },
  responseButtonText: {
    color: "#FFF",
    fontSize: wp(2.5),
    fontWeight: "600",
    textAlign:'center'
  },
  responseContainer: {
    marginTop: hp(5),
    padding: wp(2),
    backgroundColor: "#E1F5FE",
    borderRadius: wp(4),
  },
  responseText: {
    fontSize: wp(3.5),
    color: "#333",

  },
  userName: {
    fontSize: wp(3.3),
    fontWeight: '700',
    color: '#000',
    marginBottom: hp(0.5),
  },
  querySubject: {
    fontSize: wp(3.3),
    fontWeight: '700',
    color: '#406B9E',
    marginBottom: hp(0.5),
},

queryDescription: {
    fontSize: wp(3.3),
    color: '#333',
},
  respondButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    width:wp(28),

  },

  respondButtonText: {
    textAlign:'center',
    fontSize: wp(2.5),
    fontWeight: '600',
    color: '#000',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  filterButton: {
    flex: 1,
    paddingVertical: hp(1),
    marginHorizontal: wp(1),
    backgroundColor: '#E0E0E0',
    borderRadius: wp(3),
    alignItems: 'center',
  },
  filterText: {
    fontSize: wp(3.5),
    color: '#000',
  },
  activeFilter: {
    backgroundColor: '#ADC1D8',
  },
  activeFilterText: {
    fontWeight: '700',
  },
});

export default QueriesPage;
