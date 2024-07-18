import { StyleSheet, Text, View, ActivityIndicator, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { formatDate2, formatDateToString } from '../../service/dateServices/dates';
import { familyMembers } from '../../constants';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
const filterList = [{ name: 'All', value: '0' }, ...familyMembers];
const CustomButton = ({ onPress, selected, title, disabled }: any) => {
    return (
        <TouchableOpacity
            disabled={disabled ? disabled : false}
            style={[
                styles.button,
                {


                    borderColor: selected ? 'gold' : '#757575',
                    backgroundColor: selected ? 'black' : '#212121',
                }]}
            onPress={onPress}
        >
            <Text style={{ color: selected ? 'white' : '#757575' }}>{title}</Text>
        </TouchableOpacity>
    );
};
export default function ReportScreen() {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [users, setUsers] = useState([]); // Initial empty array of users
    const [selectedUsersinFilter, setSelectedUsersInFilter] = useState<any>(['0']);
    const [startDate, setStartDate] = useState(new Date(Moment().startOf('month').toDate()));
    const [endDate, setEndDate] = useState(new Date(Moment().endOf('month').toDate()));
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    useEffect(() => {
        const subscriber = firestore()
            .collection('BarkeFamily')
            .onSnapshot(querySnapshot => {
                const users: any = [];

                querySnapshot.forEach(documentSnapshot => {
                    const userNameObject = familyMembers.find(item => item.value === documentSnapshot.get('name'));
                    const userName = userNameObject ? userNameObject.name : null;
                    const timeString = documentSnapshot.get('time');
                    const time = new Date(timeString); // Convert Firestore Timestamp to Date

                    // Check if the document falls within the startDate and endDate range
                    if (time >= startDate && time <= endDate) {
                        users.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                            userName: userName
                        });
                    }
                });

                if (selectedUsersinFilter.includes('0')) {
                    setUsers(users);
                } else {
                    const temp = users.filter((item: any) => selectedUsersinFilter.includes(item.name));
                    setUsers(temp);
                }

                setLoading(false);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, [selectedUsersinFilter, startDate, endDate]);


    const handleStartDateChange = (date: Date) => {
        setStartDate(date);
        setShowStartDatePicker(false);
    };

    const handleEndDateChange = (date: Date) => {
        setEndDate(date);
        setShowEndDatePicker(false);
    };
    const selectFamilyMember = (key: string) => {
        let temp: any;
        if (key === '0') {
            temp = ['0'];
        } else if (selectedUsersinFilter.includes(key)) {
            // If the key is already in the array, remove it
            temp = selectedUsersinFilter.filter((item: string) => item !== key && item !== '0');
        } else {
            // If the key is not in the array, add it
            temp = selectedUsersinFilter.includes('0') ? [key] : [...selectedUsersinFilter, key];
        }
        if (temp.length === 0) {
            setSelectedUsersInFilter(['0']);
        } else {
            setSelectedUsersInFilter(temp);
        }
    };
    const renderDatePickers = () => {
        return (
            <View style={styles.datePickerContainer}>
                <TouchableOpacity
                    style={{ backgroundColor: 'grey', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 3, alignItems: 'center' }}
                    onPress={() => {
                        setShowStartDatePicker(true);
                    }}>
                    <Text style={styles.datePickerLabel}>Start Date: {formatDate2(startDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ backgroundColor: 'grey', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 3, alignItems: 'center' }}
                    onPress={() => setShowEndDatePicker(true)}>
                    <Text style={styles.datePickerLabel}>End Date: {formatDate2(endDate)}</Text>
                </TouchableOpacity>
            </View>
        );
    };
    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <ActivityIndicator />
            </View>
        )
    } else {
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: '1%' }}>
                        <View style={styles.buttonContainer}>
                            {/* < CustomButton selected={family} disabled={false} title={'Family'} onPress={() => { }} /> */}
                            {filterList?.map((item, index) => (
                                < CustomButton key={item?.value} selected={selectedUsersinFilter?.length == 0 ? selectedUsersinFilter?.[0]?.value == item?.value : selectedUsersinFilter.includes(item?.value?.toString())} title={item.name} onPress={() => {
                                    selectFamilyMember(item.value.toString())
                                }} />
                            ))}
                        </View>
                    </ScrollView>
                </View>
                {renderDatePickers()}
                {showStartDatePicker && <DatePicker
                    modal
                    date={startDate}
                    open={showStartDatePicker}
                    mode="date"
                    title={'Select Start Date'}
                    onConfirm={handleStartDateChange}
                    onCancel={() => setShowStartDatePicker(false)}
                    maximumDate={endDate}
                />}{showEndDatePicker && <DatePicker
                    modal
                    date={endDate}
                    open={showEndDatePicker}
                    mode="date"
                    onConfirm={handleEndDateChange}
                    onCancel={() => setShowEndDatePicker(false)}
                    title={'Select End date'}
                    minimumDate={startDate}
                />}
                {users.length > 0 ? <FlatList
                    data={users}
                    style={{ padding: '2%' }}
                    renderItem={({ item }: any) => (
                        <View style={{
                            padding: '2%', borderWidth: 1, borderRadius: 8, marginVertical: 5, borderStyle: 'dashed'
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                                <Text style={[styles.textStyle, { fontSize: 18, fontWeight: '500' }]}>Name: {item?.name}</Text>
                                <Text style={[styles.textStyle, { fontSize: 18, fontWeight: '500', color: item?.withdrawDepositFlag === '0' ? 'red' : 'green' }]}>Amount: {item?.amount}</Text>
                            </View>
                            <Text style={styles.textStyle}>Date: {formatDate2(new Date(item?.time))}</Text>
                            <Text style={styles.textStyle}>Description: {item?.reason}</Text>
                        </View>
                    )
                    }
                /> :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={styles.textStyle}>No data</Text>
                    </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 16,
        marginHorizontal: 6,
        paddingVertical: 5,
        borderRadius: 36,
        borderWidth: 0.5,
        elevation: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonContainer: {
        flexDirection: 'row',
        // marginVertical: 5,
        paddingVertical: 5,
        // marginTop: 5,
        // paddingBottom: 5,
        marginRight: 16,
    },
    textStyle: {
        color: 'black'
    },
    datePickerContainer: {
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    datePickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
})