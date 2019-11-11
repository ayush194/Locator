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
import styles from '../public/styles';

class ForgotpasswordScreen extends React.Component {
    static navigationOptions = {
        title: 'ForgotPassword',
    };
    render() {
        return(
            <View style={[styles.container, styles.bgblack]}>
                <Text style={[styles.white, {fontSize: 20,}]}>Sorry we cannot recover your account</Text>
            </View>
        );
    }
}

export default ForgotpasswordScreen;