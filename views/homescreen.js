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
//import {MapView} from 'react-native-maps';

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };
    constructor(props) {
        super(props);
        this.state = {
            firstname: props.navigation.state.params.firstname,
            lastname: props.navigation.state.params.lastname,
            username: props.navigation.state.params.username,
            searchradius: 5,
            userlocation: {
                latitude: props.navigation.state.params.location.latitude,
                longitude: props.navigation.state.params.location.longitude,
                //latitudeDelta: 0.0622,
                //longitudeDelta: 0.0421
            },
            nearbyusers: []
        };
    }

    increaseRadius() {
        this.setState( (currstate) => { 
            let newstate = Object.assign({}, currstate);
            newstate.searchradius = currstate.searchradius * 2;
            console.log("Increased radius of search to: "+2*this.state.searchradius);
            return newstate;
        });
    }

    addMoreUsers(users) {
        //for now assume there is a single user in users
        console.log("Adding requested user's location on map...");
        console.log(this.state.nearbyusers);
        let newnearbyusers = []
        let max_id = 0;
        this.state.nearbyusers.forEach((item) => {
            newnearbyusers.push(item);
            max_id = Math.max(max_id, item.id);
        })
        newnearbyusers.push({
            location: {latitude: users.location.latitude,
                longitude: users.location.longitude,},
            username: users.username,
            phone: users.phone,
            firstname: users.firstname,
            lastname: users.lastname,
            id: max_id+1,
        });
        this.setState({nearbyusers: newnearbyusers});
        console.log(this.state.nearbyusers);
        /*
        this.setState((prevstate) => {
            nearbyusers: [/*...prevstate.nearbyusers, users]
        });
        */
        console.log("Adding requested user...");
        console.log("Updating the map...");
    }

    async getUserLocationHandler() {
        //Trying to access user location
        console.log("Requesting for permission to use geolocation services!");
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Sweetchat',
                message:
                    'Sweetchat wants to acces your geolocation services' +
                    'so it can share it with other people nearby',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission granted!");
            Geolocation.getCurrentPosition(
                position => {
                    console.log(position);
                    this.setState( (currstate) => {
                        let newstate = Object.assign({}, currstate);
                        newstate.userlocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            //latitudeDelta: 0.0622,
                            //longitudeDelta: 0.0421
                        }
                        return newstate;
                    });
                    console.log("Updating your current coordinates...");
                    console.log(this.state.username+" "+position.coords.latitude+" "+position.coords.longitude);
                    fetch("http://172.17.74.65:8080/updatelocation", {
                        method: "POST",
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: this.state.username,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        })
                    })
                    .then(resp => resp.json())
                    .then(resp => {
                        console.log(resp);
                        if (resp.updated) {
                            console.log("Successfully updated current coordinates!");
                        } else {
                            console.log("Couldn't update user location. Something went wrong!");
                        }
                    })
                    .catch(err => console.log(err));
                },
                err => console.log(err),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            console.log("Permission denied! Cannot access device's geolocation services");
        }
    };
    
    getNearbyUsersHandler = () => {
        console.log("Getting the locations of people nearby...");
        let url = "http://172.17.74.65:8080/searchnearby?username="
            +this.state.username
            +"&latitude="+this.state.userlocation.latitude
            +"&longitude="+this.state.userlocation.longitude
            +"&searchradius="+this.state.searchradius;
        fetch(url)
        .then((resp) => resp.json())
        .then(resp => {
            console.log("Fetched nearby users!");
            console.log("Updating the map");
            const nearbyusers = [];
            for (const key in resp.nearbyusers) {
                nearbyusers.push({
                    location: {latitude: resp.nearbyusers[key].location.latitude,
                                longitude: resp.nearbyusers[key].location.longitude,},
                    username: resp.nearbyusers[key].username,
                    phone: resp.nearbyusers[key].phone,
                    firstname: resp.nearbyusers[key].firstname,
                    lastname: resp.nearbyusers[key].lastname,
                    id: key
                });
            }
            this.setState( (currstate) => {
                let newstate = Object.assign({}, currstate);
                newstate.nearbyusers = nearbyusers
                return newstate;
            });
        })
        .catch(err => console.log(err));
    };
    
    render() {
        //const { navigation } = this.props;
        //console.log(navigation);
        return (
            <View style={styles.container, styles.bgblack}>
                {/*<Text style={styles.white}>{"Welcome "+this.state.firstname+" "+this.state.lastname}</Text>*/}
                <UsersMap 
                    user={{username: this.state.username,
                           firstname: this.state.firstname,
                           lastname: this.state.lastname,
                           userlocation: this.state.userlocation,
                           searchradius: this.state.searchradius,
                        }}
                    nearbyusers={this.state.nearbyusers}
                    navigation={this.props.navigation}
                />
                <TouchableOpacity style={[styles.container, styles.smallroundbutton, {position: 'absolute', bottom: 40, left: "7%"}]}
                    onPress={this.increaseRadius.bind(this)}>
                    <Icon size={15} color="white" name="search-plus" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.container, styles.smallroundbutton, {position: 'absolute', bottom: 40, left: "24%"}]}
                    onPress={this.getUserLocationHandler.bind(this)}>
                    <Icon size={15} color="white" name="refresh" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.container, styles.roundbutton, {position: 'absolute', bottom: 40, right:"41.5%"}]}
                    onPress={this.getNearbyUsersHandler}>
                    <Icon size={24} color="white" name="search" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.container, styles.smallroundbutton, {position: 'absolute', bottom: 40, right: "24%"}]}
                    onPress={() => this.props.navigation.navigate('Profile', {username: this.state.username})}>
                    <Icon2 size={15} color="white" name="account" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.container, styles.smallroundbutton, {position: 'absolute', bottom: 40, right: "7%"}]}
                    onPress={() => this.props.navigation.navigate('Searchuser', {onGoBack: (users) => this.addMoreUsers(users)})}>
                    <Icon2 size={15} color="white" name="account-search" />
                </TouchableOpacity>
            </View>
        );
      }
    /*
    render() {
        return(
            <View>
                <Text>You are at home...</Text>
            </View>
        )
    }
    */
}

export default HomeScreen;