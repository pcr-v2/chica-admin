import { Box, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import Execution from "@/app/(main)/student/components/Execution";
import ExecutionBoard from "@/app/(main)/student/components/ExecutionBoard";
import ExecutionMyClass from "@/app/(main)/student/components/ExecutionMyClass";
import SummaryTab from "@/app/(main)/student/components/SummaryTab";
import TitleBadge from "@/app/_components/common/TitleBadge";
import { getStatistic } from "@/app/actions/statistic/getStatistic";
import { getStudent } from "@/app/actions/student/getStudentAction";

type TTab = "week" | "month" | "term";

interface IProps {
  studentId: string;
}

export default function StudentRankForm(props: IProps) {
  const { studentId } = props;

  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState<TTab>("week");
  const { data: studentData, isFetching: isFetchingStudent } = useQuery({
    queryKey: ["get-student", selectedTab, studentId],
    queryFn: () =>
      getStudent({
        studentId,
      }),
    enabled: !!studentId && !!selectedTab,
    staleTime: 0,
  });

  const { data, isFetching: isFetchingStatistic } = useQuery({
    queryKey: ["get-statistic", selectedTab, studentId as string],
    queryFn: () =>
      getStatistic({
        studentId,
        type: selectedTab,
      }),
    enabled: !!studentId && !!selectedTab,
    staleTime: 0,
  });
  // console.log("studentId", studentId, selectedTab);

  return (
    <Content>
      <TopContent>
        {/* {!isLoading && studentData?.result && ( */}
        <TitleBadge
          text={`${studentData?.result?.studentGrade ?? 1}학년 ${studentData?.result?.studentClass ?? 1}반 ${studentData?.result?.studentNumber ?? 1}번 ${studentData?.result?.studentName ?? "OOO"}`}
        />
        {/* )} */}

        <SummaryTab
          selectedTab={selectedTab}
          onClickTab={(value) => setSelectedTab(value)}
        />
      </TopContent>

      {/* {!isLoading && ( */}
      <ExecutionWrap>
        <Execution
          myRate={data?.data?.myRate ?? 0}
          myRankInClass={data?.data?.myRankInClass ?? 0}
          myRankInGrade={data?.data?.myRankInGrade ?? 0}
          myRankInSchool={data?.data?.myRankInSchool ?? 0}
          classPeopleCount={data?.data?.classPeopleCount ?? 0}
          gradePeopleCount={data?.data?.gradePeopleCount ?? 0}
          schoolPeopleCount={data?.data?.schoolPeopleCount ?? 0}
        />

        <ExecutionMyClass
          classRate={data?.data?.classRate ?? 0}
          classRankInGrade={data?.data?.classRankInGrade ?? 0}
          classRankInSchool={data?.data?.classRankInSchool ?? 0}
          countClassInGrade={data?.data?.countClassInGrade ?? 0}
          countClassInSchool={data?.data?.countClassInSchool ?? 0}
        />

        <ExecutionBoard
          allClassRateArray={data?.data?.allClassRateArray ?? []}
        />
      </ExecutionWrap>
      {/* )} */}
    </Content>
  );
}

const Content = styled(Box)(() => {
  return {
    gap: "64px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "40px 32px",
    justifyContent: "flex-start",
    fontFamily: "NanumSquareRound",

    maxHeight: "800px",
    overflowY: "auto",
  };
});

const TopContent = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    fontFamily: "NanumSquareRound",
  };
});

const ExecutionWrap = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "NanumSquareRound",
  };
});
