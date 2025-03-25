import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_BASE_URL } from "@env"
import axios from "axios";
import io from 'socket.io-client'
import { ActivityIndicator } from "react-native";

const billingMethods = ["M-pesa", "Credit Card"]
const destinations = [
    {id: 'dest1', label: 'To/From Nairobi to From/To Rongai', fare: 1},
    {id: 'dest2', label: 'To/From Nyayo From/TO Nairobi', fare: 30},
    {id: 'dest3', label: "To/From Lang'ata From/To Nairobi", fare: 50},
    {id: 'dest4', label: 'To/From Bomas From/To Nairobi', fare: 70},
    {id: 'dest5', label: 'To/From Multimedia From/To Nairobi', fare: 100}
    ];

const FarePaymentScreen = ({navigation, route}) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedDestinationId, setSelectedDestinationId] = useState(destinations[0].id);
    const selectedDestination = destinations.find(dest => dest.id === selectedDestinationId);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(null);
    const [socket, setSocket] = useState(null);

    // use scanned data from route.params
    const {seat: initialSeat} = route.params || {};
    const [seatNumber, setSeatNumber] = useState(initialSeat || '');

    // function to convert phone number to required format
    const formatPhoneNumber = (inputNumber) => {
        let cleaned = inputNumber.replace(/\D/g, ''); // removes non-digits
        
        // handle number with 07... and 10 digits
        if (cleaned.startsWith('07') && cleaned.length === 10){
            return '254' + cleaned.slice(1);
        }
        // handle number with 01... and 10 digits
        if (cleaned.startsWith('01') && cleaned.length === 10){
            return '254' + cleaned.slice(1);
        }
        // Handle number with 9 digits starting with 7...
        if (cleaned.startsWith('7') && cleaned.length === 9){
            return '254' + cleaned;
        }
        // Handle number with 9 digits starting with 1...
        if (cleaned.startsWith('1') && cleaned.length === 9){
            return '254' + cleaned;
        }
        // Handle numbers with +254...
        if (cleaned.startsWith('254') && cleaned.length === 12){
            return cleaned;
        }
        // Handle 254 with wrong length
        if (cleaned.startsWith('254') && cleaned.length !== 12){
            return null;
        }
        
        return null;
    };

    // payment function
    const handlePayment = async () => {
        if (!seatNumber || !selectedMethod || !selectedDestination) {
            alert("Missing import details to complete payment");
            return;
        }
        let formattedPhone = null

        // format only if M-pesa is selected
        if (selectedMethod === 'M-pesa') {
            if (!phoneNumber){
                alert("Please enter your Safaricom phone Number");
                return;
            }

            formattedPhone = formatPhoneNumber(phoneNumber);
            if (!formattedPhone || !/^254\d{9}$/.test(formattedPhone)) {
                alert("Invalid phone number format. Use 07XXX or 01XXX or 2541XXX or 2547XX");
                return;
            }
        }

        try{
            setIsProcessing(true);

            const payload ={
                amount: selectedDestination.fare,
                seat_number: seatNumber,
                payment_method: selectedMethod,
                ...(formattedPhone && { phone_number: formattedPhone })
            };

            const response = await axios.post(`${API_BASE_URL}/api/payments/pay`, payload, {headers: { "Content-Type": 'application/json' }});
            const checkoutId = response.data.CheckoutRequestID;

            // polling for transaction update
            let attempts = 0;
            const maxAttempts = 30; // 1 minute
            const pollInterval = 2000; // 2 seconds

            const poller = setInterval(async () => {
                try{
                    const statusResponse = await axios.get(`${API_BASE_URL}/api/payments/transaction/status/${checkoutId}`);
                    attempts++;

                    if (statusResponse.data.status === 'completed' || statusResponse.data.status === 'failed') {
                        clearInterval(poller);
                        setIsProcessing(false);

                        if (statusResponse.data.status === 'completed') {
                            navigation.navigate('Confirm', { details: { ...response.data, status: data.status, result_code: data.result_code, seat_number: seatNumber, payment_method: selectedMethod, phone_number: phoneNumber } });
                        } else {
                            alert(`Payment failed: ${statusResponse.data.result_code}`)
                        }
                    } else if (attempts >= maxAttempts) {
                        clearInterval(poller);
                        setIsProcessing(false);
                        alert("Payment timeout");
                    }
                } catch (error) {
                    clearInterval(poller);
                    setIsProcessing(false);
                    console.error("Polling error: ", error)
                }
            }, pollInterval);

        } catch (error) {
            setIsProcessing(false);
            console.error('Payment Error: ', error);
            alert(`Payment Failed: ${error.response?.data?.error || error.message}`);
        }
    }

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
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Enter your safaricom phone Number"
                    />
                </>
            )}

            <TouchableOpacity style={[styles.payButton, isProcessing && styles.disabledButton]} onPress={handlePayment} disabled={isProcessing}>
                <Text style={styles.payButtonText}>{isProcessing ? 'Processing...' : 'Pay Now'}</Text>
            </TouchableOpacity>

            {isProcessing && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Processing Payment ...</Text>
                </View>
            )}
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
    loadingOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});

export default FarePaymentScreen;