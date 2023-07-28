import { Text, Icon, Container, HStack, Button, Box } from 'native-base';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

export default function QrScanner() {
  const navigation = useNavigation();
  const [flash, setFlash] = useState(false);
  const [cameraPermission, setCameraPermission] = useState();

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  useEffect(() => {
    if (devices) console.log(devices);
  }, [devices]);

  if (device == null) return <Text>Loading</Text>;
  return (
    <Box w="100%" h="100%">
      <Camera
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      {barcodes.map((barcode, idx) => (
        <Text key={idx} style={styles.barcodeTextURL}>
          {barcode.displayValue}
        </Text>
      ))}
    </Box>
  );
}
const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
