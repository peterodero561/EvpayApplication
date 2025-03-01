import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "@env";

const AllActivitiesScreen = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchAllActivities = async () => {
            const token = await AsyncStorage.getItem('authToken');
            if (!token){
                console.error("No auth token found!");
                return;
            }

            try{
                const response = await axios.get(`${API_BASE_URL}/api/profiles/activities`, { headers: { Authorization: `Bearer ${token}`},});
                setActivities(response.data.activities);
            } catch (error){
                console.error('Error fetching all activites', error);
            }
        };
        fetchAllActivities();
    }, []);

    return(
        <ScrollView style={styles.container}>
            <Text style={styles.title}>All My Evpay activities</Text>
            {activities.length > 0 ? (
                activities.map((activity) => (
                    <View key={activity.id} style={styles.activityContainer}>
                        <Text style={styles.activityText}>
                            {activity.description} at {activity.timestamp}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noActivities}>No activites available.</Text>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    activityContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    activityText: {
        fontSize: 18,
    },
    noActivities: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
    },
});

export default AllActivitiesScreen;