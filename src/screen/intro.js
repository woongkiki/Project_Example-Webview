import React, {useEffect} from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import {BASE_URL} from '../utils/APIConstant';
import {CALL_PERMISSIONS_NOTI, usePermissions} from '../hook/usePermissions';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import WebView from 'react-native-webview';

const Intro = props => {
  const {navigation} = props;

  usePermissions(CALL_PERMISSIONS_NOTI);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 2500);
  }, []);

  const webViewRef = React.useRef(null);

  return (
    <Layout>
      <WebView
        originWhitelist={['https://*', 'http://*']}
        textZoom={100}
        source={{uri: BASE_URL + '/mobile/main/intro.php'}}
        showsVerticalScrollIndicator={false}
        startInLoadingState={true}
        javaScriptEnabled={true}
        renderLoading={() => <Loading />}
        onContentProcessDidTerminate={() => {
          webViewRef.current?.reload();
        }}
      />
    </Layout>
  );
};

export default Intro;
