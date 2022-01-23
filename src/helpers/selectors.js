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
  const appointments = getAppointmentsForDay(state, day);

  let interviewers = []

  // Filter all interviewers to find ones where there exists an appointment on that day whose interviewer id matches
  // Only look if there are actually appointments on that day.
  if (appointments.length > 0){
    interviewers = Object.values(state.interviewers).filter((interviewer) => {
      return ( 
        appointments.filter((appt) => appt.interview && appt.interview.interviewer === interviewer.id) 
      ).length > 0;
    });
  }

  return interviewers;
}