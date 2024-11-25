import {View, Text, Button} from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import {router, useRouter} from 'expo-router'

const index=()=>{
    const Router = useRouter();
    return (
        <ScreenWrapper>
         <View>
        <Text>index</Text>
        <Button title='Add' onPress={()=>router.push('Queries')}>

        </Button>
        </View>

        </ScreenWrapper>
       
    )
}
export default index