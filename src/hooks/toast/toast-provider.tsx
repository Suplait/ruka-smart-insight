
import * as React from "react";
import { ToastContext } from "./toast-context";
import { reducer, toastTimeouts, globalDispatch, TOAST_REMOVE_DELAY } from "./toast-reducer";
import { ToasterToast } from "./types";
import { actionTypes } from "./types";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });
  
  // Assign the dispatch function to our module-level variable
  globalDispatch = dispatch;

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open === false && !toastTimeouts.has(toast.id)) {
        toastTimeouts.set(
          toast.id,
          setTimeout(() => {
            toastTimeouts.delete(toast.id);
            dispatch({
              type: actionTypes.REMOVE_TOAST,
              toastId: toast.id,
            });
          }, TOAST_REMOVE_DELAY)
        );
      }
    });
  }, [state.toasts]);

  const value = React.useMemo(() => {
    return {
      toasts: state.toasts,
      addToast: (toast: ToasterToast) => {
        dispatch({ type: actionTypes.ADD_TOAST, toast });
      },
      updateToast: (toast: ToasterToast) => {
        dispatch({ type: actionTypes.UPDATE_TOAST, toast });
      },
      dismissToast: (toastId: string) => {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
      },
      removeToast: (toastId: string) => {
        dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
      },
    };
  }, [state.toasts]);

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}
