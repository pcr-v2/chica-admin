"use client";

import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import StudentAddForm from "@/app/(main)/student/add/StudentAddForm";
import BulkAddForm from "@/app/(main)/student/components/BulkAddForm";
import MasterSchoolFilter from "@/app/(main)/student/components/MasterSchoolFilter";
import SingleAddForm from "@/app/(main)/student/components/SingleAddForm";
import StudentClassFilter from "@/app/(main)/student/components/StudentClassFilter";
import StudentGradeFilter from "@/app/(main)/student/components/StudentGradeFilter";
import StudentTable from "@/app/(main)/student/components/StudentTable";
import CountTab from "@/app/_components/common/CountTab";
import Modal from "@/app/_components/common/Modal";
import SearchInput from "@/app/_components/common/SearchInput";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import {
  addStudent,
  AddStudentRequest,
} from "@/app/actions/student/addStudentAction";
import {
  getGradeClass,
  GetGradeClassResponse,
} from "@/app/actions/student/getGradeClass";
import { GetStudentListResponse } from "@/app/actions/student/getStudentListAction";
import { csvStudentsBulkRegistSchema } from "@/app/actions/student/studentSchema";
import PlusIcon from "@/public/images/icons/plus-icon.svg";
import UploadIcon from "@/public/images/icons/upload-icon.svg";
import downloadCsv from "@/utils/downloadCsv";
import uploadCsv from "@/utils/uploadCsv";

export type TTab = "total" | "attending" | "not-attending";

type TOpen = {
  show: boolean;
  type: "single" | "bulk" | null;
};

const CSV_DEFAULT_DATAS = [
  {
    학생이름: "박보검",
    학년: "1",
    반: "1",
    번호: "1",
    성별: "남",
  },
  {
    학생이름: "아이유",
    학년: "1",
    반: "2",
    번호: "2",
    성별: "여",
  },
  {
    학생이름: "정소민",
    학년: "1",
    반: "3",
    번호: "3",
    성별: "여",
  },
];

interface IProps {
  me: GetMeResponse;
  schoolList: GetSchoolListResponse;
  studentList: GetStudentListResponse;
}

export default function StudentContainer(props: IProps) {
  const { me, studentList, schoolList } = props;

  const attendingCount =
    studentList.result?.filter((el) => el.studentStatus).length ?? 0;
  const notAttendingCount =
    studentList.result?.filter((el) => !el.studentStatus).length ?? 0;

  const tabList = [
    { label: "전체", value: "total", count: studentList.result?.length ?? 0 },
    {
      label: "재학",
      value: "attending",
      count: attendingCount,
    },
    {
      label: "미재학",
      value: "not-attending",
      count: notAttendingCount,
    },
  ] as const;

  const [open, setOpen] = useState<TOpen>({ show: false, type: null });
  const [selectedTab, setSelectedTab] = useState<TTab>("total");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchName, setSearchName] = useState("");
  const [gradeClassInfo, setGradeClassInfo] =
    useState<GetGradeClassResponse["result"]>();

  const [bulk, setBulk] = useState<number | null>(null);
  const [tempBulk, setTempBulk] = useState<AddStudentRequest["students"]>([]);

  const handleGradeClass = async (schoolId: string) => {
    const res = await getGradeClass({
      schoolId,
    });

    return res;
  };

  useEffect(() => {
    if (!me.data) return;

    const schoolId =
      me.data.type === "master" ? selectedSchool : me.data.schoolId;

    if (!schoolId) return;

    (async () => {
      const res = await handleGradeClass(schoolId);
      if (res) {
        setGradeClassInfo(res.result);
      }
    })();
  }, [me, selectedSchool]);

  // ✅ 마스터일 경우: 학교 바뀌면 학년/반 초기화
  useEffect(() => {
    if (me.data?.type === "master") {
      setSelectedGrade(null);
      setSelectedClass("");
    }
  }, [selectedSchool]);

  // ✅ 마스터가 아닐 경우: 학년 바뀌면 반 초기화
  useEffect(() => {
    if (me.data?.type !== "master") {
      setSelectedClass("");
    }
  }, [selectedGrade]);

  const handleAdd = async (students: AddStudentRequest["students"]) => {
    if (me.data?.type === "master") {
      if (selectedSchool == null) {
        toast.error("학교를 선택해 주세요.");
        return;
      }
      const res = await addStudent({
        schoolId: selectedSchool,
        students,
      });

      if (res.code === "SUCCESS") {
        toast.success(res.message);
        setOpen({ show: false, type: null });
        return;
      }

      toast.error(res.message);
      return;
    }

    const res = await addStudent({
      schoolId: me.data?.schoolId as string,
      students,
    });

    if (res.code === "FAIL") {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setOpen({ show: false, type: null });
  };

  return (
    <Wrapper>
      <CountTab
        selected={selectedTab}
        onChange={setSelectedTab}
        tabList={tabList}
      />

      <ContentWrap>
        <SearchWrap>
          <Box sx={{ display: "flex", gap: "16px" }}>
            {me.data?.type === "master" && (
              <MasterSchoolFilter
                schoolList={schoolList.result}
                selectedSchool={selectedSchool}
                onChange={(value) => setSelectedSchool(value)}
              />
            )}

            <StudentGradeFilter
              isElementary={me.data?.schoolLevel === "elementary"}
              selectedGrade={selectedGrade}
              onChange={(value) => setSelectedGrade(value)}
            />

            <StudentClassFilter
              grade={selectedGrade}
              selectedClass={selectedClass}
              list={
                gradeClassInfo?.find((el) => el.studentGrade === selectedGrade)
                  ?.classList ?? []
              }
              onChange={(value) => setSelectedClass(value)}
            />

            <SearchInput
              value={searchName}
              placeholder="이름"
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", gap: "16px" }}>
            <RegistBtn
              onClick={() => {
                if (me.data?.type === "master" && selectedSchool == null) {
                  toast.error("학교를 먼저 선택해 주세요.");
                  return;
                }
                setOpen({ show: true, type: "single" });
              }}
            >
              <Plus />
              학생등록
            </RegistBtn>

            <RegistBtn onClick={() => setOpen({ show: true, type: "bulk" })}>
              <Upload />
              일괄등록
            </RegistBtn>
          </Box>
        </SearchWrap>

        <StudentTable list={studentList.result} />
      </ContentWrap>

      <Modal
        open={open.show}
        maxWidth={open.type === "single" ? 403 : 593}
        children={
          open.type === "single" ? (
            <SingleAddForm
              isElementary={me.data?.schoolLevel === "elementary"}
              onClose={() => setOpen({ show: false, type: null })}
              onConfirm={handleAdd}
            />
          ) : (
            <BulkAddForm
              bulk={bulk}
              handleDownload={() =>
                downloadCsv(CSV_DEFAULT_DATAS, "학생등록양식")
              }
              handleUpload={async () => {
                const res = await uploadCsv(csvStudentsBulkRegistSchema);

                if (res.length > 0) {
                  setBulk(res.length);
                }

                const updatedRes = res.map((el) => ({
                  ...el,
                  studentGender: el.studentGender === "남" ? "male" : "female",
                  studentGrade: Number(el.studentGrade),
                  studentNumber: Number(el.studentNumber),
                  studentStatus: true,
                }));

                setTempBulk([...(updatedRes as AddStudentRequest["students"])]);
              }}
              onConfirm={() => handleAdd(tempBulk)}
              onClose={() => {
                setOpen({ show: false, type: null });
                setBulk(null);
                setTempBulk([]);
              }}
            />
          )
        }
        onClose={() => setOpen({ show: false, type: null })}
      />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderRadius: "24px",
    padding: "32px 28px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const SearchWrap = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    padding: "4px 0px",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const RegistBtn = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 16,
    width: "100%",
    fontWeight: 600,
    display: "flex",
    maxWidth: "120px",
    cursor: "pointer",
    color: "#747D8A",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 12px",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #E0E0E0",
  };
});

const Plus = styled(PlusIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "24px",
  height: "24px",
  path: {
    fill: "#747D8A",
  },
  transition: "transform 0.2s ease-in-out",
  transform: `rotate(${isopen === "true" ? 180 : 0}deg)`,
}));

const Upload = styled(UploadIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "24px",
  height: "24px",
  path: {
    fill: "#747D8A",
  },
  transition: "transform 0.2s ease-in-out",
  transform: `rotate(${isopen === "true" ? 180 : 0}deg)`,
}));
