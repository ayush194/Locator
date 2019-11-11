import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	StatusBar,
} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { SegmentedControls } from 'react-native-radio-buttons'
import styles from '../public/styles';

class RedirectScreen extends React.Component {
    /*
    constructor(props) {
        super(props);
        this.state = {fetched: false,}
        fetch('https://localhost:8080', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstname: 'ayush',
                secondname: 'kumar',
                email: 'ayushk@iitk.ac.in',
                username: 'ayushk',
                password: 'hahaha',
                gender: 'male',
            }),
        })
        .then((resp) => this.setState({fethed:true,}))
        .catch((error) => {console.error(error);});
    }
    */
    render() {
        if (fetched) {
            return (
                <View style={[styles.container, styles.bgblack]}>
                    <Text style={[styles.white, {fontSize: 20,}]}>Logged In...Redirecting</Text>
                </View>
            )
        }
        return (
            <View style={[styles.container, styles.bgblack]}>
                <Text style={[styles.white, {fontSize: 20,}]}>Fetching...</Text>
            </View>
        );
    }
}

export default RedirectScreen;