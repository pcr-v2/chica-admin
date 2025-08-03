"use client";

import { Box, Button, styled } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import StudentCard from "@/app/(main)/student/add/StudentCard";
import SchoolAutoComplete from "@/app/_components/common/AutoComplete";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import { addStudent } from "@/app/actions/student/addStudentAction";
import { csvStudentsBulkRegistSchema } from "@/app/actions/student/studentSchema";
import downloadCsv from "@/utils/downloadCsv";
import uploadCsv from "@/utils/uploadCsv";

const CSV_DEFAULT_DATAS = [
  {
    학생이름: "한지민",
    학년: "1",
    반: "3",
    번호: "24",
    성별: "남",
  },
  {
    학생이름: "정소민",
    학년: "1",
    반: "3",
    번호: "24",
    성별: "남",
  },
];

interface IProps {
  me: GetMeResponse;
  schoolList: GetSchoolListResponse;
}

export default function StudentAddForm(props: IProps) {
  const { me, schoolList } = props;

  const [schoolId, setSchoolId] = useState<string | null>();
  const [bulkRegist, setBulkRegist] = useState(false);

  const [student, setStudent] = useState<any[]>([]);

  useEffect(() => {
    if (!me.data) {
      return;
    }

    if (me.data.type === "teacher") {
      setSchoolId(me.data.schoolId as string);
    }
  }, [me]);

  const handleAdd = async () => {
    const res = await addStudent({
      schoolId: "21a01ae2-2f60-4f7c-bcae-9fa4fc287564",
      students: student,
    });

    if (res.code === "SUCCESS") {
      toast.success(res.message);
      // onSuccess();
    } else {
      toast.error(res.message);
    }
  };

  console.log("student", student);

  return (
    <>
      {/* <Button variant="contained" fullWidth onClick={handleAdd}>
        학생등록 테스트
      </Button> */}

      <TopContents>
        {me.data?.type === "master" && (
          <MasterBox>
            <MasterNotice>
              마스터는 학생 등록시에 학교를 선택해야 합니다.
            </MasterNotice>
            <SchoolAutoComplete
              options={
                schoolList.result?.map((el) => {
                  return { id: el.schoolId, name: el.schoolName };
                }) ?? [{ id: "", name: "" }]
              }
              onChange={(value) => {
                console.log("value", value);
                setSchoolId(value);
              }}
            />
          </MasterBox>
        )}

        <BtnWrap>
          <Button variant="contained" onClick={() => setBulkRegist(true)}>
            일괄등록
          </Button>
          <Button
            variant="contained"
            onClick={() => downloadCsv(CSV_DEFAULT_DATAS, "학생등록양식")}
          >
            양식 다운로드
          </Button>

          <Button
            variant="contained"
            onClick={async () => {
              const res = await uploadCsv(csvStudentsBulkRegistSchema);

              const updatedRes = res.map((el) => ({
                ...el,
                // studentStatus:
                //   el.studentStatus === "Y" || el.studentStatus === "y",
                studentGender: el.studentGender === "남" ? "male" : "female",
                studentGrade: Number(el.studentGrade),
                studentNumber: Number(el.studentNumber),
                studentStatus: true,
              }));

              console.log("updatedRes", updatedRes);

              setStudent([...student, ...updatedRes]);
            }}
          >
            업로드 테스트
          </Button>
        </BtnWrap>

        <Modal
          children={<div>asdf</div>}
          open={bulkRegist}
          onClose={() => setBulkRegist(false)}
        />
      </TopContents>

      <Button
        onClick={handleAdd}
        sx={{ width: "100%", height: "60px" }}
        variant="contained"
      >
        등록버튼
      </Button>

      <div
        style={{ width: "100%", border: "1px solid purple", marginTop: "40px" }}
      >
        {student.map((el, idx) => {
          return <div key={idx}>{el.studentName}</div>;
        })}
      </div>

      {schoolId != null && (
        <StudentCard
          schoolLevel={me.data?.schoolLevel as "elementary" | "middle" | "high"}
        />
      )}
    </>
  );
}

const TopContents = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    padding: "24px",
    alignItems: "center",
    border: "1px solid red",
    justifyContent: "space-between",
  };
});

const MasterBox = styled(Box)(() => {
  return {
    gap: "4px",
    width: "100%",
    display: "flex",
    maxWidth: "500px",
    alignItems: "start",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const MasterNotice = styled("span")(() => {
  return {
    fontSize: "12px",
    color: "#616161",
    lineHeight: "140%",
    letterSpacing: "-0.1px",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "8px",
    display: "flex",
    alignItems: "center",
  };
});
