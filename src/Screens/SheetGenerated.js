
import React, { useCallback, useEffect, useState } from 'react';
import { Box, VStack, Center, Heading, Text, HStack, Button, Icon } from 'native-base'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { addElectrionUrn } from '../Core/Services';

function SheetGenerated(props) {

    const navigator = useNavigation()


    return (<Box h='100%'>
        <VStack justifyContent={'space-between'} h={'full'}>
            <Center flex={'1'}>
                <Heading mt={'10'} size={'md'} textTransform={'uppercase'}>GERADOR DE PLANILHA DE PLEITO</Heading>
                <Box my={'10'}>
                    <Icon
                        size={120}
                        as={MCIcons}
                        name="google-spreadsheet"
                        color="coolGray.800"
                    />
                </Box>
            </Center>
            <Center flex='1'>
                <Center flex='1'>
                    <Icon
                        size="xl"
                        as={MCIcons}
                        name="check-bold"
                        color="green.600"
                    />
                    <Text mt='5' fontSize={'xl'} textAlign={'center'}>PLANILHA GERADA COM SUCESSO!</Text>
                    <Text mt='2' textAlign={'center'}>Você pode encontrar a planilha na pasta Qrvoto dentro da pasta downloads. Downlaods {'->'} Qrvoto.</Text>
                </Center>
                <HStack mb='10'>
                    <HStack>
                        <Button
                            onPress={(ev) => {
                                navigator.goBack();
                            }}>
                            Retornar
                        </Button>
                    </HStack>
                </HStack>
            </Center>
        </VStack>
    </Box>)
}

export default SheetGenerated