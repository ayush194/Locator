/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './views/loginscreen';
import SignupScreen from './views/signupscreen';
import ForgotpasswordScreen from './views/forgotpasswordscreen';
//import RedirectScreen from './views/redirectscreen';
import HomeScreen from './views/homescreen';
import SearchuserScreen from './views/searchuserscreen';
import ProfileScreen from './views/profilescreen';

const MainNavigator = createStackNavigator(
	{
		Login: {screen: LoginScreen},
		Signup: {screen: SignupScreen},
		Forgotpassword : {screen: ForgotpasswordScreen},
		//Redirect: {screen: RedirectScreen},
		Home: {screen: HomeScreen},
		Searchuser: {screen: SearchuserScreen},
		Profile: {screen: ProfileScreen},
	}, {
    	initialRouteName: 'Login',
  	}
);
  
const App = createAppContainer(MainNavigator);

export default App;
