import react, {useState, useEffect} from "react";
import { View, Text, StyleSheet,ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import axios from "axios";
import {API_BASE_URL} from '@env'

const BusInformationScreen = ({navigation, route}) => {
    const { user, isEdit } = route.params;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        busModel: '',
        busPlateNo: '',
        busBatteryModel: '',
        busBatteryCompany: '',
        busSeatNo: '',
    });

    useEffect(() => {
        if (isEdit) {
            // fettching data from backend
            const fetchBusData = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/profiles/driver_bus/${user.user_id}`);
                    if (!response.data.message) { setFormData(response.data); }
                } catch (error) {
                    console.error("Error fetching bus data: ", error);
                }
            };
            fetchBusData();
        }
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try{
            const endpoint = `${API_BASE_URL}/api/${isEdit ? 'profiles/driver_bus_update' : 'auth/register_bus'}`;
            const response = await axios({
                method: isEdit ? 'PUT' : 'POST',
                url: endpoint,
                data: { ...formData, user_id: user.user_id}
            });

            if (response === 200){ navigation.goBack(); }
        } catch (error) { console.error('Error saving bus data ', error); }
        finally {setLoading(false)}
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>{isEdit? 'Edit' : 'Add' } Bus Information</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Bus Model"
                    value={formData.busModel}
                    onChangeText={text => setFormData({...formData, busModel:text})}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Plate Number"
                    value={formData.busPlateNo}
                    onChangeText={text => setFormData({...formData, busPlateNo:text})}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Battery Model"
                    value={formData.busBatteryModel}
                    onChangeText={text => setFormData({...formData, busBatteryModel:text})}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Battery company"
                    value={formData.busBatteryCompany}
                    onChangeText={text => setFormData({...formData, busBatteryCompany:text})}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Number of seats"
                    keyboardType="numeric"
                    value={formData.busSeatNo}
                    onChangeText={text => setFormData({...formData, busSeatNo:text})}
                />

                {loading ? (
                    <ActivityIndicator size='large' color='#0000ff' />
                ): (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>{isEdit ? 'Update' : "Save"} Bus Information</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight:'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    button: {
        backgroundColor: '#50ff50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BusInformationScreen;