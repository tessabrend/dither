import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RatingProps } from "../constants/Interfaces";

export default function Rating(props: RatingProps) {
    const rating = props["rating"] ? props["rating"] : 0.0;
    const setRating = props["setRating"];
    return(
        <View style={{flexDirection: "row"}}>
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <View key={i}>
        
              <Pressable
                key={i}
                onPress={() => setRating(ratingValue)}
              >
              <FontAwesomeIcon
                icon="star"
                color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                size={30} />
              </Pressable>
            </View>
          );
        })}
      </View>
    )
}
