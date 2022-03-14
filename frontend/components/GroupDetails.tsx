import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { MaterialIcons } from '@expo/vector-icons'; 
import React, { useState } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, } from "react-native";
import { Slider } from '@miblanchard/react-native-slider';
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
    <View style={styles.slidersWrapper}>
      {renderSlide()}
    </View>
    </>
  );
}

export default function GroupDetails() {
  let rating = 0;
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
      {
        Array.from({length: 5}, (x, i) => {
          return(
              <Pressable 
                key={i}
                // onPress={rating=i}
                >
                <MaterialIcons name="star" size={30} color="#FFA000"/>
              </Pressable>
            )
          })
      }
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
    justifyContent: "flex-start",
    alignContent: "center",
    paddingHorizontal: "4%",
  },
  slidersWrapper: {
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
  }
});

