import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/homeScreen';
import ReportScreen from '../screens/reportScreen';
import { AppToast } from '../components/Toast';
import QRCodeScanner from '../components/QRCodeScanner';
import CustomListComponent from '../components/CustomListComponent';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ReportStack = createStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Home" component={CustomListComponent} />
    </HomeStack.Navigator>
);
const ReportStackScreen = () => (
    <ReportStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Report" component={QRCodeScanner} />
    </ReportStack.Navigator>
);

const MainTabScreen = () => (
    <>
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: '#B69377',
                tabBarInactiveTintColor: '#858585',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                },
                tabBarLabelStyle: {
                    fontSize: 15,
                    fontWeight: 'bold',
                },
            }}
        >
            <Tab.Screen
                name="HomeScreen"
                component={HomeStackScreen}
                options={{
                    title: 'List',
                    tabBarIcon: ({ color, focused }) => (
                        // <Animatable.View duration={2000} iterationDelay={5000} useNativeDriver animation={focused ? "tada" : ''} iterationCount={focused ? 'infinite' : ''}>
                        <Icon name="home" size={24} color={color} />
                        // </Animatable.View>
                    ),
                    headerShown: false, // Hide the header for this screen
                }}
            />
            <Tab.Screen
                name="Report"
                component={ReportStackScreen}
                options={{
                    title: 'Qr',
                    tabBarIcon: ({ color, focused }) => (
                        // <Animatable.View duration={2000} iterationDelay={5000} useNativeDriver animation={focused ? "tada" : ''} iterationCount={focused ? 'infinite' : ''}>
                        <Icon name="home" size={24} color={color} />
                        // </Animatable.View>
                    ),
                    headerShown: false, // Hide the header for this screen
                }}
            />
        </Tab.Navigator>
        <AppToast />
    </>
);

export default MainTabScreen;
