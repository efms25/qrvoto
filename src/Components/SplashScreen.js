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
                    name={props && props.icon ? props.icon : "qrcode-scan"}
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
                {!props || (props && !props.stop) &&<Spinner size={50} color="coolGray.500" />}
                <Heading mt='3' textAlign={'center'}>{props && props.description}</Heading>
                <Text textAlign={'center'} mt='2'>{props && props.info}</Text>
            </Center>
        </Box>
        <RedCometLogo />
    </Center>)

}

export default SplashScreen