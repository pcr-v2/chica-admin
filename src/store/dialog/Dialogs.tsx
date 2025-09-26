"use client";

import useDialogStore from "@/store/dialog/dialogStore";

export function Dialogs() {
  const dialogStore = useDialogStore();
  return (
    <>
      {Object.entries(dialogStore.dialogMap).map(
        ([key, { component: Dialog, props, onResolve }]) => {
          return (
            <Dialog
              key={key}
              {...props}
              resolve={(value) => {
                dialogStore.remove(key);
                onResolve?.(value);
              }}
            />
          );
        },
      )}
    </>
  );
}
