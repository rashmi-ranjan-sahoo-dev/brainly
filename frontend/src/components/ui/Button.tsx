import type { ReactElement } from "react";

 

export interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startIcon?: ReactElement;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endIcon?: ReactElement;
  onClick: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const variantStyles = {
  "primary": "bg-purple-600 text-white",
  "secondary": "bg-purple-400 text-purple-600"
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sizeStyles = {
    "sm": "py-1 px-2",
    "md": "py-2 px-4",
    "lg": "py-4 px-6",
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultStyles = "rounded-md flex";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Button = (props: ButtonProps) =>{
  return <button className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]}`}>{props.startIcon ? <div className="pr-2">{props.startIcon}</div>: null}{props.text}{props.endIcon}</button>
}

