"use client";

import { Box, Chip, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CsSearchBar from "@/app/(main)/cs/components/CsSearchBar";
// import CsTab, { TTab } from "@/app/(main)/cs/components/CsTab";
import CsTable from "@/app/(main)/cs/components/CsTable";
import WriteCs, { TCs } from "@/app/(main)/cs/components/WriteCs";
import Badge from "@/app/_components/common/Badge";
import CountTab from "@/app/_components/common/CountTab";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { getCs, GetCsResponse } from "@/app/actions/cs/getCsAction";
import { getCsList, GetCsListResponse } from "@/app/actions/cs/getCsListAction";
import { updateCs } from "@/app/actions/cs/updateCsAction";
import { writeComment } from "@/app/actions/cs/writeCommentAction";
import { writeCs } from "@/app/actions/cs/writeCsAction";

interface IProps {
  me: GetMeResponse;
  csList: GetCsListResponse;
}
export type TTab = "total" | "complete" | "not";

export default function CsContainer(props: IProps) {
  const { me, csList } = props;

  const queryKey = ["csList", me.data?.schoolId, me.data?.type];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      getCsList({
        schoolId: me.data?.schoolId!,
        type: me.data?.type as "master" | "teacher",
      }),
    initialData: csList,
    staleTime: 0,
  });

  const tabList = [
    { label: "전체", value: "total", count: csList.result?.length ?? 0 },
    {
      label: "답변완료",
      value: "complete",
      count:
        csList.result?.filter((el) => el.status === "ANSWERED").length ?? 0,
    },
    {
      label: "미답변",
      value: "not",
      count:
        csList.result?.filter((el) => el.status === "UNANSWERED").length ?? 0,
    },
  ] as const;

  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState<TTab>("total");

  const [open, setOpen] = useState(false);

  const [updateBoardId, setUpdateBoardId] = useState<number | null>(null);

  // 🔍 검색 관련 상태를 이쪽에서 관리
  const [selectedFilter, setSelectedFilter] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  const {
    data: updatedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: open ? ["cs", updateBoardId] : [],
    queryFn: () =>
      updateBoardId ? getCs({ boardId: updateBoardId }) : Promise.resolve(null),
    enabled: !!updateBoardId, // boardId 있을 때만 실행
  });

  // 🔍 필터링된 데이터 계산
  // 🔍 필터링된 데이터 계산
  const filteredList = useMemo(() => {
    if (!searchValue.trim()) return data.result;

    return data?.result?.filter((item) => {
      let targetValue: string | null = null;

      switch (selectedFilter) {
        case "title":
        case "content":
          targetValue = item[selectedFilter];
          break;
        case "school":
          targetValue = item.school?.schoolName ?? null;
          break;
        default:
          targetValue = null;
      }

      if (!targetValue || typeof targetValue !== "string") return false;

      return targetValue.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [data.result, selectedFilter, searchValue]);

  const handleRegist = async (value: TCs) => {
    const basePayload = {
      schoolId: me.data?.schoolId as string,
      ...value,
    };

    // 1️⃣ 신규 등록 (글쓰기)
    if (!updatedData && me.data?.type === "teacher") {
      const res = await writeCs(basePayload);

      if (res.code === "FAIL") {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
    }

    // 2️⃣ 수정
    else if (updatedData && me.data?.type === "teacher") {
      const res = await updateCs({
        ...basePayload,
        boardId: updatedData.result?.id as number,
      });

      if (res.code === "FAIL") {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
    }

    // 3️⃣ 마스터 댓글 등록
    else if (
      updatedData &&
      me.data?.type === "master" &&
      value.comment &&
      updatedData.result?.status !== "ANSWERED"
    ) {
      const res = await writeComment({
        boardId: updatedData.result?.id as number,
        schoolId: basePayload.schoolId,
        comment: value.comment,
        type: me.data?.type,
      });

      if (res.code === "FAIL") {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
    }

    // ✅ 공통처리
    queryClient.invalidateQueries({
      queryKey: ["csList", me.data?.schoolId, me.data?.type],
    });
    setOpen(false);
  };

  return (
    <Wrapper>
      <CountTab
        selected={selectedTab}
        onChange={setSelectedTab}
        tabList={tabList}
      />
      <ContentWrap>
        <CsSearchBar
          onClickWrite={() => setOpen(true)}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <CsTable
          list={filteredList}
          onClickEdit={(boardId) => {
            setUpdateBoardId(boardId);
            setOpen(true); // 바로 열거나, fetch 후 열어도 됨
          }}
        />
      </ContentWrap>

      <Modal
        open={open}
        maxWidth={800}
        onClose={() => setOpen(false)}
        children={
          <WriteCs
            type={me.data?.type as "master" | "teacher"}
            handleRegist={handleRegist}
            onClose={() => setOpen(false)}
            updatedData={updatedData?.result}
          />
        }
      />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "60px",
    width: "100%",
    display: "flex",
    borderRadius: "24px",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "32px 28px 64px",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    gap: "24px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const Title = styled("span")(() => {
  return {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: "160%",
    letterSpacing: "-0.24px",
  };
});

const AddBtn = styled(Box)(() => {
  return {
    width: "100%",
    padding: "8px",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    maxWidth: "120px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#3196ff",
  };
});
