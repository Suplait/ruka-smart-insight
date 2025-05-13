
import * as React from "react";
import { ToasterToast } from "./types";

interface ToastContextType {
  toasts: ToasterToast[];
  addToast: (toast: ToasterToast) => void;
  updateToast: (toast: ToasterToast) => void;
  dismissToast: (toastId: string) => void;
  removeToast: (toastId: string) => void;
}

export const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
});

export const useToastContext = () => React.useContext(ToastContext);
