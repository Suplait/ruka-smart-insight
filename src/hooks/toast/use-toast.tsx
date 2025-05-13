
import { useToastContext } from "./toast-context";
import { ToasterToast } from "./types";
import { genId } from "./utils";

// Helper function for direct toast usage (not exported)
const createToast = (props: Omit<ToasterToast, "id">) => {
  const { toast } = useToastImpl();
  return toast(props);
};

// The main hook implementation
const useToastImpl = () => {
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

// Exported hook
export const useToast = useToastImpl;

// Standalone toast function (this is what components will use)
export const toast = (props: Omit<ToasterToast, "id">) => {
  const { toast } = useToastImpl();
  return toast(props);
};

// Add method variants
toast.success = (props: Omit<ToasterToast, "id">) => {
  return toast({ ...props, variant: "success" as any });
};

toast.error = (props: Omit<ToasterToast, "id">) => {
  return toast({ ...props, variant: "destructive" });
};

toast.warning = (props: Omit<ToasterToast, "id">) => {
  return toast({ ...props, variant: "warning" as any });
};

toast.info = (props: Omit<ToasterToast, "id">) => {
  return toast({ ...props });
};
