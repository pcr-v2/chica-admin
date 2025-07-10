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
import { csvStudentsBlukRegistSchema } from "@/app/actions/student/addStudentSchema";
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
      schoolId: "1ad52d51-798d-41d0-b09e-3517238fc7b7",
      students: [
        {
          studentName: "추가11중학교 학생1",
          studentClass: "11반",
          studentGrade: 3,
          studentNumber: 1,
          studentGender: "male",
          studentStatus: true,
        },
        {
          studentName: "추가11중학교 학생2",
          studentClass: "11반",
          studentGrade: 3,
          studentNumber: 2,
          studentGender: "female",
          studentStatus: true,
        },
        {
          studentName: "추가11중학교 학생3",
          studentClass: "11반",
          studentGrade: 3,
          studentNumber: 3,
          studentGender: "male",
          studentStatus: true,
        },
      ],
    });

    if (res.code === "SUCCESS") {
      toast.success(res.message);
      // onSuccess();
    } else {
      toast.error(res.message);
    }
  };

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
              const res = await uploadCsv(csvStudentsBlukRegistSchema);

              console.log("res", res);

              const updatedRes = res.map((el) => ({
                ...el,
                // studentStatus:
                //   el.studentStatus === "Y" || el.studentStatus === "y",
                student_gender: el.studentGender === "남" ? "male" : "female",
              }));

              console.log(updatedRes);

              // setStudent([...student, ...updatedRes]);
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
