import { React, useState, useEffect, useReducer } from "react";
import axios from "axios";

import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "reducers/application"


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