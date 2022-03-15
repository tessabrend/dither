import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, Touchable, TouchableOpacity, } from "react-native";
import { Slider } from '@miblanchard/react-native-slider';
import { MultiSelect } from 'react-native-element-dropdown';
import Colors from '../constants/Colors';
import { Text, View } from './Themed';

export interface GroupMembers {
  id: string;
  name: string;
}

const DATA: GroupMembers[] = [
  {
    id: "bd7acbea",
    name: "David",
  },
  {
    id: "63tiy0iu",
    name: "Anemmeabasi",
  },
  {
    id: "sd9a7654",
    name: "Wil",
  },
];

const dropdownContent = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

enum dineType {
  Delivery,
  PickUp,
  DineIn,
}

const Item = ({ data }: { data: GroupMembers }) => (
  <Pressable 
    onPress={() => {
  }} 
    style={styles.groupMember}>
    <Text style={styles.name}>{data.name.charAt(0)}</Text>
  </Pressable>
); 

const renderItem: ListRenderItem<GroupMembers> = ({ item }) => (
  <Item 
    data={item} 
  />
);

const dineTypeChoice = (_dineType: dineType) => {
  console.log('pressed');
};

const SliderContainer = (props: {
  caption: string,
  unit: string,
  children: React.ReactElement,
  sliderValue?: Array<number>,
}) => {
  const { caption, unit, sliderValue } = props;
  const [value, setValue] = React.useState(
    sliderValue ? sliderValue : 5
  );
  const renderSlide = () => {
    return React.Children.map(props.children, (child: React.ReactElement) => {
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

const DropdownComponent = () => {
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
      placeholder="Select item"
      searchPlaceholder="Search..."
      value={selected}
      onChange={item => {
        setSelected(item);
      }}
      selectedStyle={styles.selectedStyle}
      />
  );
};

const RatingComponent = () => {
  const [rating, setRating] = useState<any | null>(null);
    return(
      <View style={{flexDirection: "row"}}>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <View>
            <Pressable
              key={i}
              onPress={() => setRating(ratingValue)}
            >
            <FontAwesomeIcon
              icon="star"
              color={ratingValue <= (rating) ? "#ffc107" : "#e4e5e9"}
              size={30} />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default function GroupDetails() {
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(false);

  const leader: GroupMembers[] = [  {
    id: "456ghjjh",
    name: "Leader",
  },]

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.membersWrapper}>
        <FlatList 
          horizontal
          data={leader.concat(DATA)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        />
      </View>
      <View style={styles.buttonRow}>
        <Pressable 
            onPress={() => dineTypeChoice(dineType.Delivery)}
            onLongPress={() => setSelected(!selected)}
            style={[{ borderWidth: selected ? 2 : 1 }, styles.buttonCard] }
          >
          <Text style={styles.detailText}>DELIVERY</Text>
        </Pressable>
        <Pressable 
            onPress={() => setSelected(!selected)}
            style={[{ borderWidth: selected ? 2 : 1 }, styles.buttonCard] }
          >
          <Text style={styles.detailText}>PICK UP</Text>
        </Pressable>
        <Pressable 
            onPress={() => setSelected(!selected)}
            style={[{ borderWidth: selected ? 2 : 1 }, styles.buttonCard] }
          >
          <Text style={styles.detailText}>DINE IN</Text>
        </Pressable>
      </View>

      <SliderContainer caption="Distance: " unit=" km">
        <Slider 
          minimumValue={0}
          maximumValue={100}
          step={0.5}
        />
      </SliderContainer>

      <SliderContainer caption="Time Limit: " unit=" min">
        <Slider 
          minimumValue={0}
          maximumValue={120}
          step={0.5}
          // renderAboveThumbComponent={<></>}
          />
      </SliderContainer>

      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Cuisine</Text>
      </View>
      <View style={styles.elementWrapper}>
        {DropdownComponent()}
      </View>

      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Price</Text>
      </View>
      <View style={styles.buttonRow}>
      <Pressable 
            onPress={() => setSelected(!selected)}
            onLongPress={() => setSelected(!selected)}
            style={[{ borderWidth: selected ? 2 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
        <Pressable 
            onPress={() => setSelected(!selected)}
            style={[{ borderWidth: selected ? 2 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
        <Pressable 
            onPress={() => setSelected(!selected)}
            style={[{ borderWidth: selected ? 2 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
      </View>

      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Rating</Text>
      </View>
      <View style={styles.ratingWrapper}>
        {RatingComponent()}
      </View>
      
      <View style={styles.submitWrapper}>
        <Pressable style={styles.buttonCard}>
          <Text style={styles.submitText}>Go Eat!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.light.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    color: Colors.light.text,
  },
  membersWrapper: {
    width: "100%",
    height: "10%",
    maxHeight: "10%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  groupMember: {
    backgroundColor: "#eee",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.dark.background,
    borderStyle: "solid",
    justifyContent: "center",
    alignContent: "center",
    width: 50,
    height: 50,
    marginHorizontal: 3
  }, 
  buttonRow: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    padding: "1%",
  },
  buttonCard: {
    borderColor: Colors.dark.background,
    borderRadius: 10,
    borderStyle: "solid",
    backgroundColor: Colors.light.background,
    padding: "1%",
    marginHorizontal: "2%",
    flexDirection: "row",
  },
  detailText: {
    textAlign: "center",
    fontSize: 20,
    justifyContent: "space-around"
  },
  label: {
    textAlign: "left",
    fontSize: 22,
  },
  labelWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    paddingHorizontal: "4%",
  },
  elementWrapper: {
    width: "80%",
    flex: 1,
    marginLeft: "1%",
    marginRight: "1%",
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  ratingWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "8%",
  },
  submitWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  submitText: {
    justifyContent: "center",
    textAlign: "center",
    fontSize: 33,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});