import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
	white: {
		color: '#ffffff',
	},
	appcolor: {
		color: '#aefaef'
	},
	appbgcolor: {
		backgroundColor: '#aefaef',
	},
	appbordercolor: {
		borderColor: '#aefaef'
	},
	black: {
		color: '#000000',
	},
	bgblack: {
		backgroundColor: '#000000',
	},
	header: {
		fontFamily: 'TimesNewRoman',
		fontSize: 50,
		fontWeight: 'bold',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textinput: {
		margin: 20,
		width: 250,
		borderWidth: 1,
		borderRadius: 100,
		shadowColor: '#ffffff',
		shadowOffset: {height: 100, width: 100,},
		borderColor: '#aefaef',
	},
	loginbutton: {
		margin: 30,
		alignItems: 'center',
    	backgroundColor: '#aefaef',
    	padding: 15,
		width: 250,
		borderWidth: 1,
		borderRadius: 100,
	},
	roundbutton: {
		elevation: 5,
		width:60,
		height: 60,
		alignItems: "center",
		backgroundColor: 'rgb(0, 0, 0)',
		//padding: 20,
		borderRadius: 100,
	},
	smallroundbutton: {
		elevation: 5,
		width: 50,
		height: 50,
		alignItems: "center",
		backgroundColor: 'rgb(0, 0, 0)',
		//padding: 20,
		borderRadius: 100,
	},
	mymapmarkertext: {
        margin: 5,
        fontWeight: "bold",
        fontSize: 15,
    },
    mapmarkertext: {
        margin: 2,
        fontWeight: "bold",
        fontSize: 12,
    },
    mapContainer: {
        width: "100%",
        height: 200,
        marginTop: 20
    },
    map: {
        width: "100%",
        height: "100%"
	},
	scrollView: {
		marginHorizontal: 20,
	},
})

export default styles;