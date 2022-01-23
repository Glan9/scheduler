import React, { useEffect } from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import Form from "./Form";

import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const EDIT = "EDIT";
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM_DELETE = 'CONFIRM_DELETE';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }

  function remove() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => {transition(ERROR_DELETE, true)});
  }

  useEffect(() => {
    if (mode === EMPTY && props.interview) {
      transition(SHOW);
    }
    if (mode === SHOW && props.interview === null){
      transition(EMPTY);
    }
  }, [props.interview, transition, mode])

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM_DELETE)}
        />
      )}
      {mode === CREATE && (
        <Form 
          {...props.interview}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form 
          {...props.interview}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message={"Saving..."}/>}
      {mode === DELETING && <Status message={"Deleting..."}/>}
      {mode === CONFIRM_DELETE && <Confirm message={"Really cancel this appointment?"} onCancel={back} onConfirm={remove} />}
      {mode === ERROR_SAVE && <Error message={"Error saving appointment!"} onClose={back}/>}
      {mode === ERROR_DELETE && <Error message={"Error cancelling appointment!"} onClose={() => {console.log(props.interview);back()}}/>}
    </article>
  );
}