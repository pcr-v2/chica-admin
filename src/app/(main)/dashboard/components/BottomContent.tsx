"use client";

import { Box, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import Table from "@/app/(main)/dashboard/components/Table";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import {
  getRankPageStatistic,
  GetRankPageStatisticResponse,
} from "@/app/actions/statistic/getRankPageStatistic";

interface IProps {
  me: GetMeResponse;
  list: GetRankPageStatisticResponse;
}

export default function BottomContent(props: IProps) {
  const { me, list } = props;

  const { data } = useQuery({
    queryKey: ["student-statistic-list"],
    queryFn: () =>
      getRankPageStatistic({
        schoolId: me.data?.schoolId as string,
        type: "term",
      }),
    initialData: list,
    staleTime: 0,
  });

  return (
    <Wrapper>
      <TableWrap>
        <Title>개인전 순위</Title>

        <Table list={data} type="rank" />
      </TableWrap>

      <TableWrap>
        <Title>5일 연속 미참여 학생 리스트</Title>

        <Table list={data} type="uncheck" />
      </TableWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
  };
});

const TableWrap = styled(Box)(() => {
  return {
    gap: "24px",
    display: "flex",
    flexDirection: "column",

    maxWidth: "786.5px",
    width: "calc(50% - 20px)",
    aspectRatio: "786.5 / 374",
  };
});

const Title = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    fontWeight: 600,
    color: "#464B53",
    textAlign: "start",
  };
});
