import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Entypo } from "@expo/vector-icons";

export interface PickerItem {
  label: string;
  value: any;
}

interface SelectPickerProps {
  placeholder: string;
  selectedValue: any;
  onValueChange: (value: any) => void;
  items: PickerItem[];
  icon?: React.ReactNode;
  isActive?: boolean;
}

export const SelectPicker = ({
  placeholder,
  selectedValue,
  onValueChange,
  items,
  icon,
  isActive = false,
}: SelectPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find((item) => String(item.value) === String(selectedValue));
  const displayLabel = selectedItem ? selectedItem.label : placeholder;

  const handleValueChange = (value: any) => {
    onValueChange(value);
    if (Platform.OS === "ios") {
      setIsOpen(false);
    }
  };

  if (Platform.OS !== "ios") {
    return (
      <View style={[styles.container, selectedValue ? styles.containerActive : null]}>
        <View style={styles.leftRow}>
          {icon}
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.androidPicker}
            dropdownIconColor="#22bdc1"
            mode="dropdown"
          >
            <Picker.Item label={placeholder} value="" />
            {items.map((item, idx) => (
              <Picker.Item label={item.label} value={item.value} key={idx} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        style={[
          styles.container,
          isOpen || selectedValue ? styles.containerActive : null,
        ]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <View style={styles.leftRow}>
          {icon}
          <Text
            style={[
              styles.valueText,
              selectedValue ? styles.valueTextSelected : styles.placeholderText,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayLabel}
          </Text>
        </View>
        <Entypo
          name={isOpen ? "chevron-thin-up" : "chevron-thin-down"}
          size={14}
          color="#888888"
          style={styles.chevron}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={handleValueChange}
            style={styles.iosPicker}
          >
            <Picker.Item label={placeholder} value="" />
            {items.map((item, idx) => (
              <Picker.Item label={item.label} value={item.value} key={idx} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    borderRadius: 40,
    height: 40,
    backgroundColor: "#ffffff",
    elevation: 5,
    marginTop: 20,
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 15,
    width: "100%",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  containerActive: {
    borderWidth: 1,
    borderColor: "#22bdc1",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
    height: "100%",
  },
  valueText: {
    flex: 1,
    paddingLeft: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  valueTextSelected: {
    color: "#22bdc1",
  },
  placeholderText: {
    color: "#888888",
  },
  chevron: {
    marginLeft: 5,
  },
  androidPicker: {
    flex: 1,
    color: "#22bdc1",
    height: 40,
    backgroundColor: "transparent",
  },
  pickerWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  iosPicker: {
    width: "100%",
    height: 216,
  },
});
