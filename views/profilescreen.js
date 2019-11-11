import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
    Text,
    Button,
	TextInput,
    TouchableOpacity,
    Image,
	Alert,
    StatusBar,
    PermissionsAndroid,
} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Geolocation from 'react-native-geolocation-service';
import styles from '../public/styles';
//import FetchLocation from "../components/fetchlocation";
import UsersMap from "../components/usersmap";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import call from 'react-native-phone-call';
import SendSMS from 'react-native-sms'

class ProfileScreen extends React.Component {
    static navigationOptions = {
        title: 'Profile',
    };
    constructor(props) {
        super(props);
        this.state = {
            username: props.navigation.state.params.username,
            loaded:false,
        }
    }

    componentWillMount() {
        console.log("Creating Profile page for user: "+this.state.username);
        let url = "http://172.17.74.65:8080/search?username="
            +this.state.username;
        fetch(url)
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            this.setState(resp);
            //resp will contain a list of users
        })
        console.log("Profile data loaded");
        this.setState({loaded: true});
    }

    render() {
        return (
            <SafeAreaView style={[styles.container, styles.bgblack]}>
                <View style={[styles2.header]}></View>
                {this.state.loaded==true ?
                    <View style={{margin:20, alignItems:"center"}}>
                        {this.state.gender=="Male" ?
                        <Image style={styles2.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar7.png'}}/>
                        : <Image style={styles2.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar5.png'}}/>
                        }
                        <Text style={[styles.white, {fontSize:20, fontWeight: "bold"}]}>{this.state.firstname+" "+this.state.lastname}</Text>
                        <Text style={[styles.white, {fontSize:12, marginBottom: 40, textAlign:"center"}]}>@{this.state.username}</Text>
                        <View style={{flexDirection: "row", alignItems:"center"}}>
                            <Text style={[styles.textinput, styles.white, {fontSize: 15, margin: 10, padding: 15, width: "70%"}]}>{this.state.phone}</Text>
                            <TouchableOpacity style={[styles.smallroundbutton, styles.appbgcolor, {height: 55, width: 55, justifyContent:"center"}]}
                                onPress={() => call({number: this.state.phone, prompt: false}).catch(console.error)}>
                                <Icon2 size={20} color="white" name="phone" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <TextInput
                                style={[styles.textinput, styles.white, {textAlignVertical: "top", fontSize: 15, margin: 10, padding: 15, width: "70%", borderRadius: 20}]}
                                placeholder="Message..."
                                placeholderTextColor="white"
                                multiline={true}
                                numberOfLines={5}
                                onChangeText={(text) => this.setState({text})}
                                value={this.state.text}/>
                            <TouchableOpacity style={[styles.smallroundbutton, styles.appbgcolor, {marginTop: 10,height: 55, width: 55, justifyContent:"center"}]}
                                onPress={() => SendSMS.send({
                                    body: this.state.text,
                                    recipients: [this.state.phone,],
                                    successTypes: ['sent', 'queued'],
                                    allowAndroidSendWithoutReadPermission: true
                                }, (completed, cancelled, error) => {
                                    console.log('SMS Callback: completed: ' + completed + ', cancelled: ' + cancelled + ', error: ' + error);
                                })}>
                                <Icon2 size={20} color="white" name="message-text-outline" />
                            </TouchableOpacity>
                        </View>
                    </View>
                : null}
            </SafeAreaView>
            /*
            <View style={[styles.container, styles.bgblack, {flexDirection:"row",}]}>
                {this.state.loaded==true ? 
                <TouchableOpacity style={[styles.smallroundbutton, styles.appbgcolor, {height: 55, width: 55, justifyContent:"center"}]}
                    onPress={() => call({number: this.state.phone, prompt: false}).catch(console.error)}>
                    <Icon2 size={20} color="white" name="account-search" />
                </TouchableOpacity> : null}
            </View>
            */
        );
    }
}

const styles2 = StyleSheet.create({
    header:{
        position:"absolute",
        top:0,
        height:200,
    },
    avatar: {
        width: 130,
        height: 130,
        marginBottom: 20,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: "white",
    },
    name:{
      fontSize:22,
      color:"#FFFFFF",
      fontWeight:'600',
    },
    body:{
      marginTop:40,
    },
    bodyContent: {
      flex: 1,
      alignItems: 'center',
      padding:30,
    },
    name:{
      fontSize:28,
      color: "#696969",
      fontWeight: "600"
    },
    info:{
      fontSize:16,
      color: "#00BFFF",
      marginTop:10
    },
    description:{
      fontSize:16,
      color: "#696969",
      marginTop:10,
      textAlign: 'center'
    },
    buttonContainer: {
      marginTop:10,
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:250,
      borderRadius:30,
      backgroundColor: "#00BFFF",
    },
  });

export default ProfileScreen;