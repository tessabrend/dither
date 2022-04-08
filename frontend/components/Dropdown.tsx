import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { MultiSelect } from 'react-native-element-dropdown';

export default function Dropdown(props: any) {
    const dropdownContent = [
        { label: 'African', value: 'African' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Fast Food', value: 'Fast Food' },
        { label: 'Indian', value: 'Indian' },
        { label: 'Italian', value: 'Italian' },
        { label: 'Japanese', value: 'Japanese' },
        { label: 'Mexican', value: 'Mexican' },
        { label: 'Middle Eastern', value: 'Middle Eastern' },
        { label: 'Pub', value: 'Pub' },
        { label: 'South American', value: 'South American' }
    ];
    const {selection, updateSelection} = props;  
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
          updateSelection(item.slice(-1)[0])
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
  