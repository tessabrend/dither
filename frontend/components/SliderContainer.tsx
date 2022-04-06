import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { Slider } from '@miblanchard/react-native-slider';

//caption: string, unit: string, children: React.ReactChildren sliderValue?: Array<number>
export default function SliderContainer(props: any) {
    const { caption, unit, children, sliderValue } = props;
    const [value, setValue] = React.useState(sliderValue ? sliderValue : 5);
    const renderSlide = () => {
      return React.Children.map(children, (child: React.ReactElement) => {
        if (!!child && child.type === Slider) {
          return React.cloneElement(child, {
            onValueChange: setValue,
            value,
          });
        }
        return child;
      });
    };
    return (
    <>
      <View style={styles.labelWrapper}>
        <Text style={styles.label}>{caption}</Text>
        <Text style={styles.label}>{Array.isArray(value) ? value.join(" - ") : value}</Text>
        <Text style={styles.label}>{unit}</Text>
      </View>
      <View style={styles.elementWrapper}>
        {renderSlide()}
      </View>
    </>
    );
}

const styles = StyleSheet.create({
    labelWrapper: {
        width: "100%",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "flex-start",
        alignContent: "center",
        paddingHorizontal: "4%",
        paddingTop: "2%",
    },
    label: {
        textAlign: "left",
        fontSize: 22,
    },
    elementWrapper: {
        width: "80%",
        flex: 1,
        marginLeft: "1%",
        marginRight: "1%",
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: "center",
    }
});