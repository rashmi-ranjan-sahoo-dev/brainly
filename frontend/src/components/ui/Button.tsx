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
export const Button = (props: ButtonProps) =>{
  return <button className={variantStyles[props.variant]}>{props.text}</button>
}

