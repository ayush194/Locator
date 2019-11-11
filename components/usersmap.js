import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import MapView, {PROVIDER_GOOGLE, UrlTile,} from "react-native-maps";
import styles from '../public/styles';
import call from 'react-native-phone-call';

const UsersMap = props => {
    let userlocationmarker = null;
    
    /*
    let meanlocation = 
        (function(){
            let lat = props.user.userlocation.latitude;
            let long = props.user.userlocation.longitude;
            props.nearbyusers.forEach(function(item, index) {
                lat += item.location.latitude;
                long += item.location.longitude;
            });
            return {latitude: lat / (props.nearbyusers.length+1), longitude: long / (props.nearbyusers.length+1)};
        })();
    */
    //var meanlatitude =  props.user.userlocation.latitude;
    //var meanlongitude = props.user.userlocation.longitude;
    console.log(props.user.userlocation);
    var minlatitude, maxlatitude, minlongitude, maxlongitude;
    if (props.user.userlocation) {
        minlatitude = maxlatitude = props.user.userlocation.latitude;
        minlongitude = maxlongitude = props.user.userlocation.longitude;
        for(var i = 0; i < props.nearbyusers.length; i++) {
            minlatitude = Math.min(minlatitude, props.nearbyusers[i].location.latitude);
            maxlatitude = Math.max(maxlatitude, props.nearbyusers[i].location.latitude);
            minlongitude = Math.min(minlongitude, props.nearbyusers[i].location.longitude);
            maxlongitude = Math.max(maxlongitude, props.nearbyusers[i].location.longitude);
            //meanlatitude += props.nearbyusers[i].location.latitude;
            //meanlongitude += props.nearbyusers[i].location.longitude;
        }
    } else {
        minlatitude = maxlatitude = 37.78825;
        minlongitude = maxlongitude = -122.4324;
    }
    console.log(minlatitude+" "+maxlatitude);
    console.log(minlongitude+" "+maxlongitude);
    //meanlatitude /= (props.nearbyusers.length+1);
    //meanlongitude /= (props.nearbyusers.length+1);
    //console.log("{meanlatitude: "+meanlatitude+", meanlongitude: "+meanlongitude);

    /*
    componentDidMount() {
        this.mapRef.fitToSuppliedMarkers(
            someArrayOfMarkers,
            false, // not animated
        );
    }
    */

    if (props.user.userlocation) {
        userlocationmarker =       
            <MapView.Marker coordinate={props.user.userlocation} pinColor='violet'>
                <Image source={require('../public/Images/mymapmarker.png')}
                backgroundColor='transparent'
                style={{height: 80, width:80 }} />
                <Text style={[styles.mymapmarkertext, {textAlign:'center'}]}>You</Text>
            </MapView.Marker>
    }
    const nearbyuserlocationmarkers = props.nearbyusers.map(nearbyuser => (
        <MapView.Marker coordinate={nearbyuser.location} key={nearbyuser.id} pinColor='teal'
        //onPress={() => call({number: nearbyuser.phone, prompt: false}).catch(console.error)}
        onPress={() => props.navigation.navigate('Profile', {username: nearbyuser.username})}
        >
            <Image source={require('../public/Images/mapmarker.png')}
                backgroundColor='transparent'
                style={{height: 50, width:50 }} />
            <Text style={[styles.mapmarkertext, {textAlign:'center'}]}>{"@"+nearbyuser.username}</Text>
        </MapView.Marker>
    ));
    return (
        <MapView
        /*
            initialRegion={{
                //latitude: 37.78825,
                //longitude: -122.4324,
                //latitude: props.user.userlocation.latitude,
                //longitude: props.user.userlocation.longitude,
                latitudeDelta: 0.0622,
                longitudeDelta: 0.0421
            }}
        */
            region={{
                latitude: (minlatitude + maxlatitude) / 2,
                longitude: (minlongitude + maxlongitude) / 2,
                //ideally i should set latitude/longitude Detla using search radius property
                //with and the latitude, longitude should be set to userlocation
                latitudeDelta: (maxlatitude - minlatitude) * 1.5,
                longitudeDelta: (maxlongitude - minlongitude) * 1.5,
                //props.user.userlocation
            }}
            style={styles.map}>
        {/*<UrlTile
            urlTemplate="http://dgssurfboards.com/wp-content/uploads/2018/06/grey-background.jpg"
            zIndex={-1}
        />*/}
            {userlocationmarker}
            {nearbyuserlocationmarkers}
        </MapView>
    );
};


export default UsersMap;

/*
the only picolors google allows are:

red (default)
tomato
orange
yellow
gold
wheat
tan
linen
green
blue / navy
aqua / teal / turquoise
violet / purple / plum
indigo

*/