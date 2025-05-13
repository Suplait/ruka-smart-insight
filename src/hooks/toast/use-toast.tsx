
import { useToastContext } from "./toast-context";
import { ToasterToast } from "./types";
import { genId } from "./utils";

export const useToast = () => {
  const { toasts, addToast, updateToast, dismissToast, removeToast } = useToastContext();

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

export const toast = {
  success: (props: Omit<ToasterToast, "id">) => {
    const { toast } = useToast();
    return toast({ ...props, variant: "success" });
  },
  error: (props: Omit<ToasterToast, "id">) => {
    const { toast } = useToast();
    return toast({ ...props, variant: "destructive" });
  },
  warning: (props: Omit<ToasterToast, "id">) => {
    const { toast } = useToast();
    return toast({ ...props, variant: "warning" });
  },
  info: (props: Omit<ToasterToast, "id">) => {
    const { toast } = useToast();
    return toast({ ...props });
  },
};
