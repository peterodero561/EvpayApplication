import react, {useState, useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput} from 'react-native';
import {API_BASE_URL} from '@env';
import axios from "axios";

const GarageInformationScreen = ({navigation, route}) => {
    const {user, isEdit} = route.params;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        garName: '',
        garLocation: '',
        garServices: '',
    });

    useEffect(() => {
        if (isEdit) {
            //fetch existing garage data
            const fetchGarageData = async () => {
                try{
                    const response = await axios.get(`${API_BASE_URL}/api/profile/manager_garage/${user.user_id}`);
                    if (!response.data.message){ setFormData(response.data); }
                } catch (error) { console.error("Error fetching garage data: ",error);}
            };
            fetchGarageData();
        }
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try{
            const endpoint = `${API_BASE_URL}/api/${isEdit ? 'profiles/manager_garage_update' : 'auth/register_garage'}`;
            const response = await axios({
                method: isEdit ? 'PUT' : 'POST',
                url: endpoint,
                data: { ...formData, user_id: user.user_id}
            });

            if (response.status === 200) { navigation.goBack(); }
        } catch (error) { console.error("Error saving garage data: ", error); }
        finally { setLoading(false); }
    };

    return(
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>{isEdit ? 'Edit' : 'Add'} Garage Infromation</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Garage Name"
                    value={formData.garName}
                    onChangeText={text => setFormData({...formData, garName:text})}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Garage Location"
                    value={formData.garLocation}
                    onChangeText={text => setFormData({...formData, garLocation:text})}
                />

<TextInput
                    style={styles.input}
                    placeholder="Garage Services"
                    value={formData.garServices}
                    onChangeText={text => setFormData({...formData, garServices:text})}
                    multiline
                />

                {loading ? (
                    <ActivityIndicator size='large' color='#0000ff'/>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>{isEdit ? 'Update' : 'Save'} Garage information</Text>
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
})

export default GarageInformationScreen;