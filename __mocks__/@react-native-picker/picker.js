import React, { useEffect } from "react";
import { View, Text } from "react-native";

export const Picker = ({ selectedValue, onValueChange, children }) => {
  const selectedItem =
    children.find((item) => item.props.value === selectedValue) || children[0];

  return (
    <View>
      {selectedItem ? (
        <Text
          onValueChange={(label) => {
            const newSelectedItem = children.find(
              (item) => item.props.label === label
            );
            onValueChange(newSelectedItem.props.value);
          }}
          accessibilityLabel={selectedItem.props.label}
        >
          {selectedItem.props.label}
        </Text>
      ) : null}
    </View>
  );
};

Picker.Item = ({ label, value, ...props }) => {
  return <Text {...props}>{label}</Text>;
};
