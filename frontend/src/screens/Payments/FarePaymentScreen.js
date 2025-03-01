import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

const billingMethods = ["M-pesa", "Credit Card"]
const destinations = [
    {label: 'To/From Nairobi to From/To Rongai', fare: 100},
    {label: 'To/From Nyayo From/TO Nairobi', fare: 30},
    {label: "To/From Lang'ata From/To Nairobi", fare: 50},
    {label: 'To/From Bomas From/To Nairobi', fare: 70},
    {label: 'To/From Multimedia From/To Nairobi', fare: 100}
    ];

const FarePaymentScreen = ({navigation, route}) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(destinations[0]);

    return(
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Evpay Payment</Text>

            <Text style={styles.inputText}>Seat Number</Text>
            <TextInput
                style={styles.input}
            />

            <Text style={styles.inputText}>Name</Text>
            <TextInput style={styles.input}/>

            <Text style={styles.inputText}>Destination</Text>
            <Picker
                selectedValue={selectedDestination}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => selectedDestination(itemValue)}
            >
                {destinations.map((destination, index) => (
                    <Picker.Item key={index} label={destination.label} value={destination}/>
                ))}
            </Picker>

            <Text style={styles.inputText}>Fare</Text>
            <TextInput
                style={styles.input}
                value={`$${selectedDestination.fare}`}
                editable={false}
            />

            <Text style={styles.inputText}>Billing methods</Text>
            <View style={styles.radioGroup}>
                {billingMethods.map((method, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.radioButton}
                        onPress={() => setSelectedMethod(method)}
                    >
                        <View style={styles.radioOuter}>
                            {selectedMethod === method && <View style={styles.radioInner}/>}
                        </View>
                        <Text style={styles.radioText}>{method}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    title:{
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    inputText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    radioGroup: {
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderColor: "#007bff",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#007bff",
    },
    radioText: {
        fontSize: 18,
    },
    payButton: {
        backgroundColor: "#50ff50",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    payButtonText: {
        fontSize: 20,
        color: "#000",
        fontWeight: "bold",
    },
});

export default FarePaymentScreen;