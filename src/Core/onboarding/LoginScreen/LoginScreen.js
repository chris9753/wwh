import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Left, Right, Body, Icon, Item, Label, Input } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { connect } from 'react-redux';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import { localizedErrorMessage } from '../utils/ErrorCode';




const LoginScreen = (props) => {
    const [pwdView, setPwdView] = useState(true);
    const appConfig = props.route.params.appConfig;
    const authManager = props.route.params.authManager;

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const appStyles = props.route.params.appStyles;
    const colorScheme = useColorScheme();
    // const styles = dynamicStyles(appStyles, colorScheme);

    const setPasswordView = () => {
        setPwdView(!pwdView);
    }

    const onPressLogin = () => {
        setLoading(true);
        authManager
            .loginWithEmailAndPassword(
                email && email.trim(),
                password && password.trim(),
                appConfig,
            )
            .then((response) => {
                if (response?.user) {
                    const user = response.user;
                    props.setUserData({
                        user: response.user,
                    });
                    Keyboard.dismiss();
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainStack', params: { user: user } }],
                    });
                } else {
                    setLoading(false);
                    Alert.alert(
                        '',
                        localizedErrorMessage(response.error),
                        [{ text: IMLocalized('OK') }],
                        {
                            cancelable: false,
                        },
                    );
                }
            });
    };

    const onForgotPassword = async () => {
        props.navigation.push('ResetPassword', {
            isResetPassword: true,
            appStyles,
            appConfig,
        });
    };
    return (
        <Container>
            <KeyboardAwareScrollView
                // keyboardShouldPersistTaps="always"
                style={styles.container}
                contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: 'column', flex: 1 }}
            >
                <TouchableOpacity
                    style={{ alignSelf: 'flex-start' }}
                    onPress={() => props.navigation.goBack()}>
                    <Image
                        style={appStyles.styleSet.backArrowStyle}
                        source={appStyles.iconSet.backArrow}
                    />
                </TouchableOpacity>
                <View style={styles.logoView}>
                    <Image style={styles.logoImage} source={appStyles.iconSet.logo} />
                </View>
                <View style={styles.formGroup}>
                    <View>
                        <Text style={{ color: '#9f959e' }}>Email</Text>
                        <Item success={false} style={{ display: "flex" }}>
                            <Icon name={'mail-outline'} style={{ color: "#fff" }} />
                            <Input style={{ color: "#fff" }}
                                placeholder={IMLocalized('E-mail')}
                                keyboardType='email-address'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                        </Item>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <View style={styles.labelGroup}>
                            <Text style={{ color: '#9f959e' }}>Password</Text>
                            <TouchableOpacity>
                                <Text style={{ color: '#eead2d' }} onPress={() => { onForgotPassword() }}>Forgot Password?</Text>
                            </TouchableOpacity>

                        </View>
                        <Item success={false} style={{ display: "flex" }}>
                            <Icon name={'lock-closed-outline'} style={{ color: "#eead2d" }} />
                            <Input style={{ color: "#fff" }} secureTextEntry={pwdView}
                                placeholderTextColor="#aaaaaa"
                                secureTextEntry
                                placeholder={IMLocalized('Password')}
                                onChangeText={(text) => setPassword(text)}
                                value={password}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                            <Icon onPress={setPasswordView} name={pwdView ? 'eye-outline' : 'eye-off-outline'} style={{ color: "#fff" }} />
                        </Item>
                    </View>
                    <View style={styles.thirdGr}>
                        <View style={styles.iconSet}>
                            <View style={styles.oneIcon}>
                                <Fontisto name={'facebook'} style={{ color: '#fff' }} size={15} />
                            </View>
                            <View style={styles.oneIcon}>
                                <Fontisto name={'google'} style={{ color: '#fff' }} size={15} />
                            </View>
                            <View style={styles.oneIcon}>
                                <Fontisto name={'instagram'} style={{ color: '#fff' }} size={15} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.loginButton} onPress={() => onPressLogin()}>
                            <Text style={{ fontWeight: 'bold' }}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.emptyBottom}>
                    <Text style={{ color: '#fff' }}>Don't have an account? Signup here</Text>
                    <Text style={{ color: '#fff', fontSize: 8 }}>Powered by THE WWHNG</Text>
                </View>
            </KeyboardAwareScrollView>
        </Container>
    );

};

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#000',
        flex: 1, width: '100%'
    },
    logoView: {
        alignSelf: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: '#fff',
        height: hp('30%'),
    },
    logoImage: {
        width: 200,
        height: 200
    },
    formGroup: {
        alignSelf: 'center',
        justifyContent: 'center',
        // alignItems:'flex-end',
        width: '90%',
        height: hp('35%'),
        // borderWidth: 1,
        // borderColor: '#fff',
    },
    emptyBottom: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#f00',
        height: hp('30%'),
    },
    labelGroup: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 0.1,
        // borderColor: '#f00',
        color: '#fff'
    },
    thirdGr: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 1,
        // borderColor: '#f00',
        height: '30%',
        alignItems: 'center'
        // paddingTop: 20
    },
    iconSet: {
        display: 'flex',
        flexDirection: 'row'
    },
    oneIcon: {
        width: wp('8%'),
        height: wp('8%'),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#262626',
        borderRadius: 3,
        marginRight: 5
    },
    loginButton: {
        width: 100,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#eead2d'
    }

});

// ...

export default connect(null, {
    setUserData,
})(LoginScreen);
