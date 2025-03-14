import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { API_BASE_URL } from '@env';
import axios from "axios";

const Activities = ({ navigation }) => {
    const [activities, setActivities] = useState([]);

    // fetch activities from backend
    useEffect(() => {
        const fetchActivities = async () => {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.error("No auth token found!");
                return
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/api/profiles/activities?limit=4`, { headers: { Authorization: `Bearer ${token}` },});
                setActivities(response.data.activities);
            } catch (error) {
                console.error("Error fetching activities: ", error);
            }
        };
        fetchActivities();
    }, []);

    return(
        <View style={styles.activities}>
            <View style={styles.headerRow}>
                <Text style={styles.activitiesTitle}>My Evpay Activities</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AllActivities')}>
                    <Text style={styles.seeMore}>See More</Text>
                </TouchableOpacity>
            </View>
            {activities.length > 0 ?(
                activities.map((activity) => (
                    <Text key={activity.id} style={styles.activity}>{activity.description} at {activity.timestamp} </Text>
                ))
            ) : (
                <Text style={styles.activity}>No recent activities</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    activities: {
        backgroundColor: "#50ff50",
        margin: 20,
        padding: 15,
        borderRadius: 10,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    activitiesTitle: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: "bold",
    },
    seeMore: {
        fontSize: 16,
        color: "#0000ff",
    },
    activity: {
        fontSize: 18,
        marginBottom: 5,
    },
});

export default Activities;