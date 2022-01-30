export function getAppointmentsForDay(state, day) {
  // Find the day object in question
  const dayObj = state.days.find((item) => item.name === day);

  // If we don't find the day, return null
  if (dayObj === undefined) {
    return [];
  }

  return dayObj.appointments.map((id) => {
    return Object.values(state.appointments).find((item) => item.id === id);
  });
}

export function getInterview(state, interview) {
  if (!interview) return null;
  
  const interviewer = Object.values(state.interviewers).find((item) => item.id === interview.interviewer);

  return {...interview, interviewer: interviewer};
}

export function getInterviewersForDay(state, day) {
  // Find the day object in question
  const dayObj = state.days.find((item) => item.name === day);

  // If we don't find the day, return null
  if (dayObj === undefined) {
    return [];
  }

  return dayObj.interviewers.map((id) => {
    return Object.values(state.interviewers).find((item) => item.id === id);
  });
}