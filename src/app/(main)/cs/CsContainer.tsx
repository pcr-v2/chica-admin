"use client";

import { Box, Chip, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CsSearchBar from "@/app/(main)/cs/components/CsSearchBar";
// import CsTab, { TTab } from "@/app/(main)/cs/components/CsTab";
import CsTable from "@/app/(main)/cs/components/CsTable";
import WriteCs, { TCs } from "@/app/(main)/cs/components/WriteCs";
import Badge from "@/app/_components/common/Badge";
import CountTab from "@/app/_components/common/CountTab";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { GetCsListResponse } from "@/app/actions/cs/getCsListAction";
import { writeCs } from "@/app/actions/cs/writeCsAction";

interface IProps {
  me: GetMeResponse;
  csList: GetCsListResponse;
}
export type TTab = "total" | "complete" | "not";

export default function CsContainer(props: IProps) {
  const { me, csList } = props;

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

  const [selectedTab, setSelectedTab] = useState<TTab>("total");

  const [open, setOpen] = useState(false);

  const handleRegist = async (value: TCs) => {
    const res = await writeCs({
      ...value,
      schoolId: me.data?.schoolId as string,
    });

    if (res.code === "FAIL") {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
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
        <CsSearchBar onClick={() => setOpen(true)} />

        <CsTable list={csList?.result} />
      </ContentWrap>

      <Modal
        open={open}
        maxWidth={800}
        onClose={() => setOpen(false)}
        children={
          <WriteCs handleRegist={handleRegist} onClose={() => setOpen(false)} />
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
    padding: "32px 28px",
    borderRadius: "24px",
    flexDirection: "column",
    backgroundColor: "#fff",
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
