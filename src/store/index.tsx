import { Component, ComponentProps, ComponentType, ReactNode } from "react";

import AlertModal from "@/store/dialog/AlertModal";
import ConfirmModal from "@/store/dialog/ConfirmModal";
import useDialogStore, {
  DialogRequestComponentProps,
} from "@/store/dialog/dialogStore";

export type AlertOption = {
  title?: string;
  okBtnText?: string;
};

export type ConfirmOption = {
  title?: string;
  okBtnText?: string;
  noBtnText?: string;
  isWarn?: boolean;
};

export function openDialog<
  C extends ComponentType<any>,
  T extends ComponentProps<C> extends DialogRequestComponentProps<infer R>
    ? R
    : never,
>(component: C, props?: Omit<ComponentProps<C>, "resolve">): Promise<T> {
  return new Promise<T>((resolve) => {
    useDialogStore.getState().add<T, ComponentProps<C>, C>({
      component,
      props,
      onResolve: (value) => {
        resolve(value);
      },
    });
  });
}

export function clearDialogs() {
  useDialogStore.getState().clear();
}

export function alert(message: ReactNode, option?: AlertOption): Promise<void> {
  return openDialog(AlertModal, { message, ...option });
}

export function confirm(
  message: string,
  option?: ConfirmOption,
): Promise<boolean> {
  return openDialog(ConfirmModal, { message, ...option });
}

confirm.warn = (message: string) => confirm(message, { isWarn: true });
