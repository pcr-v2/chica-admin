"use client";

import { Box, Checkbox, CheckboxProps, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import MasterSchoolFilter from "@/app/(main)/student/components/MasterSchoolFilter";
import RefreshBtn from "@/app/_components/common/RefreshBtn";
import { passiveInsert } from "@/app/actions/passiveInsert/passiveInsertAction";
import { getSchool } from "@/app/actions/school/getSchoolAction";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";

interface CustomCheckboxProps extends CheckboxProps {
  iconSrc?: string;
}

interface IProps {
  schoolList: GetSchoolListResponse;
}

export default function PassiveInsert(props: IProps) {
  const { schoolList } = props;

  const [selectedSchool, setSelectedSchool] = useState("");
  const [target, setTarget] = useState<string[]>([]);

  const { data: getSchoolResult } = useQuery({
    queryKey: ["school", selectedSchool],
    queryFn: () =>
      getSchool({
        schoolId: selectedSchool,
      }).then((res) => {
        if (res.code === "FAIL") {
          toast.error(res.message);
          return null;
        }

        return res;
      }),
    staleTime: 0,
    enabled: !!selectedSchool,
  });

  const handleCheckbox = (value: string) => {
    let newTarget = [...target];

    if (selectedSchool === "") {
      toast.error("학교를 먼저 선택한 뒤에 학년을 선택해 주세요.");
      return;
    }

    if (value === "all") {
      // all 클릭 시 → 나머지 해제 후 all만 선택
      if (newTarget.includes("all")) {
        newTarget = [];
      } else {
        newTarget = ["all"];
      }
    } else {
      // 개별 학년 선택
      if (newTarget.includes(value)) {
        newTarget = newTarget.filter((el) => el !== value);
      } else {
        newTarget.push(value);
      }

      // all 해제
      newTarget = newTarget.filter((el) => el !== "all");

      // ✅ 전체 학년이 선택되면 all로 변경
      const isElementary =
        getSchoolResult?.result?.schoolLevel === "elementary";
      const gradeList = isElementary
        ? ["1", "2", "3", "4", "5", "6"]
        : ["1", "2", "3"];

      if (gradeList.every((grade) => newTarget.includes(grade))) {
        newTarget = ["all"];
      }
    }

    setTarget(newTarget);
  };

  const handlePassiveInsert = async () => {
    const res = await passiveInsert({
      schoolId: selectedSchool,
      grade: target,
    });

    if (res.code !== "SUCCESS") {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
  };

  return (
    <Wrapper>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Title>관리자 수동 삽입</Title>
        <RefreshBtn
          onClick={() => {
            setTarget([]);
            setSelectedSchool("");
          }}
        />

        <RegistBtn onClick={handlePassiveInsert}>수동 삽입</RegistBtn>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          width: "100%",
        }}
      >
        <Section>
          <TitleSpan>학교 선택</TitleSpan>

          <FilterBox>
            <MasterSchoolFilter
              onChange={(value) => setSelectedSchool(value)}
              schoolList={schoolList.result}
              selectedSchool={selectedSchool}
            />
          </FilterBox>
        </Section>
        <Section>
          <TitleSpan>대상학년</TitleSpan>

          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {(getSchoolResult?.result?.schoolLevel === "elementary"
              ? ["1", "2", "3", "4", "5", "6", "all"]
              : ["1", "2", "3", "all"]
            ).map((value, i) => (
              <CheckboxWrap key={i}>
                <CustomCheckbox
                  iconSrc="/images/icons/radio-icon.svg"
                  value={value}
                  checked={target.includes(value)}
                  onChange={() => handleCheckbox(value)}
                />
                {value === "1" && "1학년"}
                {value === "2" && "2학년"}
                {value === "3" && "3학년"}
                {value === "4" && "4학년"}
                {value === "5" && "5학년"}
                {value === "6" && "6학년"}
                {value === "all" && "전체"}
              </CheckboxWrap>
            ))}
          </Box>
        </Section>
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "32px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderRadius: "12px",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const Title = styled(Box)({
  fontSize: 20,
  width: "100%",
  fontWeight: 600,
  display: "flex",
  color: "#747D8A",
  justifyContent: "start",
});

const Section = styled(Box)(() => {
  return {
    gap: "8px",
    display: "flex",
    flexDirection: "column",
  };
});

const TitleSpan = styled("span")(() => {
  return {
    fontSize: 16,
    fontWeight: 500,
    color: "#747D8A",
  };
});

const CustomCheckbox = styled((props: CustomCheckboxProps) => {
  const { iconSrc, ...rest } = props; // iconSrc 빼고 넘김
  return <Checkbox disableRipple {...rest} />;
})(({ theme, iconSrc }) => ({
  margin: 0,
  width: 20,
  height: 20,
  padding: "2px",
  position: "relative",
  "&:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiSvgIcon-root": {
    display: "none",
  },
  "& .MuiTouchRipple-root": {
    display: "none",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: "4px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    border: "1px solid #d9d9d9",
    transition: "all 0.2s linear",
  },
  "&.Mui-checked": {
    "&::before": {
      backgroundColor: "#32C794",
      borderColor: "#13BA81",
    },
    "&::after": {
      width: 20,
      height: 20,
      top: "50%",
      left: "50%",
      content: '""',
      position: "absolute",
      backgroundImage: iconSrc ? `url(${iconSrc})` : undefined, // prop 사용
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
      transform: "translate(-50%, -50%)",
    },
  },
}));

const CheckboxWrap = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 16,
    fontWeight: 400,
    display: "flex",
    color: "#747D8A",
    alignItems: "center",
  };
});

const FilterBox = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
  };
});

const RegistBtn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    color: "#fff",
    fontWeight: 600,
    maxWidth: "100px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 12px",
    backgroundColor: "#32C794",
  };
});
