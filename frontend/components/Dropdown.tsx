import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { MultiSelect } from 'react-native-element-dropdown';

export default function Dropdown() {
    const dropdownContent = [
        { label: 'African', value: '1' },
        { label: 'Chinese', value: '2' },
        { label: 'Fast Food', value: '3' },
        { label: 'Indian', value: '4' },
        { label: 'Italian', value: '5' },
        { label: 'Japanese', value: '6' },
        { label: 'Mexican', value: '7' },
        { label: 'Middle Eastern', value: '8' },
        { label: 'Pub', value: '9' },
        { label: 'South American', value: '10' }
    ];
      
    const [selected, setSelected] = useState([]);
    
    return (
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.detailText}
        selectedTextStyle={styles.detailText}
        inputSearchStyle={styles.inputSearchStyle}
        search
        data={dropdownContent}
        labelField="label"
        valueField="value"
        placeholder="Select..."
        searchPlaceholder="Search..."
        value={selected}
        onChange={item => {
          setSelected(item);
        }}
        selectedStyle={styles.selectedStyle}
        />
    );
}

const styles = StyleSheet.create({
    detailText: {
        textAlign: "center",
        fontSize: 20,
        justifyContent: "space-around"
      },
      dropdown: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 18,
      },
      selectedStyle: {
        borderRadius: 12,
      },    
});
  