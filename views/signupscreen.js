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

class SignupScreen extends React.Component {
    static navigationOptions = {
        title: 'SignUp',
    };
    constructor(props) {
        super(props);
        this.state = {firstname:"", lastname:"", username:"", password:"", gender:"", phone:""};
    }
    signupAttempt() {
        //use the current state to attempt login
        //validate form data
        if (this.state.firstname.trim() == "") {
            this.setState({firstnameerr: true});
            return;
        } else {
            this.setState({firstnameerr: null});
        }
        if (this.state.lastname.trim() == "") {
            this.setState({lastname: ""});
        }
        if (this.state.username.trim() == "") {
            this.setState({usernameerr: true});
            return;
        } else {
            this.setState({usernameerr: null});
        }
        if (this.state.password.trim() == "") {
            this.setState({passworderr: true});
            return
        } else {
            this.setState({passworderr: null});
        }
        if (this.state.phone.trim() == "") {
            this.setState({phoneerr: true});
            return;
        } else {
            this.setState({phoneerr: null});
        }
        if (this.state.selectedcustomsegment == undefined) {
            this.setState({gendererr: true})
            return;
        } else {
            this.setState({gendererr: null});
        }
        //fetching = true;
        console.log(this.state);
        fetch('http://172.17.74.65:8080/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                authentication: "SignupAuth",
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                //email: this.state.email,
                username: this.state.username,
                password: this.state.password,
                phone: this.state.phone,
                gender: this.state.selectedcustomsegment.value,
                //password: bcrypt.hashSync(this.state.password, 10),
            }),
        })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp.authenticated);
            if (resp.authenticated == 1) {
                console.log("Signup Authenticated!");
                this.props.navigation.navigate('Login');
            } else if (resp.authenticated == -2) {
                console.log("Signup Failed! Username not available!");
            } else {
                console.log("Server Error");
            }
        })
        .catch((error) => {console.error(error);});
    }
    
    renderCustomSegmentControl(){
		const options = [
			{ label:'Male', value: 'Male' },
			{ label:'Female', value: 'Female'},
		];

		return (
            <SegmentedControls
                style={{width:250,}}
                tint= {'#aefaef'}
                selectedTint= {'black'}
                backTint= {'#000000'}
                paddingTop={10}
                paddingBottom={10}
                optionStyle= {{
                    fontSize: 20,
                    fontWeight: 'bold',
                    fontFamily: 'Times'
                }}
                containerStyle= {{
                    margin:20,
                    width:250,
                }}
                containerBorderRadius={50}
                options={ options }
                onSelection={ (option) => this.setState(currstate => {
                    let newstate = Object.assign({}, currstate);
                    newstate.selectedcustomsegment = option;
                    return newstate;
                })}
                selectedOption={ this.state.selectedcustomsegment }
                extractText={ (option) => option.label }
                testOptionEqual={ (a, b) => {
                    if (!a || !b) {
                        return false;
                    }
                    return a.label === b.label
                }}
            />
        );
    }
    
	render() {
		return (
			<View style={[styles.container, styles.bgblack, {paddingTop: 30}]}>
                <ScrollView style={styles.scrollView}>
                <TextInput 
				style={[styles.textinput, styles.white]}
				placeholder="Firstname"
				placeholderTextColor="rgba(255,255,255,0.7)"
                paddingHorizontal={30}
                onChangeText={ function(text) {this.setState(function(currstate) {
                    let newstate = Object.assign({}, currstate);
                    newstate.firstname = text.trim();
                    return newstate;
                })}.bind(this)}
				/>
                {!!this.state.firstnameerr && (
                    <Text style={[styles.appcolor, {textAlign:"center"}]}>Invalid Firstname</Text>
                )}
                <TextInput 
				style={[styles.textinput, styles.white]}
				placeholder="Lastname"
				placeholderTextColor="rgba(255,255,255,0.7)"
                paddingHorizontal={30}
                //note that calling this.setState({prop: val}) only changes the value of the
                //specified property. If there are other properties, their values won't change
                onChangeText={ (text) => this.setState({lastname: text.trim()})}
				//onChangeText={ (text) => this.setState({lastname: text})} 
				/>
                {!!this.state.lastnameerr && (
                    <Text style={[styles.appcolor, {textAlign:"center"}]}>Invalid Lastname</Text>
                )}
                {/*
                <TextInput 
				style={[styles.textinput, styles.white]}
				placeholder="Email"
				placeholderTextColor="rgba(255,255,255,0.7)"
				paddingHorizontal={30}
				//onChangeText={ (text) => this.setState({email: text})} 
                />
                */}
                <TextInput 
				style={[styles.textinput, styles.white]}
				placeholder="Username"
				placeholderTextColor="rgba(255,255,255,0.7)"
                paddingHorizontal={30}
                onChangeText={ (text) => this.setState( (currstate) => {
                    let newstate = Object.assign({}, currstate);
                    newstate.username = text.trim();
                    return newstate;
                })}
                //onChangeText={ (text) => this.setState({username: text})} 
				/>
                {!!this.state.usernameerr && (
                    <Text style={[styles.appcolor, {textAlign:"center"}]}>Invalid Username</Text>
                )}
				<TextInput 
				style={[styles.textinput, styles.white]}
				placeholder="Password"
				placeholderTextColor="rgba(255,255,255,0.7)"
				paddingHorizontal={30}
                secureTextEntry={true}
                onChangeText={ (text) => this.setState( (currstate) => {
                    let newstate = Object.assign({}, currstate);
                    newstate.password = text.trim();
                    return newstate;
                })}
                //onChangeText={ (text) => this.setState({password: text})}
                />
                {!!this.state.passworderr && (
                    <Text style={[styles.appcolor, {textAlign:"center"}]}>Invalid Password</Text>
                )}
				<TextInput 
				style={[styles.textinput, styles.white]}
				placeholder="Phone"
				placeholderTextColor="rgba(255,255,255,0.7)"
				paddingHorizontal={30}
                onChangeText={ (text) => this.setState({phone: text.trim()})}
				/>
                {!!this.state.phoneerr && (
                    <Text style={[styles.appcolor, {textAlign:"center"}]}>Invalid Phone</Text>
                )}
                {this.renderCustomSegmentControl()}
                {!!this.state.gendererr && (
                    <Text style={[styles.appcolor, {textAlign:"center"}]}>Invalid Gender</Text>
                )}
                <TouchableOpacity
				style={[styles.black, styles.loginbutton]}
				onPress={this.signupAttempt.bind(this)}>
				<Text style={[styles.black, {fontSize: 20, fontWeight: 'bold',}]}>Create Account</Text>
				</TouchableOpacity>
                </ScrollView>
			</View>
		)
	}
}

export default SignupScreen;


/*
some important observations from this implementation

'this' (aka "the context") is a special keyword inside each function and its value only depends
on how the function was called, not how/when/where it was defined. It is not affected by lexical
scopes like other variables

Let's say your button 'ClickMe' has a prop onClick which takes as an argument a callback function
Let's say you use 'this' pointer inside the callback. Then depending on how you define the callback
'this' pointer can refer to different objects. For example:

1. (text) => this.setState(text);

is equivalent to writing

2. function(text) {this.setState(text);}.bind(this)

On the other hand 

3. function(text) {this.setState();}

will mean a completely different thing

3. to which object does 'this' point to, will depend on the context in which the function is called
2. Since you bind 'this' to the function, 'this' will always refer to the context where the function was defined
1. This is just a fancy react-native way of writing 2

*/