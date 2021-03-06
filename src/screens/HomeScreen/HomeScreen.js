import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Button } from 'react-native';
import { Container, Header, Title, Left, Right, Body, Icon, Item, Label, Input } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import VideoPlayer from 'react-native-video-player';
import Video from 'react-native-video'
import { Configuration } from '../../Configuration';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { setFavoriteItems } from '../../Core/favorites/redux';
import DynamicAppStyles from '../../DynamicAppStyles';
import ListingAppConfig from '../../ListingAppConfig';
import dynamicStyles from './styles';
import TNActivityIndicator from '../../Core/truly-native/TNActivityIndicator';

const { width } = Dimensions.get('window');

// const video = require('../../assets/lights.mp4')

// const url = require('../../assets/lights.mp4')

function HomeScreen() {

    return (
        <Container>
            <View style={styles.container}>
                <View style={{ position: 'relative' }}>
                    <Image style={{ width: wp('100%'), height: hp('30%'), }} source={{ uri: "https://media.pitchfork.com/photos/5b60c32dc50e6c2e339b99fe/1:1/w_600/Travis%20Scott_Astroworld.jpg" }} />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.floating}
                        onPress={() => {
                        }}
                    >
                        <Ionicons style={{ color: '#fff' }} name={'play'} size={45}></Ionicons>
                    </TouchableOpacity>
                </View>
                <View style={styles.itemCon}>
                    <View style={styles.player}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons style={{ color: '#fff' }} name={'chevron-forward'} size={15} />
                            <Text style={{ color: '#fff' }}>Music Video Drops on July 4</Text>
                        </View>
                        <Text style={{ color: '#fff' }}>26 min</Text>
                    </View>
                    <View style={styles.recCon}>
                        <View style={styles.topCon}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.rec}
                                onPress={() => {
                                }}>
                                <ImageBackground style={{ borderRadius: 10, width: 150, height: 150, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} source={{ uri: "https://s.france24.com/media/display/d1676b6c-0770-11e9-8595-005056a964fe/w:1400/p:16x9/news_1920x1080.webp" }}>
                                    <Text style={{ color: '#fff', marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>NEWS</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.rec}
                                onPress={() => {
                                }}>
                                <ImageBackground style={{ borderRadius: 10, width: 150, height: 150, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} source={{ uri: "https://s.france24.com/media/display/d1676b6c-0770-11e9-8595-005056a964fe/w:1400/p:16x9/news_1920x1080.webp" }}>
                                    <Text style={{ color: '#fff', marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>MALL</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.topCon}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.rec}
                                onPress={() => {
                                }}>
                                <ImageBackground style={{ borderRadius: 10, width: 150, height: 150, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} source={{ uri: "https://s.france24.com/media/display/d1676b6c-0770-11e9-8595-005056a964fe/w:1400/p:16x9/news_1920x1080.webp" }}>
                                    <Text style={{ color: '#fff', marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>COMMUNITY</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.rec}
                                onPress={() => {
                                }}>
                                <ImageBackground style={{ borderRadius: 10, width: 150, height: 150, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} source={{ uri: "https://s.france24.com/media/display/d1676b6c-0770-11e9-8595-005056a964fe/w:1400/p:16x9/news_1920x1080.webp" }}>
                                    <Text style={{ color: '#fff', marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>POLLS</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#000'
    },
    floating: {
        position: 'absolute',
        top: hp('10%'),
        left: wp('40%'),
        backgroundColor: '#edae2f',
        borderRadius: 35,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        // transform:translateX('50%')
        // top:hp('25%')
    },
    itemCon: {
        display: 'flex',
        flexDirection: 'column',
        // alignItems:'center',
        width: wp('80%'),
        // borderColor:'#f00',
        // borderWidth:2
    },
    player: {
        color: '#fff',
        backgroundColor: '#272727',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 15,
        borderRadius: 10,
        // justifyContent:'center',
        // borderWidth:2,
        // borderColor:'#fff',
    },
    recCon: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    topCon: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10
        // height:'50%'
    },
    rec: {
        borderRadius: 20,
        width: '45%',
        borderColor: '#fff',
        borderWidth: 2,
        overflow: 'hidden',
        opacity: 0.8
    }

});

// ...

export default HomeScreen;
