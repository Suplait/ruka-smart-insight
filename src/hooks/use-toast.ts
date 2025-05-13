
import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        toastTimeouts.set(
          toastId,
          setTimeout(() => {
            toastTimeouts.delete(toastId);
            dispatch({
              type: "REMOVE_TOAST",
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

    case "REMOVE_TOAST": {
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

const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  addToast: (toast: ToasterToast) => void;
  updateToast: (toast: ToasterToast) => void;
  dismissToast: (toastId: string) => void;
  removeToast: (toastId: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
});

const useToast = () => {
  const { toasts, addToast, updateToast, dismissToast, removeToast } = React.useContext(ToastContext);

  return {
    toasts,
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = genId();

      const toast = { id, ...props };
      addToast(toast);

      return {
        id,
        dismiss: () => dismissToast(id),
        update: (props: ToasterToast) => updateToast({ ...toast, ...props }),
      };
    },
    dismiss: (toastId: string) => dismissToast(toastId),
    remove: (toastId: string) => removeToast(toastId),
  };
};

const [state, dispatch] = React.createContext<[State, React.Dispatch<Action>]>([
  { toasts: [] },
  () => {},
]);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open === false && !toastTimeouts.has(toast.id)) {
        toastTimeouts.set(
          toast.id,
          setTimeout(() => {
            toastTimeouts.delete(toast.id);
            dispatch({
              type: "REMOVE_TOAST",
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
        dispatch({ type: "ADD_TOAST", toast });
      },
      updateToast: (toast: ToasterToast) => {
        dispatch({ type: "UPDATE_TOAST", toast });
      },
      dismissToast: (toastId: string) => {
        dispatch({ type: "DISMISS_TOAST", toastId });
      },
      removeToast: (toastId: string) => {
        dispatch({ type: "REMOVE_TOAST", toastId });
      },
    };
  }, [state.toasts]);

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

const toast = {
  success: (props: Omit<ToasterToast, "id">) => {
    const { useToast: useToastHook } = require("@/hooks/use-toast");
    const { toast } = useToastHook();
    return toast({ ...props, variant: "success" });
  },
  error: (props: Omit<ToasterToast, "id">) => {
    const { useToast: useToastHook } = require("@/hooks/use-toast");
    const { toast } = useToastHook();
    return toast({ ...props, variant: "destructive" });
  },
  warning: (props: Omit<ToasterToast, "id">) => {
    const { useToast: useToastHook } = require("@/hooks/use-toast");
    const { toast } = useToastHook();
    return toast({ ...props, variant: "warning" });
  },
  info: (props: Omit<ToasterToast, "id">) => {
    const { useToast: useToastHook } = require("@/hooks/use-toast");
    const { toast } = useToastHook();
    return toast({ ...props });
  },
};

export { useToast, ToastProvider, toast };
