import { ComponentType } from "react";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

export type DialogRequestComponentProps<ReturnType> = {
  resolve: (value: ReturnType) => void;
};

export type DialogRequest<
  ReturnType,
  Props extends
    DialogRequestComponentProps<ReturnType> = DialogRequestComponentProps<ReturnType>,
  DialogComponent = ComponentType<Props>,
> = {
  component: DialogComponent;
  props?: Omit<Props, "resolve">;
  onResolve?: (value: ReturnType) => void;
};

type State = {
  dialogMap: Record<string, DialogRequest<unknown>>;
};

type Action = {
  add: <
    T,
    P extends DialogRequestComponentProps<T> = DialogRequestComponentProps<T>,
    C = ComponentType<P>,
  >(
    dialog: DialogRequest<T, P, C>,
  ) => string;
  remove: (key: string) => boolean;
  clear: () => void;
};

const useDialogStore = create<State & Action>((set) => ({
  dialogMap: {},
  add: <T, P extends DialogRequestComponentProps<T>, C = ComponentType<P>>(
    dialog: DialogRequest<T, P, C>,
  ) => {
    const key = uuidv4();
    set((state) => {
      return {
        dialogMap: {
          ...state.dialogMap,
          [key]: dialog as DialogRequest<unknown>,
        },
      };
    });
    return key;
  },
  remove: (key) => {
    let hasKey = false;
    set((state) => {
      hasKey = Boolean(state.dialogMap[key]);
      delete state.dialogMap[key];
      if (hasKey) {
        return { dialogMap: { ...state.dialogMap } };
      }
      return {};
    });
    return hasKey;
  },
  clear: () => {
    set(() => ({
      dialogMap: {},
    }));
  },
}));

export default useDialogStore;
