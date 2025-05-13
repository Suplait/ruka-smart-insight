
import { Action, State, actionTypes } from "./types";

export const TOAST_LIMIT = 5;
export const TOAST_REMOVE_DELAY = 1000000;

export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        toastTimeouts.set(
          toastId,
          setTimeout(() => {
            toastTimeouts.delete(toastId);
            globalDispatch({
              type: actionTypes.REMOVE_TOAST,
              toastId,
            });
          }, TOAST_REMOVE_DELAY)
        );
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;

      if (toastId) {
        const timeout = toastTimeouts.get(toastId);
        if (timeout) {
          clearTimeout(timeout);
          toastTimeouts.delete(toastId);
        }
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      };
    }

    default:
      return state;
  }
};

// Define globalDispatch here instead of importing it
export let globalDispatch: React.Dispatch<Action>;
