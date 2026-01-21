import { useReducer } from "react";

type Action<T> =
  | { type: "SET_FIELD"; field: keyof T; value: string }
  | { type: "RESET"; initialState: T };

function formReducer<T>(state: T, action: Action<T>): T {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "RESET":
      return action.initialState;

    default:
      return state;
  }
}

export function useFormReducer<T>(initialState: T) {
  const [form, dispatch] = useReducer(formReducer<T>, initialState);

  const handleChange =
    (field: keyof T) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({
        type: "SET_FIELD",
        field,
        value: e.target.value,
      });

  const reset = () =>
    dispatch({ type: "RESET", initialState });

  return {
    form,
    handleChange,
    reset,
  };
}
