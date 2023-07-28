import React from 'react';
import { Center, Spinner, Box, Heading} from 'native-base';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function SplashScreen() {

    return (<Center w="100%" h="100%">
        <Box>
            <Center>
                <MCIcons name="qrcode-scan" size={80} />
            </Center>
            <Heading
                m="5"
                size="lg"
                fontWeight="600"
                color="coolGray.500"
                _dark={{
                    color: 'warmGray.50',
                }}
            >
                QR Voto
            </Heading>
            <Center my="10">
                <Spinner size="md" color="coolGray.500"/>
            </Center>
        </Box>
    </Center>)

}

export default SplashScreen