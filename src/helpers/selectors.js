export function getAppointmentsForDay(state, day) {
  const dayObj = state.days.reduce((acc, item) => item.name === day ? item : acc, null);
  let appointments = [];

  if (dayObj) {
    appointments = dayObj.appointments;
  }

  return appointments.map((id) => {
    return Object.values(state.appointments).reduce((acc, item) => item.id === id ? item : acc, {});
  });
}

export function getInterview(state, interview) {
  if (!interview) return null;
  
  const interviewer = Object.values(state.interviewers).reduce((acc, item) => item.id === interview.interviewer ? item : acc, null);

  return {...interview, interviewer: interviewer};
}

export function getInterviewersForDay(state, day) {
  const dayObj = state.days.reduce((acc, item) => item.name === day ? item : acc, null);
  let interviewers = [];

  if (dayObj) {
    interviewers = dayObj.interviewers;
  }

  return interviewers.map((id) => {
    return Object.values(state.interviewers).reduce((acc, item) => item.id === id ? item : acc, {});
  });
}