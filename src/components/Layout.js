import React from 'react';
import {StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Layout = props => {
  const {children, layoutStyle} = props;

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle={'dark-content'} />
      <View style={[{flex: 1, backgroundColor: '#fff'}, layoutStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Layout;
