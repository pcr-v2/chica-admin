import { ConfirmOption } from "@/store";
import ModalLayout from "@/store/dialog/ModalLayout";
import { DialogRequestComponentProps } from "@/store/dialog/dialogStore";

export default function ConfirmModal(
  props: DialogRequestComponentProps<boolean> & {
    message: string;
    isWarn?: boolean;
  } & ConfirmOption,
) {
  const { title, message, noBtnText, okBtnText, isWarn, resolve } = props;

  return (
    <ModalLayout
      open
      title={title}
      isWarn={isWarn}
      onClose={() => resolve(false)}
      actions={[
        {
          variant: "outlined",
          label: noBtnText ?? "취소",
          onClick: () => resolve(false),
        },
        { label: okBtnText ?? "확인", onClick: () => resolve(true) },
      ]}
    >
      {message}
    </ModalLayout>
  );
}
