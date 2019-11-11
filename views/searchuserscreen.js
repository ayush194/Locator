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
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../public/styles';

class SearchuserScreen extends React.Component {
    static navigationOptions = {
        title: 'Searchuser',
    };
    constructor(props) {
        super(props);
        this.state = {username:"", firstname:"", lastname:""};
    }

    searchUser() {
        console.log("Searching for user: "+this.state.username);
        let url = "http://172.17.74.65:8080/search?username="
            +this.state.username;
        fetch(url)
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            if (resp.error == 1) {
                console.log("Username not found");
                this.setState({usernameerr: true});
                return;
            } else {
                console.log("Username found");
                this.setState({usernameerr: null});
            }
            this.props.navigation.state.params.onGoBack(resp);
            this.props.navigation.goBack();
            //resp will contain a list of users
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <SafeAreaView style={[styles.container, styles.bgblack]}>
            <View style={[styles.bgblack, {flexDirection:"row",}]}>
                <TextInput
                    style={[styles.textinput, styles.white, {margin:0}]}
                    paddingHorizontal={30}
                    placeholder="Username"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    onChangeText={(text) => {this.setState( (currstate) => {
                        let newstate = Object.assign({}, currstate);
                        newstate.username = text.trim();
                        return newstate;
                    })}}
                    underlineColorAndroid="transparent"/>
                
                {/*<Icon2.Button name="account-search" size={30} color='white'/>*/}
                <TouchableOpacity style={[styles.smallroundbutton, styles.appbgcolor, {marginLeft: 20,height: 55, width: 55, justifyContent:"center"}]}
                    onPress={this.searchUser.bind(this)}>
                    <Icon2 size={20} color="white" name="account-search" />
                </TouchableOpacity>
            </View>
            {!!this.state.usernameerr && (
                    <Text style={[styles.appcolor, {marginTop: 20, textAlign:"center"}]}>Invalid Username</Text>
                )}
            </SafeAreaView>
        );
    }
}

export default SearchuserScreen;