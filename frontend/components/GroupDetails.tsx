import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState, useEffect } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, ScrollView, } from "react-native";
import { Slider } from '@miblanchard/react-native-slider';
import { MultiSelect } from 'react-native-element-dropdown';
import Colors from '../constants/Colors';
import { Text, View } from './Themed';
import { useNavigation } from '@react-navigation/native';
import getLocation from '../utils/utils';

export interface GroupMembers {
  id: string;
  name: string;
}

const DATA: GroupMembers[] = [
  {
    id: "bd7acbea",
    name: "Tessa",
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
  { label: 'African', value: '1' },
  { label: 'Chinese', value: '2' },
  { label: 'Fast Food', value: '3' },
  { label: 'Indian', value: '4' },
  { label: 'Italian', value: '5' },
  { label: 'Japanese', value: '6' },
  { label: 'Mexican', value: '7' },
  { label: 'Middle Eastern', value: '8' },
  { label: 'South American', value: '9' },
  { label: 'Pub', value: '10' },
];

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
      placeholder="Select..."
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
  const [groupData, setGroupData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [dineTypeSelected, setdtSelected] = useState(false);
  const [selected, setSelected] = useState(false);
  let dineStyle = "All"

//temp button option
const [deliverySel, setDelivery] = useState(false);
const [pickUpSel, setPickUp] = useState(false);
const [dineInSel, setDineIn] = useState(false);
const [location, setLocation] = useState({});
const [lvl1Sel, setPriceLvl1] = useState(false);
const [lvl2Sel, setPriceLvl2] = useState(false);
const [lvl3Sel, setPriceLvl3] = useState(false);
const [lvl4Sel, setPriceLvl4] = useState(false);

let priceLvl = [lvl1Sel,lvl2Sel,lvl3Sel,lvl4Sel];

  const leader: GroupMembers[] = [  {
    id: "456ghjjh",
    name: "David",
  },]

  let groupCode = "wcBwxbzx"
  let url = "//131.104.49.71:80/groups/find/"
  
  let retrieveGroups = () => {
    fetch(url, {
      method:'GET'
    })
    .then(response => response.json())
    .then(data => {
        setGroupData(data) 
    })
  }
  const navigation = useNavigation();
  useEffect(() => {
    getLocation().then((userLocation) => setLocation(userLocation));
  }, []);

  console.log(location);
  
  return (
    <SafeAreaView style={styles.background}>
      {retrieveGroups}
      <View style={styles.membersWrapper}>
        <FlatList 
          horizontal
          data={leader.concat(DATA)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        />
      </View>

      <ScrollView style={styles.scrollBox}>
      <View style={styles.buttonRow}>
        <Pressable 
            onPress={() => setDelivery(!deliverySel)}
            style={[{ borderWidth: deliverySel ? 2 : 1 }, styles.buttonCard] }
          >
          <Text style={styles.detailText}>DELIVERY</Text>
        </Pressable>
        <Pressable 
            onPress={() => setPickUp(!pickUpSel)}
            style={[{ borderWidth: pickUpSel ? 2 : 1 }, styles.buttonCard] }
          >
          <Text style={styles.detailText}>PICK UP</Text>
        </Pressable>
        <Pressable 
            onPress={() => setDineIn(!dineInSel)}
            style={[{ borderWidth: dineInSel ? 2 : 1 }, styles.buttonCard] }
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
          step={1}
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
            onPress={() => setPriceLvl1(!lvl1Sel)}
            // onLongPress={() => setSelected(!selected)}
            style={[{ borderWidth: lvl1Sel ? 2 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
        <Pressable 
            onPress={() => setPriceLvl2(!lvl2Sel)}
            style={[{ borderWidth: lvl2Sel ? 2 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
        <Pressable 
            onPress={() => setPriceLvl3(!lvl3Sel)}
            style={[{ borderWidth: lvl3Sel ? 2 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
        <Pressable 
            onPress={() => setPriceLvl4(!lvl4Sel)}
            style={[{ borderWidth: lvl4Sel ? 2 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
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
      </ScrollView>

      <View style={styles.submitWrapper}>
        <Pressable style={styles.buttonCard} onPress={() => {navigation.navigate('Session', {})}}>
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
    height: "12%",
    maxHeight: "12%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: "1%",
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
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: "2%",
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
    alignSelf: "center",
    justifyContent: "flex-start",
    alignContent: "center",
    paddingHorizontal: "4%",
    paddingTop: "2%",
  },
  elementWrapper: {
    width: "80%",
    flex: 1,
    marginLeft: "1%",
    marginRight: "1%",
    alignItems: 'stretch',
    justifyContent: 'center',
    alignSelf: "center",
  },
  ratingWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: "8%",
    marginBottom: "2%",
  },
  submitWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    height: "14%",
    maxHeight: "14%",
    padding: "1%",
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
    fontSize: 18,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  scrollBox: {
    width: "100%",
    height: "68%",
    flexDirection: "column",
    alignContent: "center",
  },
});