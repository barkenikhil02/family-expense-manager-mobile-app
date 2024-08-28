import * as React from 'react';
import { Alert, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { RESULTS } from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import { usePermissions, EPermissionTypes } from '../hooks/usePermissions';
import { goToSettings } from '../utils/helpers';

export default function QRCodeScanner() {
    const { hasPermission, requestPermission } = useCameraPermission();
    const { askPermissions } = usePermissions(EPermissionTypes.CAMERA);
    const [scannedValue, setScannedValue] = React.useState('');
    const [lineAnim] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        takePermissions();
        startLineAnimation();
    }, []);

    const takePermissions = async () => {
        askPermissions()
            .then((response: { type: string; }) => {
                // permission given for camera
                if (response.type === RESULTS.LIMITED || response.type === RESULTS.GRANTED) {

                }
            })
            .catch((error: { isError: any; errorMessage: any; type: string; }) => {
                if ('isError' in error && error.isError) {
                    Alert.alert(
                        error.errorMessage || 'Something went wrong while taking camera permission',
                    );
                }
                if ('type' in error) {
                    if (error.type === RESULTS.UNAVAILABLE) {
                        Alert.alert('This feature is not supported on this device');
                    } else if (error.type === RESULTS.BLOCKED || error.type === RESULTS.DENIED) {
                        Alert.alert(
                            'Permission Denied',
                            'Please give permission from settings to continue using camera.',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                { text: 'Go To Settings', onPress: () => goToSettings() },
                            ],
                        );
                    }
                }
            });
    };

    const startLineAnimation = () => {
        lineAnim.setValue(0);
        Animated.loop(
            Animated.timing(lineAnim, {
                toValue: 1,
                duration: 1400,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const device = useCameraDevice('back');
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            setScannedValue(codes[0].value);
            console.log(`Scanned ${JSON.stringify(codes)} codes!`);
        }
    });

    if (device == null || device?.length === 0) return <Text style={{ color: '#000' }}>Loading devices...</Text>;
    if (!hasPermission) return <Text style={{ color: '#000' }}>No camera permission</Text>;
    if (device == null) return <Text style={{ color: '#000' }}>No camera device found</Text>;

    const lineTranslateY = lineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-150, 150] // Adjust based on the camera view height
    });

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
            <View style={styles.overlay}>
                <View style={styles.topOverlay} />
                <View style={styles.middleOverlay}>
                    <View style={styles.sideOverlay} />
                    <View style={styles.scanner}>
                        <Animated.View style={[styles.line, { transform: [{ translateY: lineTranslateY }] }]}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
                                style={styles.lineGradient}
                            />

                        </Animated.View>

                    </View>
                    <View style={styles.sideOverlay} />
                </View>
                <View style={styles.bottomOverlay} />
            </View>
            {scannedValue && <View style={styles.textView}>
                <Text style={styles.barcodeTextURL}>{scannedValue}</Text>
            </View>}

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
    },
    middleOverlay: {
        flexDirection: 'row',
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanner: {
        width: 300,
        height: 300,
        borderColor: '#fff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        width: '100%',
        height: 3,
    },
    lineGradient: {
        width: '100%',
        height: '100%',
    },
    bottomOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
    },
    barcodeTextURL: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    textView: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 50,
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 10,
        borderRadius: 5,
    },
});