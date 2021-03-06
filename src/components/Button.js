import React from "react";
import classNames from "classnames";

import "components/Button.scss";

export default function Button(props) {
   const btnClass = classNames('button', {'button--confirm': props.confirm}, {'button--danger': props.danger});

   return (
      <button className={btnClass} disabled={props.disabled} onClick={props.onClick}>
         {props.children}
      </button>
   );
}
