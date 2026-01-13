import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const Loading = props => {
  const {navigation} = props;

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ActivityIndicator size={'large'} color={'#333'} />
    </View>
  );
};

export default Loading;
