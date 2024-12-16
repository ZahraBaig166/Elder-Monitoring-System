import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Import useLocalSearchParams hook
import { useRouter } from 'expo-router';  // Import the useRouter hook
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";

const ResponsePage = () => {
    const { queryId, query, type } = useLocalSearchParams();  // Access fetchQueries function
    const router = useRouter();
    const [userResponse, setUserResponse] = useState('');
    const { apiBaseUrl, loading: configLoading, error: configError } = useConfig();

    // Reset the response field if query changes
    useEffect(() => {
      setUserResponse('');  // Reset userResponse whenever a new query is selected
    }, [queryId, query]);

    const handleSubmit = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/queries_respond`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query_id: queryId, response: userResponse }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Deleting the query after the response has been successfully submitted
            await fetch(`${apiBaseUrl}/admin/queries/${queryId}`, {
              method: 'DELETE',
            });

            // After deleting the query, alert the user and navigate back to Queries page
            alert('Response has been submitted and query deleted!');
            router.push('/Queries');  // Redirect back to the Queries page
          } else {
            alert(result.message || 'Failed to respond');
          }
        } else {
          alert('Failed to submit response, please try again later');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        alert('An error occurred while submitting the response');
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Respond to Query: {query.subject}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your response..."
          multiline
          value={userResponse}
          onChangeText={setUserResponse}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Response</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
  },
  header: {
    fontSize: wp(5),
    fontWeight: '700',
    marginBottom: hp(2),
  },
  input: {
    height: hp(15),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp(2),
    padding: wp(3),
    fontSize: wp(3.5),
    marginBottom: hp(3),
  },
  submitButton: {
    backgroundColor: '#ADC1D8',
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    borderRadius: wp(3),
    alignSelf: 'center',
  },
  submitButtonText: {
    fontSize: wp(4),
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ResponsePage;
