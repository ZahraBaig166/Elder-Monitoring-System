import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Link } from "expo-router"; 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useConfig from "../hooks/useConfig";
import Icon from "react-native-vector-icons/FontAwesome";

const ViewRequest = () => {
  const [pendingRequests, setPendingRequests] = useState([]); // State for pending requests
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All"); // State for active filter
  const { apiBaseUrl, loading, error } = useConfig();

  // Fetch pending requests
  useEffect(() => {
    if (loading || !apiBaseUrl) return; // Wait for apiBaseUrl to load
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/pending`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const allRequests = [
          ...(data.caregivers || []).map((item) => ({ ...item, type: "Caregiver" })),
          ...(data.families || []).map((item) => ({ ...item, type: "Family" })),
        ];
        setPendingRequests(allRequests);
        setFilteredRequests(allRequests); // Initially show all requests
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchRequests();
  }, [loading, apiBaseUrl]);

  // Filter requests
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === "All") {
      setFilteredRequests(pendingRequests);
    } else {
      setFilteredRequests(
        pendingRequests.filter((request) => request.type === filter)
      );
    }
  };

  if (loading) {
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
          <Link href="/Dashboard" style={styles.backButton}>
            <Icon name="arrow-left" size={wp(5)} color="#000" />
          </Link>
          <Text style={styles.headerText}>Pending Requests</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={wp(5)} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {["All", "Family", "Caregiver"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilter,
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Requests..."
            placeholderTextColor="#ADC1D8"
          />
          <Icon name="search" size={wp(4)} style={styles.searchIcon} />
        </View>

        {/* Pending Requests List */}
        <ScrollView style={styles.requestsContainer}>
          {filteredRequests.map((request, index) => (
            <Link
              key={index}
              href={{
                pathname: "/requestDetails",
                params: { requestId: request.id, requestType: request.type },
              }}
              style={styles.requestCard}
            >
              <View style={styles.cardContent}>
                <Text style={styles.requestName}>{request.name}</Text>
                <Text style={styles.requestType}>Request Type: {request.type}</Text>
              </View>
              <View style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </View>
            </Link>
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: hp(2),
  },
  filterButton: {
    borderWidth: wp(0.4),
    borderColor: "#ADC1D8",
    borderRadius: wp(5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: "#FFFFFF",
    width: wp(25),
  },
  activeFilter: {
    backgroundColor: "#ADC1D8",
    borderColor: "#ADC1D8",
  },
  filterText: {
    fontSize: wp(3),
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  activeFilterText: {
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: wp(8),
    paddingHorizontal: wp(4),
    height: hp(6),
    marginBottom: hp(3),
  },
  searchInput: {
    flex: 1,
    fontSize: wp(3.5),
    color: "#ADC1D8",
    paddingVertical: hp(0.5),
  },
  searchIcon: {
    marginLeft: wp(2),
    color: "#ADC1D8",
  },
  requestsContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderRadius: wp(5),
    padding: wp(4),
    paddingBottom: hp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 4,
  },
  requestCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ADC1D8",
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(3),
  },
  cardContent: {
    flex: 1,
  },
  requestName: {
    fontSize: wp(4),
    fontWeight: "700",
    color: "#000",
  },
  requestType: {
    fontSize: wp(3.5),
    color: "#406B9E",
    marginBottom: hp(0.5),
  },
  detailsButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(3),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.4,
    shadowRadius: wp(2),
  },
  detailsButtonText: {
    fontSize: wp(3.5),
    fontWeight: "600",
    color: "#000",
  },
});

export default ViewRequest;
