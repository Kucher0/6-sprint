import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { sendData } from "./services/sendData";

export default function App() {
  const data = {};
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.formHeader}>Booking form</Text>
        <Text style={styles.formTitle}>Name</Text>
        <TextInput testID="user-name-input" style={styles.input} />
        <Text style={styles.errorText}>Name is required</Text>
        <Text style={styles.errorText}>
          Name must start with a capital letter and contain at least 3
          characters
        </Text>
        <Text style={styles.formTitle}>email</Text>
        <TextInput testID="email-input" style={styles.input} />
        <Text style={styles.errorText}>e-mail is required</Text>
        <Text style={styles.errorText}>
          Invalid email address. Please enter a valid email
        </Text>
        <Text style={styles.formTitle}>Check-In Date</Text>
        <TextInput testID="date-time-picker" style={styles.input} defaultValue={(new Date()).toLocaleString()}/>
        <Text style={styles.formTitle}>Check-Out Date</Text>
        <TextInput testID="date-time-picker" style={styles.input} />
        <Text style={styles.errorText}>Check-Out Date is required</Text>
        <Text style={styles.errorText}>
          The Check-Out Date must be later than the Check-In Date
        </Text>
        <Text style={styles.formTitle}>Choose the room type:</Text>
        <TextInput
          style={styles.input}
          placeholder="choose: Standard/Luxury/Family"
        />
        <TouchableOpacity
          style={{ ...styles.button, marginTop: 50 }}
          title="Submit"
          onPress={() => sendData(data)}
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

