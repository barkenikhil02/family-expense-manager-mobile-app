import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const SwipeableItem = ({ item, onDelete }: { item: any, onDelete: any }) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const handleGesture = Animated.event([{ nativeEvent: { translationX: translateX } }], { useNativeDriver: true });

    const handleStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationX < -100 || event.nativeEvent.translationX > 100) {
                Animated.timing(translateX, {
                    toValue: event.nativeEvent.translationX < -100 ? -1000 : 1000,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => onDelete(item.id));
            } else {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={handleGesture}
            onHandlerStateChange={handleStateChange}
        >
            <Animated.View style={[styles.listItemContainer, { transform: [{ translateX }] }]}>
                <Text style={styles.listItemText}>{item.name}</Text>
            </Animated.View>
        </PanGestureHandler>
    );
};

const CustomListComponent = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const result = await response.json();
            setData(result);
            setFilteredData(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (id: any) => {
        const updatedData = data.filter((item: any) => item.id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
    };

    const handleSearch = (text: any) => {
        setSearchText(text);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const filtered = data.filter((item: any) => item.name.toLowerCase().includes(text.toLowerCase()));
            setFilteredData(filtered);
        }, 500);
    };

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search..."
                onChangeText={(text) => { handleSearch(text) }}
                value={searchText}
                lightTheme
                round
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={styles.searchBarInput}
            />
            <FlatList
                data={filteredData}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item }) => (
                    <SwipeableItem item={item} onDelete={handleDelete} />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    searchBarContainer: {
        backgroundColor: '#fff',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    searchBarInput: {
        backgroundColor: '#e9e9e9',
    },
    listContent: {
        paddingBottom: 10,
    },
    listItemContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemText: {
        fontSize: 18,
        color: '#000'
    },
});

export default CustomListComponent;
