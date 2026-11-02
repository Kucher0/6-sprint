import { render, fireEvent, act } from "@testing-library/react-native";
import App from "../App";
import { sendData } from "../services/sendDate";

jest.mock("../services/sendDate", () => ({
  sendData: jest.fn(),
}));

describe("Valadation test", () => {
  let screen;
  let nameInptut;
  let emailInptut;
  let checkInDateInput;
  let checkOutDateInput;
  let submitButton;
  const today = new Date();
  beforeEach(() => {
    screen = render(<App />);
    nameInptut = screen.getByTestId("user-name-input");
    emailInptut = screen.getByTestId("email-input");
    checkOutDateInput = screen.getByText("Select Date");
    checkInDateInput = screen.getByText(today.toLocaleDateString());
    submitButton = screen.getByText("Submit");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should call sendData with inputed correct data", async () => {
    const userName = "Abc";
    const email = "abc@abc.com";
    const roomType = "Luxury";
    await act(async () => {
      fireEvent(nameInptut, "onChangeText", userName);
      fireEvent(emailInptut, "onChangeText", email);
      fireEvent(screen.getByLabelText("Standard"), "onValueChange", roomType);
    });
    const checkOutDate = new Date(today);
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    await act(async () => {
      fireEvent.press(checkInDateInput);
    });
    await act(async () => {
      fireEvent(screen.getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: today },
      });
    });

    await act(async () => {
      fireEvent.press(checkOutDateInput);
    });
    await act(async () => {
      fireEvent(screen.getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkOutDate },
      });
    });
    await act(async () => {
      fireEvent.press(submitButton);
    });
    const expectedObj = {
      userName,
      email,
      roomType: "luxury",
      checkInDate: today,
      checkOutDate,
    };
    expect(sendData).toHaveBeenCalledWith(expectedObj);
  });
  it("should not call sendData without any inputs", async () => {
    await act(async () => {
      fireEvent.press(submitButton);
    });
    expect(sendData).not.toHaveBeenCalled();
  });
  it("should display 'Name is required' after clicking submit button if name input is empty", async () => {
    await act(async () => {
      fireEvent.press(submitButton);
    });
    expect(screen.getByText("Name is required")).toBeTruthy();
  });
  it("should display 'e-mail is required' after clicking submit button if name input is empty", async () => {
    await act(async () => {
      fireEvent.press(submitButton);
    });
    expect(screen.getByText("e-mail is required")).toBeTruthy();
  });
  it("should display 'Name must start with a capital letter and contain at least 3 characters' after clicking submit button if name is not correct", async () => {
    await act(async () => {
      fireEvent.changeText(nameInptut, "1notcorrectname");
    });
    await act(async () => {
      fireEvent.press(submitButton);
    });
    expect(
      screen.getByText(
        "Name must start with a capital letter and contain at least 3 characters"
      )
    ).toBeTruthy();
  });
  it("should display 'Invalid email address. Please enter a valid email' after clicking submit button if email is not correct", async () => {
    await act(async () => {
      fireEvent.changeText(emailInptut, "1notcorrectemail");
    });
    await act(async () => {
      fireEvent.press(submitButton);
    });
    expect(
      screen.getByText("Invalid email address. Please enter a valid email")
    ).toBeTruthy();
  });
  it("should display the Error message when Check-Out Date is setted before than the Check-In Date", async () => {
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 2);
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    await act(async () => {
      fireEvent.press(checkInDateInput);
    });
    await act(async () => {
      fireEvent(screen.getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkInDate },
      });
    });
    await act(async () => {
      fireEvent.press(checkOutDateInput);
    });
    await act(async () => {
      fireEvent(screen.getByTestId("date-time-picker"), "onChange", {
        nativeEvent: { timestamp: checkOutDate },
      });
    });
    expect(
      screen.queryByText("The Check-Out Date must be later than the Check-In Date")
    ).toBeTruthy();
  });
});
