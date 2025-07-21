"use client";

import { Box, Chip, styled } from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";

import WriteCs, { TCs } from "@/app/(main)/cs/components/WriteCs";
import Badge from "@/app/_components/common/Badge";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { GetCsListResponse } from "@/app/actions/cs/getCsListAction";
import { writeCs } from "@/app/actions/cs/writeCsAction";

interface IProps {
  me: GetMeResponse;
  csList: GetCsListResponse;
}

export default function CsContainer(props: IProps) {
  const { me, csList } = props;

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
      <TopContent>
        <Title>
          {me.data?.type === "master"
            ? `전체 문의 ${csList.result?.length}개`
            : `${me.data?.name}님의 문의 내역`}
        </Title>

        {me.data?.type === "teacher" && (
          <AddBtn onClick={() => setOpen(true)}>작성하기</AddBtn>
        )}
      </TopContent>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {csList?.result?.map((el) => {
          return (
            <Box
              key={el.id}
              sx={{
                display: "flex",
                padding: "24px",
                alignItems: "center",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box>제목 : {el.title}</Box>
                <Box>내용 : {el.content}</Box>
              </Box>

              <Badge
                label={el.comment == null ? "답변 미완료" : "답변 완료"}
                color={el.comment == null ? "warning" : "primary"}
              />
            </Box>
          );
        })}
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        children={<WriteCs handleRegist={handleRegist} />}
      />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "60px",
    width: "100%",
    display: "flex",
    padding: "24px",
    flexDirection: "column",
    border: "1px solid red",
  };
});

const TopContent = styled(Box)(() => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
