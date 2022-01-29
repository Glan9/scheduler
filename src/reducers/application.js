export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
    case SET_APPLICATION_DATA:
      return { ...state, days: [...action.days], appointments: {...action.appointments}, interviewers: {...action.interviewers} };
    case SET_INTERVIEW: {

      // First build a new appointments object with the interview updated.
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview ? { ...action.interview } : null
      };
      
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };

      // A new days list where each day's spots is equal to the number of appointments it has which have a null interview.
      const days = state.days.map((day) => {
        return {
          ...day,
          spots: day.appointments.reduce((sum, appt) => sum + (appointments[appt].interview === null ? 1 : 0), 0)
        }
      });

      // Return the new state with the new days list and appointments object
      return {
        ...state,
        days: days,
        appointments: appointments
      };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}