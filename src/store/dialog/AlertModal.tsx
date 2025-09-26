import { ReactNode } from "react";

import { AlertOption } from "@/store";
import ModalLayout from "@/store/dialog/ModalLayout";
import { DialogRequestComponentProps } from "@/store/dialog/dialogStore";

export default function AlertModal(
  props: DialogRequestComponentProps<void> & {
    message: ReactNode;
  } & AlertOption,
) {
  const { title, message, okBtnText, resolve } = props;

  return (
    <ModalLayout
      open
      onClose={() => resolve()}
      title={title}
      actions={[{ label: okBtnText ?? "확인", onClick: () => resolve() }]}
    >
      {message}
    </ModalLayout>
  );
}
