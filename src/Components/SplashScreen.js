import React from 'react';
import { Center, Spinner, Box, Heading, Text, Icon } from 'native-base';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RedCometLogo from './RedCometLogo';
import { Dimensions } from 'react-native';

function SplashScreen(props) {

    return (<Center w="100%" h="100%">
        <Box>
            <Center>
                <Icon
                    size={40}
                    as={MCIcons}
                    name="qrcode-scan"
                    color="coolGray.800"
                />
            </Center>
            <Heading textAlign={'center'}
                m="5"
                size="lg"
                fontWeight="600"
                color="coolGray.500"
                _dark={{
                    color: 'coolGray.50',
                }}
            >
                QR Voto
            </Heading>
            <Center my="10">
                <Spinner size={50} color="coolGray.500" />
                <Heading mt='3' textAlign={'center'}>{props && props.description}</Heading>
            </Center>
        </Box>
        <RedCometLogo />
    </Center>)

}

export default SplashScreen