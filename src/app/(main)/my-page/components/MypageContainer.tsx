"use client";

import { Box, Button, styled } from "@mui/material";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Input from "@/app/_components/common/Input";
import { Toggle } from "@/app/_components/common/Toggle";
import { getMe, GetMeResponse } from "@/app/actions/auth/getMe";
import { updateInfo } from "@/app/actions/mypage/updateInfoAction";
import {
  formatPhoneNumber,
  isValidEmail,
  isValidTeacherName,
} from "@/utils/regExp";

type TUserInfo = {
  teacherName: string;
  teacherPhone: string;
  teacherEmail: string;
};

interface IProps {
  me: GetMeResponse;
}

export default function MypageContainer(props: IProps) {
  const { me } = props;

  const [teacherName, setTeacherName] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [studentNameShow, setStudentNameShow] = useState(true);

  const queryClient = useQueryClient();

  const queryKey = ["getme"];
  const { data } = useQuery({
    queryKey,
    queryFn: () => getMe(),
    initialData: me,
  });

  useEffect(() => {
    if (data) {
      setTeacherName(data.data?.name as string);
      setTeacherPhone(formatPhoneNumber(data.data?.phone as string));
      setTeacherEmail(data.data?.email as string);
    }
  }, [data]);

  const isFormComplete = (): boolean => {
    const requiredFields: (keyof TUserInfo)[] = [
      "teacherName",
      "teacherEmail",
      "teacherPhone",
    ];

    // 각 필드가 조건을 만족하는지 체크
    const validations = {
      teacherName: isValidTeacherName(teacherName),
      teacherEmail: isValidEmail(teacherEmail),
      teacherPhone: formatPhoneNumber(teacherPhone),
    };

    // 모든 필드가 true여야 완료
    return requiredFields.every((field) => validations[field]);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "teacherName") {
      setTeacherName(value);
    } else if (name === "teacherPhone") {
      setTeacherPhone(formatPhoneNumber(value));
    } else {
      setTeacherEmail(value);
    }
  };

  const handleUpdate = async () => {
    const res = await updateInfo({
      schoolId: me.data?.schoolId as string,
      teacherName,
      teacherEmail,
      teacherPhone,
    });

    if (res.code === "FAIL") {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    queryClient.refetchQueries({
      queryKey: ["getme"],
    });
  };

  return (
    <Wrapper>
      <ContentWrap>
        <Desc>
          <span>
            *비밀번호 변경 등 상세한 요청은 고객센터를 통해 요청 주세요.
          </span>
          {/* <span>
            *학생 개인정보 보호 스위치를 off 하시면 학생 이름 전체가 App에
            등장합니다.
          </span> */}
          {/* <span>
            <span style={{ color: "#32C794" }}>스위치 ON : 김ㅊ수</span>&nbsp;
            <span style={{ color: "#32C794" }}>스위치 OFF : 김철수</span>
          </span> */}
        </Desc>

        <UserInfoWrap>
          <InputWrap>
            <Section>
              <TitleSpan>담당자</TitleSpan>
              <Input
                value={teacherName}
                onChange={handleChange}
                type="text"
                name="teacherName"
                placeholder="담당자 이름"
              />
            </Section>
            <Section>
              <TitleSpan>연락처</TitleSpan>
              <Input
                name="teacherPhone"
                value={teacherPhone}
                onChange={handleChange}
                type="text"
                placeholder="010-1234-5678"
              />
            </Section>
            <Section>
              <TitleSpan>이메일</TitleSpan>
              <Input
                name="teacherEmail"
                value={teacherEmail}
                onChange={handleChange}
                type="text"
                placeholder="이메일"
              />
            </Section>
            {/* <Section>
              <TitleSpan>학생 개인정보 보호</TitleSpan>
              <Box
                sx={{
                  display: "flex",
                  minHeight: "40px",
                  alignItems: "center",
                }}
              >
                <Toggle
                  checked={studentNameShow}
                  onChange={() => setStudentNameShow(!studentNameShow)}
                  label=""
                />
              </Box>
            </Section> */}
          </InputWrap>

          <InputWrap>
            <Section>
              <TitleSpan>학교명</TitleSpan>
              <Input
                value={data.data?.schoolName as string}
                disabled
                onChange={() => {}}
              />
            </Section>
            <Section>
              <TitleSpan>사용기한</TitleSpan>

              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <Input
                  value={
                    dayjs(data.data?.startAt).format("YYYY.MM.DD") as string
                  }
                  disabled
                  onChange={() => {}}
                />
                <DateSpan>~</DateSpan>
                <Input
                  value={dayjs(data.data?.endAt).format("YYYY.MM.DD") as string}
                  disabled
                  onChange={() => {}}
                />
              </Box>
            </Section>
          </InputWrap>

          <BtnWrap>
            <UpdateBtn
              sx={{
                backgroundColor: isFormComplete() ? "#32C794" : "#f1f2f3",
                color: isFormComplete() ? "#fff" : "#D5D7DB",
                pointerEvents: isFormComplete() ? "auto" : "none",
              }}
              onClick={handleUpdate}
            >
              변경하기
            </UpdateBtn>
          </BtnWrap>
        </UserInfoWrap>
      </ContentWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    flexGrow: 1,
    gap: "60px",
    width: "100%",
    display: "flex",
    minHeight: "100%",
    alignItems: "start",
    borderRadius: "24px",
    justifyContent: "start",
    backgroundColor: "#fff",
    padding: "32px 28px 32px",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    flexGrow: 1,
    gap: "40px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const Desc = styled(Box)(() => {
  return {
    fontSize: 18,
    width: "100%",
    padding: "16px",
    display: "flex",
    fontWeight: 400,
    color: "#747D8A",
    alignItems: "start",
    borderRadius: "12px",
    flexDirection: "column",
    justifyContent: "start",
    backgroundColor: "#F7F8FA",
  };
});

const Section = styled(Box)(() => {
  return {
    gap: "16px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const TitleSpan = styled("span")(() => {
  return {
    fontSize: 20,
    fontWeight: 600,
    color: "#747D8A",
  };
});

const UserInfoWrap = styled(Box)(() => {
  return {
    gap: "64px",
    width: "100%",
    display: "flex ",
    margin: "0 auto",
    maxWidth: "917px",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const InputWrap = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
  };
});

const DateSpan = styled("span")(() => {
  return {
    fontSize: 18,
    fontWeight: 400,
    color: "#D5D7DB",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
  };
});

const UpdateBtn = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    color: "#fff",
    fontWeight: 600,
    maxWidth: "160px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 16px",
    backgroundColor: "#32C794",
  };
});
