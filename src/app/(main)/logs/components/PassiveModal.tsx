"use client";

import ModalLayout from "@/store/dialog/ModalLayout";
import { DialogRequestComponentProps } from "@/store/dialog/dialogStore";

// type PassiveModalProps = DialogRequestComponentProps<>

export default function PassiveModal(props: any) {
  const { confirm } = props;
  return (
    <ModalLayout
      open
      actions={[
        {
          label: "test",
          onClick: () => {},
        },
      ]}
    >
      {/* {type === "add" ? "추가" : "삭제"} */}
    </ModalLayout>
  );
}
