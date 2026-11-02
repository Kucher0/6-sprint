import { render, fireEvent } from "@testing-library/react-native";
import App from "../App";

describe("Picker test", () => {
  it("should display the correct label for the Picker", () => {
    const { getByText } = render(<App />);
    expect(getByText("Choose the room type:")).toBeTruthy();
  });
  it("should show 'Standard' as the default selected value in Picker", () => {
    const { queryByLabelText } = render(<App />);
    expect(queryByLabelText("Standard")).toBeTruthy();
    expect(queryByLabelText("Luxury")).toBeNull();
    expect(queryByLabelText("Family")).toBeNull();
  });
  it("should show 'Luxury' value in Picker after 'Luxury' option was selected", () => {
    const { queryByLabelText } = render(<App />);
    fireEvent(queryByLabelText("Standard"), "onValueChange", "Luxury");
    expect(queryByLabelText("Standard")).toBeNull();
    expect(queryByLabelText("Luxury")).toBeTruthy();
    expect(queryByLabelText("Family")).toBeNull();
  });
  it("should show 'Family' value in Picker after 'Family' option was selected", () => {
    const { queryByLabelText } = render(<App />);
    fireEvent(queryByLabelText("Standard"), "onValueChange", "Luxury");
    expect(queryByLabelText("Standard")).toBeNull();
    expect(queryByLabelText("Luxury")).toBeTruthy();
    expect(queryByLabelText("Family")).toBeNull();
  });
});
