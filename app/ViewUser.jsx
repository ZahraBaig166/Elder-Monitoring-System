import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useConfig from "../hooks/useConfig";
import Icon from "react-native-vector-icons/FontAwesome";
import { UserProvider } from '../context/userContext';  // Adjust the path if needed

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const { apiBaseUrl, loading, error } = useConfig();

  // Fetch caregivers and patients from the backend

    useEffect(() => {
      if (loading || !apiBaseUrl) return;
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/admin/users`);
          console.log("Response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Fetched data:", data);
          
          // Map fetched data to include consistent 'type' values
          const allUsers = [
            ...(data.caregivers || []).map((user) => ({ ...user, type: "Caregiver" })),
            ...(data.family || []).map((user) => ({ ...user, type: "Family" })),
          ];
          setUsers(allUsers);
          setFilteredUsers(allUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
    
      fetchUsers();
    }, [loading, apiBaseUrl]);
    
    const handleFilterChange = (filter) => {
      setActiveFilter(filter);
      if (filter === "All") {
        setFilteredUsers(users);
      } else {
        setFilteredUsers(users.filter((user) => user.type === filter));
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
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={wp(5)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Users</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={wp(5)} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {["All", "Caregiver", "Family"].map((filter) => (
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
            placeholder="Search Users..."
            placeholderTextColor="#ADC1D8"
          />
          <Icon name="search" size={wp(4)} style={styles.searchIcon} />
        </View>

        {/* Users List */}
        <ScrollView style={styles.usersContainer}>
          {filteredUsers.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri: user.avatar || "https://via.placeholder.com/150",
                  }}
                  style={styles.userImage}
                />
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userType}>Type: {user.type}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
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
  usersContainer: {
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
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ADC1D8",
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(3),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  userName: {
    fontSize: wp(4),
    fontWeight: "700",
    color: "#000",
  },
  userType: {
    fontSize: wp(3.5),
    color: "#406B9E",
    marginBottom: hp(0.5),
  },
  detailsButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(3),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
  },
  detailsButtonText: {
    fontSize: wp(3.5),
    fontWeight: "600",
    color: "#000",
  },
});

export default ViewUser;
