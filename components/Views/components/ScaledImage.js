import React, { Component } from "react";
import { Dimensions } from "react-native";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

export default class YourFastImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calcImgHeight: 0,
    };
  }

  render() {
    const { calcImgHeight } = this.state;
    return (
      <FastImage
        style={{ width: width, height: calcImgHeight }}
        source={{
          uri: this.props.uri,
        }}
        resizeMode={FastImage.resizeMode.contain}
        onLoad={evt =>
          this.setState({
            calcImgHeight:
              evt.nativeEvent.height / evt.nativeEvent.width * width, // By this, you keep the image ratio
          })}
      />
    );
  }
}