import react from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ConfirmationScreen = ({ navigation, route}) => {
    const {details} = route.params || {};

    // details for testing
    const transactionDetails = details || {
        amount: 100,
        seat_number: A12,
        payment_method: "M-pesa",
        transaction_id: "MPESA_12345678",
        phone_number: '254712345678',
        timestamp: new Date().toISOString()
    };

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.iconContainer}>
                <Icon name="check-circle" size={80} color="#50ff50" />
                <Text style={styles.successText}>Payment Successful</Text>
            </View>

            <View style={styles.detailsContainer}>
                <DetailItem label='Amount' value={`$${transactionDetails.amount}`} />
                <DetailItem label='Seat Number' value={`$${transactionDetails.seat_number}`} />
                <DetailItem label='Payment Method' value={`$${transactionDetails.payment_method}`} />
                <DetailItem label='Transaction ID' value={`$${transactionDetails.transaction_id}`} />
                {transactionDetails.payment_method === 'Mpesa' && (
                    <DetailItem label="Phone Number" value={transactionDetails.phone_number} />
                )}
                <DetailItem label='Transaction Time' value={new Date(transactionDetails.timestamp).toLocaleString()} />
            </View>

            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.homeButtonText}>Return to Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const DetailItem = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    iconContainer: {
        alignItems: "center",
        marginVertical: 40,
    },
    successText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#50ff50",
        marginTop: 15,
    },
    detailsContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        elevation: 3,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 8,
    },
    detailLabel: {
        fontSize: 16,
        color: "#666",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
    },
    homeButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 20,
    },
    homeButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ConfirmationScreen;