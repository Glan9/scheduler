import { React, useState, useEffect, useReducer } from "react";
import axios from "axios";


const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
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

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`, { }).then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  }

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onopen = () => webSocket.send("ping");
    webSocket.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      if (typeof msg === 'object' && msg !== null && msg.type === SET_INTERVIEW) {
        dispatch(msg);
      }
    };

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days: [...all[0].data], appointments: {...all[1].data}, interviewers: {...all[2].data} });
    })

    return function cleanup() {
      webSocket.close();
    }
  }, []);

  return {state, setDay, bookInterview, cancelInterview};
}