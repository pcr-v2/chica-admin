import PassiveInsert from "@/app/(main)/logs/PassiveModal/PassiveInsert";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import ModalLayout from "@/store/dialog/ModalLayout";
import { DialogRequestComponentProps } from "@/store/dialog/dialogStore";

type InserModalProps = DialogRequestComponentProps<undefined> & {
  schoolList: GetSchoolListResponse;
};

export default function InsertModal(props: InserModalProps) {
  const { resolve, schoolList } = props;

  return (
    <ModalLayout
      open
      actions={[
        {
          variant: "outlined",
          label: "취소",
          onClick: () => resolve(undefined),
        },
      ]}
    >
      <PassiveInsert schoolList={schoolList} />
    </ModalLayout>
  );
}
