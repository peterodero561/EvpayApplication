import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

const billingMethods = ["M-pesa", "Credit Card"]
const destinations = [
    {id: 'dest1', label: 'To/From Nairobi to From/To Rongai', fare: 100},
    {id: 'dest2', label: 'To/From Nyayo From/TO Nairobi', fare: 30},
    {id: 'dest3', label: "To/From Lang'ata From/To Nairobi", fare: 50},
    {id: 'dest4', label: 'To/From Bomas From/To Nairobi', fare: 70},
    {id: 'dest5', label: 'To/From Multimedia From/To Nairobi', fare: 100}
    ];

const FarePaymentScreen = ({navigation, route}) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedDestinationId, setSelectedDestinationId] = useState(destinations[0].id);
    const selectedDestination = destinations.find(dest => dest.id === selectedDestinationId);

    // use scanned data from route.params
    const {seat: initialSeat} = route.params || {};
    const [seatNumber, setSeatNumber] = useState(initialSeat || '');

    return(
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Evpay Payment</Text>

            <Text style={styles.inputText}>Seat Number</Text>
            <TextInput
                style={[styles.input, styles.disabledInput]}
                value={seatNumber?.toString()}
                editable={false}
                selectTextOnFocus={false}
            />

            <Text style={styles.inputText}>Name</Text>
            <TextInput style={styles.input}/>

            <Text style={styles.inputText}>Destination</Text>
            <Picker
                selectedValue={selectedDestinationId}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setSelectedDestinationId(itemValue)}
            >
                {destinations.map((destination) => (
                    <Picker.Item key={destination.id} label={destination.label} value={destination.id}/>
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
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.radioOuter,
                            selectedMethod === method && styles.radioOuterSelected
                        ]}>
                            {selectedMethod === method && <View style={styles.radioInner}/>}
                        </View>
                        <Text style={[
                            styles.radioText,
                            selectedMethod === method && styles.radioTextSelected
                        ]}>{method}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedMethod === 'M-pesa' && (
                <>
                    <Text style={styles.inputText}>Safaricom Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your safaricom phone Number"
                    />
                </>
            )}

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
        height: 50,
        fontSize: 16,
    },
    radioGroup: {
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff'
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderColor: "#888",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    radioOuterSelected: {
        borderColor: '#007bff',
    },
    radioInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#007bff",
    },
    radioText: {
        fontSize: 18,
        color: '#666',
    },
    radioOuterSelected: {
        color: '#007bff',
        fontWeight: '600',
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