import { Props } from "./types";

export const Button = ({ children, onClick }: Props) => {
  <button onClick={onClick}>{children}</button>;
};
