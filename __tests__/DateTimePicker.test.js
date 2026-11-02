import { render, fireEvent, act } from "@testing-library/react-native";
import App from "../App";

const ERROR_MESSAGE = "The Check-Out Date must be later than the Check-In Date";

describe("DateTimePicker test", () => {
  it("should display correct labeles for the DateTimePicker", () => {
    const { getByText } = render(<App />);
    expect(getByText("Check-In Date")).toBeTruthy();
    expect(getByText("Check-Out Date")).toBeTruthy();
  });
  it("should display the today date by default in Check-In Date", () => {
    const { getByText } = render(<App />);
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    expect(getByText(formattedDate)).toBeTruthy();
  });
  it("should display the 'Select Date' by default in Check-Out Date", () => {
    const { getByText } = render(<App />);
    expect(getByText("Select Date")).toBeTruthy();
  });
  it("should not display the Error message by default", () => {
    const { queryByText } = render(<App />);
    expect(queryByText(ERROR_MESSAGE)).toBeNull();
  });
  it("should not display Picker by default", () => {
    const { queryByTestId } = render(<App />);
    expect(queryByTestId("dateTimePicker")).toBeNull();
  });
  it("should display setted dates", async () => {
    const { queryAllByText, queryByText, getByTestId } = render(<App />);
    const newDate = new Date();
    let formattedDate = newDate.toLocaleDateString();
    newDate.setDate(newDate.getDate() + 1);
    await act(async () => {
      fireEvent.press(queryByText("Select Date"));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: newDate },
      });
    });
    await act(async () => {
      fireEvent.press(queryByText(formattedDate));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: newDate },
      });
    });
    formattedDate = newDate.toLocaleDateString();
    expect(queryAllByText(formattedDate)).toHaveLength(2);
  });

  it("should not display the Error message when Check-Out Date is setted later than the Check-In Date", async () => {
    const { queryByText, getByTestId } = render(<App />);
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    const formattedDate = newDate.toLocaleDateString();
    await act(async () => {
      fireEvent.press(queryByText("Select Date"));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: newDate },
      });
    });
    expect(queryByText(formattedDate)).toBeTruthy();
    expect(queryByText(ERROR_MESSAGE)).toBeNull();
  });
  it("should display the Error message when Check-Out Date is setted before than the Check-In Date", async () => {
    const { queryByText, getByTestId, getByText } = render(<App />);
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 2);
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    await act(async () => {
      fireEvent.press(getByText(formattedDate));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkInDate },
      });
    });
    await act(async () => {
      fireEvent.press(queryByText("Select Date"));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkOutDate },
      });
    });
    expect(queryByText(ERROR_MESSAGE)).toBeTruthy();
    expect(queryByText("Select Date")).toBeNull();
  });
  it("should display the Error message when Check-In Date is setted later than the Check-Out Date", async () => {
    const { queryByText, getByTestId, getByText } = render(<App />);
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 2);
    await act(async () => {
      fireEvent.press(queryByText("Select Date"));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkOutDate },
      });
    });
    await act(async () => {
      fireEvent.press(getByText(formattedDate));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkInDate },
      });
    });
    expect(queryByText(ERROR_MESSAGE)).toBeTruthy();
    expect(queryByText("Select Date")).toBeNull();
  });
  it("should not display the Error message when Check-In Date is setted before than the Check-Out Date", async () => {
    const { queryByText, getByTestId, getByText } = render(<App />);
    const today = new Date();
    let formattedDate = today.toLocaleDateString();
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 2);
    await act(async () => {
      fireEvent.press(queryByText("Select Date"));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkOutDate },
      });
    });
    await act(async () => {
      fireEvent.press(getByText(formattedDate));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkInDate },
      });
    });
    formattedDate = checkInDate.toLocaleDateString();
    checkInDate.setDate(checkInDate.getDate() - 2);
    await act(async () => {
      fireEvent.press(getByText(formattedDate));
    });
    await act(async () => {
      fireEvent(getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkInDate },
      });
    });
    expect(queryByText(ERROR_MESSAGE)).toBeNull();
    expect(queryByText("Select Date")).toBeNull();
  });
});
