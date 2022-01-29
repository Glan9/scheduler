import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, getByAltText, getByPlaceholderText, getAllByTestId, prettyDOM, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
    const day = getAllByTestId(container, "day").find((day) => 
      queryByText(day, "Monday")
    );
    expect(queryByText(day, /no spots remaining/i)).not.toBeNull();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the first booked appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. When prompted, confirm we really want to delete.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 5. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 6. Wait until the element has an "Add" button (i.e. it's now an empty appointment).
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 7. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) => 
      queryByText(day, "Monday")
    );
    expect(queryByText(day, /2 spots remaining/i)).not.toBeNull();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the first booked appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Update the name.
    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click save and check that it goes to the "Saving..." display
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 6. Wait until the element with "Lydia Miller-Jones" exists
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 7. Check that the DayListItem with the text "Monday" still has the text "1 spots remaining".
    const day = getAllByTestId(container, "day").find((day) => 
      queryByText(day, "Monday")
    );
    expect(queryByText(day, /1 spot remaining/i)).not.toBeNull();

    // 8. Check that no element with "Archie Cohen" exists anymore.
    expect(queryByText(appointment, "Archie Cohen")).toBeNull();

  });
  
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // Render the page and create a new appointment
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));

    expect(getByText(appointment, "Error saving appointment!")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // Render the page and create a new appointment
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));

    expect(getByText(appointment, "Error cancelling appointment!")).toBeInTheDocument();

  });

});
