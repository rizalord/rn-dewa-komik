import 'react-native-gesture-handler'
import React from 'react';
import {View , Text , StyleSheet} from 'react-native';
import Routes from './components/systems/routers';

const Application = Routes();

class App extends React.Component{

  render(){
    return <Application />
  }
}

export default App;
