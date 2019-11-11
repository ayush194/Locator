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
//var domparser = require('xmldom').DOMParser;
import {} from 'react-native-bcrypt';
//const bcrypt = require('bcryptjs')

class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Login',
    };
    constructor(props) {
        super(props);
        this.state = {username:"", password:""};
    }
    //fetching = false;
    loginAttempt() {
        //use the current state to attempt login
        //sanitize data inputs
        if (this.state.username==null || this.state.username.trim() == "") {
            this.setState({usernameerr: true});
            return;
        } else {
            this.setState({usernameerr: null});
        }
        if (this.state.password==null | this.state.password.trim() == "") {
            this.setState({passworderr: true});
            return
        } else {
            this.setState({passworderr: null});
        }
        //fetching = true;
        fetch('http://172.17.74.65:8080/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                authentication: "LoginAuth",
                username: this.state.username,
                password: this.state.password,
                //password: bcrypt.hashSync(this.state.password, 10),
            }),
        })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            if (resp.authenticated == 1) {
                console.log("Login Authenticated!");
                if (resp.location == undefined) {
                    resp.location = {latitude: 37.78825, longitude: -122.4324};
                }
                this.props.navigation.navigate('Home', {
                    firstname: resp.firstname,
                    lastname: resp.lastname,
                    username: this.state.username,
                    location: {latitude: resp.location.latitude,
                                longitude: resp.location.longitude,},
                });
            } else if (resp.authenticated == -1) {
                console.log("Login Failed! Password Incorrect!");
                this.setState({passworderr: true});
            } else if (resp.authenticated == -2) {
                console.log("Login Failed! Username doesn't exist!");
                this.setState({usernameerr: true});
            } else {
                console.log("Server Error");
            }
        })
        .catch((error) => {console.error(error);});
    }

	render() {
		return (
			<SafeAreaView style={[styles.container, styles.bgblack, {paddingTop: 30}]}>
                <ScrollView style={styles.scrollView}>
				<Text style={[styles.header, styles.white, {textAlign: "center"}]}>Locator</Text>
				<TextInput 
				style={[styles.textinput, styles.white, {alignSelf:"center"}]}
				placeholder="Username"
				placeholderTextColor="rgba(255,255,255,0.7)"
				paddingHorizontal={30}
				onChangeText={ (text) => this.setState( (currstate) => {
                    let newstate = Object.assign({}, currstate);
                    newstate.username = text.trim();
                    return newstate;
                })}/>
                {!!this.state.usernameerr && (
                    <Text style={[styles.appcolor, {textAlign:"center"}]}>Invalid Username</Text>
                )}
				<TextInput 
				style={[styles.textinput, styles.white, {alignSelf:"center",}]}
				placeholder="Password"
				placeholderTextColor="rgba(255,255,255,0.7)"
				paddingHorizontal={30}
				secureTextEntry={true}
				onChangeText={ (text) => this.setState( (currstate) => {
                    let newstate = Object.assign({}, currstate);
                    newstate.password = text.trim();
                    return newstate;
                })}/>
                {!!this.state.passworderr && (
                    <Text style={[styles.appcolor, {textAlign:"center"}]}>Invalid Password</Text>
                )}
				<TouchableOpacity
				style={[styles.black, styles.loginbutton]}
				onPress={this.loginAttempt.bind(this)}>
				<Text style={[styles.black, {fontSize: 20, fontWeight: 'bold',}]}>Login</Text>
				</TouchableOpacity>
                <Text 
                style={[styles.white, {fontSize: 10, textDecorationLine: 'underline', textAlign:"center"}]}
                onPress={() => this.props.navigation.navigate('Forgotpassword')}
                >Forgot Password?</Text>
				<View
				style={{
				margin: 20,
				width: 200,
                borderBottomColor: '#ffffff',
                alignSelf:"center",
				borderBottomWidth: StyleSheet.hairlineWidth,}}
				/>
				<TouchableOpacity
				style={[styles.black, styles.loginbutton]}
				onPress={() => this.props.navigation.navigate('Signup')}>
				<Text style={[styles.black, {fontSize: 20, fontWeight: 'bold',}]}>Sign Up</Text>
				</TouchableOpacity>
                </ScrollView>
			</SafeAreaView>
		)
	}
}

export default LoginScreen;