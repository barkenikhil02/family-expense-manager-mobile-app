import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { showErrorToast, showSuccessToast } from '../../utils';
import { usersCollection } from '../../../App';
import { familyMembers, withdrawDepositFlag } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useForm, Controller } from 'react-hook-form';
import { HomeScreenFormType } from './types';
export default function HomeScreen() {
    const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm<HomeScreenFormType>({
        defaultValues: {
            amount: '',
            name: '',
            reason: '',
            withdrawDeposit: '',
        }
    });
    const [isFocus, setIsFocus] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState<string>();
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [withdrawDeposit, setWithdrawDeposit] = useState(''); // Assuming initial value is 0
    const isDarkMode = useColorScheme() === 'dark';
    const handleSaveData = async (submitData: HomeScreenFormType) => {
        setLoading(true);
        try {
            await usersCollection.add({
                name: submitData.name,
                amount: submitData.amount,
                reason: submitData.reason,
                time: new Date().toString(),
                withdrawDepositFlag: submitData.withdrawDeposit
            });
            showSuccessToast('Data added successfully');
            console.log('Data added successfully');
            // Reset input fields after saving data
            setValue('amount', '');
            setValue('name', '');
            setValue('reason', '');
            setValue('withdrawDeposit', '')
        } catch (error) {
            showErrorToast(`Error adding data: ${error}`);
            console.log(`Error adding data: ${error}`)
        }
        setLoading(false);
    };
    const renderItem = (item: any) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.name}</Text>

            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedText}
                        inputSearchStyle={styles.inputSearch}
                        iconStyle={styles.iconStyle}
                        data={familyMembers}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="value"
                        placeholder="Select User"
                        searchPlaceholder="Search..."
                        value={value}
                        onChange={item => {
                            onChange(item.value)
                        }}
                        renderItem={renderItem}
                    />
                )}
                name="name"
                rules={{ required: true }}
                defaultValue=""
            />
            {errors.name && <Text style={{ color: 'red' }}>This field is required.</Text>}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label="Amount"
                        value={value}
                        onChangeText={(text) => onChange(text)}
                        style={styles.input}
                        inputMode='numeric'
                    />)}
                name="amount"
                rules={{ required: true }}
                defaultValue=""
            />
            {errors.amount && <Text style={{ color: 'red' }}>This field is required.</Text>}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label="Reason"
                        value={value}
                        onChangeText={(text) => onChange(text)}
                        style={styles.input}
                    />)}
                name="reason"
                rules={{ required: true }}
                defaultValue=""
            />
            {errors.reason && <Text style={{ color: 'red' }}>This field is required.</Text>}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedText}
                        inputSearchStyle={styles.inputSearch}
                        iconStyle={styles.iconStyle}
                        data={withdrawDepositFlag}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="value"
                        placeholder="Select Expense Type"
                        searchPlaceholder="Search..."
                        value={value}
                        onChange={item => {
                            onChange(item.value)
                        }}
                        renderItem={renderItem}
                    />
                )}
                name="withdrawDeposit"
                rules={{ required: true }}
                defaultValue=""
            />
            {errors.withdrawDeposit && <Text style={{ color: 'red' }}>This field is required.</Text>}

            <Button disabled={loading} mode="contained" onPress={handleSubmit(handleSaveData)} style={styles.button}>
                Save
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        margin: 10,
        color: 'black'
    },
    button: {
        margin: 10,
    },
    dropdown: {
        paddingHorizontal: '3%',
        height: 50,
        borderColor: '#949494',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        color: '#000',
        width: '98%',
        alignSelf: 'center',
        backgroundColor: '#FFF',
    },
    item: {
        paddingHorizontal: 17,
        paddingVertical: 10,
        // borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        color: 'blacl'
    },
    textItem: {
        flex: 1,
        fontSize: 16,
        color: 'black'
    },
    icon: {
        marginRight: 5,
    },
    label: {
        fontSize: 16,
        color: '#000',
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#000',
    },
    selectedText: {
        fontSize: 16,
        color: '#000',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearch: {
        height: 40,
        fontSize: 16,
        color: '#000',
    },
})