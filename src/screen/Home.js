import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  ToastAndroid,
} from 'react-native';
import Layout from '../components/Layout';
import {BASE_URL} from '../utils/APIConstant';
import WebView from 'react-native-webview';
import Loading from '../components/Loading';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import messaging from '@react-native-firebase/messaging';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
var RNFetchBlob = require('rn-fetch-blob').default;

const Home = props => {
  //props
  const {navigation} = props;

  //선언
  const mainURL = 'cnj0002.cafe24.com';
  const app_domain = BASE_URL;
  let pwChgPop = false;
  let canGoBack = false;
  let timeOut;

  //ref
  const webViewRef = useRef();

  //useState
  const [url, setUrl] = useState(app_domain + '/mobile/');
  const [urls, set_urls] = useState('ss');
  const [tokenValue, setTokenValue] = useState(''); //앱 토큰

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', enabled, authStatus);
    }
  }

  //앱 토큰 가져오기
  const getToken = async () => {
    const token = await messaging().getToken();

    setTokenValue(token);
  };

  //앱 실행시
  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  //웹에서 postMessage 받기
  const onWebViewMessage = webViews => {
    let jsonData = JSON.parse(webViews.nativeEvent.data);

    console.log(jsonData);

    if (jsonData.mode == 'imgZoom') {
      navigation.navigate('ImageZoom', {url: jsonData.data?.content});
    }

    if (jsonData.mode == 'replace_main') {
      console.log('replace_main', app_domain + jsonData?.url);
      let url = app_domain + jsonData?.url;
      setUrl(url);
    }
  };

  //url 변화 감지
  const onNavigationStateChange = webViewState => {
    set_urls(webViewState.url);

    console.log('webViewState.url:::', webViewState.url);
    pwChgPop = false;

    // const chkAppData = JSON.stringify({
    //   type: 'chk_app_token',
    //   isapp: 'Y',
    //   istoken: tokenValue == '' ? '' : tokenValue,
    // });

    //웹에 토큰 전달
    const chkAppData = JSON.stringify({
      mode: 'firebaseToken',
      data: tokenValue == '' ? '' : tokenValue,
    });

    console.log('chkAppData:::', chkAppData);

    webViewRef.current.postMessage(chkAppData);
  };

  //로딩 완료 후
  const onShouldStartLoadWithRequest = event => {
    // console.log(event);

    //mainURL이 포함되지 않는다면 새창으로 열기 target blank 대처
    if (
      event.url.startsWith('http://') ||
      event.url.startsWith('https://') ||
      event.url.startsWith('about:blank')
    ) {
      if (Platform.OS === 'ios') {
        if (!event.mainDocumentURL.includes(mainURL)) {
          Linking.openURL(event.mainDocumentURL);
          return false;
        }

        return true;
      } else {
        if (!event.url.includes(mainURL)) {
          Linking.openURL(event.url);
          return false;
        }
        return true;
      }
    }
  };

  //Webview 뒤로가기
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        const app_split = urls.split('?')[0];

        if (pwChgPop) {
          const popOffData = JSON.stringify({
            type: 'popOff',
            popId: 'pw_chg_pop',
          });
          webViewRef.current.postMessage(popOffData);
        } else {
          if (
            app_split == app_domain + '/' ||
            app_split == app_domain + '/mobile/' ||
            app_split == app_domain + '/mobile/job/' ||
            app_split == app_domain + '/mobile/blog/blog_main.php' ||
            app_split == app_domain + '/mobile/mypage/mypage_main.php' ||
            app_split == app_domain + '/index.php' ||
            app_split == app_domain + '/bbs/login.php' ||
            urls == app_domain + '/' ||
            urls == app_domain + '/index.php' ||
            urls == app_domain + '/bbs/login.php'
          ) {
            if (!canGoBack) {
              ToastAndroid.show(
                '한번 더 누르면 종료합니다.',
                ToastAndroid.SHORT,
              );
              canGoBack = true;
              timeOut = setTimeout(function () {
                canGoBack = false;
              }, 2000);
            } else {
              clearTimeout(timeOut);
              BackHandler.exitApp();
              canGoBack = false;
              //const sendData =JSON.stringify({ type:"종료" });
            }
          } else {
            webViewRef.current.goBack();
          }
        }
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [urls]),
  );

  useEffect(() => {
    messaging().onMessage(remoteMessage => {
      Toast.show({
        type: 'info', //success | error | info
        position: 'top',
        text1: remoteMessage.notification.title,
        text2: remoteMessage.notification.body,
        visibilityTime: 3000,
        // autoHide: remoteMessage.data.intent === 'SellerReg' ? false : true,    // true | false
        topOffset: Platform.OS === 'ios' ? 40 + getStatusBarHeight() : 20,
        style: {backgroundColor: 'red'},
        bottomOffset: 100,
        onShow: () => {},
        onHide: () => {},
        onPress: () => {
          console.log('실행중 메시지 눌렀을 때::::', remoteMessage.data);

          if (remoteMessage.data.webScreen !== '') {
          }
        },
      });
      console.log('실행중 메시지:::', remoteMessage);

      // webViewRef.current?.reload();
    });

    // 포그라운드
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('포그라운드', remoteMessage);
      if (
        remoteMessage.data?.screen != null &&
        remoteMessage.data?.screen != '' &&
        remoteMessage.data?.idx != null &&
        remoteMessage.data?.idx != ''
      ) {
        // 판매자 등록
        if (remoteMessage.data.webScreen !== '') {
          console.log('포그라운드33', remoteMessage);
        }
      }
    });

    // 백그라운드
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('백그라운드::::', remoteMessage);
        if (remoteMessage != null) {
          if (
            remoteMessage.data?.screen != null &&
            remoteMessage.data?.screen != '' &&
            remoteMessage.data?.idx != null &&
            remoteMessage.data?.idx != ''
          ) {
            // 푸시 이동
            if (remoteMessage.data.webScreen !== '') {
              console.log('포그라운드33', remoteMessage);
            }
          }
        }
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);

  return (
    <Layout>
      <WebView
        ref={webViewRef}
        originWhitelist={['https://*', 'http://*']}
        textZoom={100}
        source={{uri: url}}
        showsVerticalScrollIndicator={false}
        startInLoadingState={true}
        javaScriptEnabled={true}
        renderLoading={() => <Loading />}
        onMessage={webViews => onWebViewMessage(webViews)}
        onNavigationStateChange={webViews => onNavigationStateChange(webViews)}
        onShouldStartLoadWithRequest={
          webview => onShouldStartLoadWithRequest(webview)
          //console.log('webview intent::', webview)
        }
        onContentProcessDidTerminate={() => {
          webViewRef.current?.reload();
        }}
      />
    </Layout>
  );
};

export default Home;
