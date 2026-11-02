import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { sendData } from "./services/sendDate";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[A-Z].{2,}$/;

const toDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export default function App() {
  const [picker, setPicker] = useState(null); // null | "checkIn" | "checkOut"

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      roomType: "standard",
      checkInDate: new Date(),
      checkOutDate: null,
    },
  });

  const onSubmit = ({ userName, email, roomType, checkInDate, checkOutDate }) => {
    sendData({ userName, email, roomType, checkInDate, checkOutDate });
  };

  const handleDateChange = (field) => (event, selectedDate) => {
    setPicker(null);
    const timestamp = event?.nativeEvent?.timestamp ?? selectedDate;
    if (event?.type === "dismissed" || !timestamp) return;

    setValue(field, new Date(timestamp));
    if (getValues("checkOutDate")) {
      trigger("checkOutDate");
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.formHeader}>Booking form</Text>

        <Text style={styles.formTitle}>Name</Text>
        <Controller
          control={control}
          name="userName"
          rules={{
            required: "Name is required",
            pattern: {
              value: NAME_REGEX,
              message:
                "Name must start with a capital letter and contain at least 3 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID="user-name-input"
              style={styles.input}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.userName && (
          <Text style={styles.errorText}>{errors.userName.message}</Text>
        )}

        <Text style={styles.formTitle}>email</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "e-mail is required",
            pattern: {
              value: EMAIL_REGEX,
              message: "Invalid email address. Please enter a valid email",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID="email-input"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Text style={styles.formTitle}>Check-In Date</Text>
        <Controller
          control={control}
          name="checkInDate"
          render={({ field: { value } }) => (
            <>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setPicker("checkIn")}
              >
                <Text>{value.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {picker === "checkIn" && (
                <DateTimePicker
                  testID="date-time-picker"
                  value={value}
                  mode="date"
                  onChange={handleDateChange("checkInDate")}
                />
              )}
            </>
          )}
        />

        <Text style={styles.formTitle}>Check-Out Date</Text>
        <Controller
          control={control}
          name="checkOutDate"
          rules={{
            required: "Check-Out Date is required",
            validate: (value) => {
              if (!value) return true;
              return (
                toDay(value) > toDay(getValues("checkInDate")) ||
                "The Check-Out Date must be later than the Check-In Date"
              );
            },
          }}
          render={({ field: { value } }) => (
            <>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setPicker("checkOut")}
              >
                <Text>{value ? value.toLocaleDateString() : "Select Date"}</Text>
              </TouchableOpacity>
              {picker === "checkOut" && (
                <DateTimePicker
                  testID="date-time-picker"
                  value={value || new Date()}
                  mode="date"
                  onChange={handleDateChange("checkOutDate")}
                />
              )}
            </>
          )}
        />
        {errors.checkOutDate && (
          <Text style={styles.errorText}>{errors.checkOutDate.message}</Text>
        )}

        <Text style={styles.formTitle}>Choose the room type:</Text>
        <Controller
          control={control}
          name="roomType"
          render={({ field: { onChange, value } }) => (
            <Picker selectedValue={value} onValueChange={onChange}>
              <Picker.Item label="Standard" value="standard" />
              <Picker.Item label="Luxury" value="luxury" />
              <Picker.Item label="Family" value="family" />
            </Picker>
          )}
        />

        <TouchableOpacity
          style={{ ...styles.button, marginTop: 50 }}
          title="Submit"
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
  },
  button: {
    backgroundColor: "#0056b3",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  formHeader: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: 20,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
  },
});