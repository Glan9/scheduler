import React from "react";
import classNames from "classnames";

import InterviewerListItem from "./InterviewerListItem";

import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {props.interviewers.map((interviewer) => 
          <InterviewerListItem 
            name={interviewer.name}
            avatar={interviewer.avatar}
            selected={interviewer.id === props.value}
            setInterviewer={(e) => props.onChange(interviewer.id)}
            key={interviewer.id}
          />
        )}
      </ul>
    </section>
  );
}