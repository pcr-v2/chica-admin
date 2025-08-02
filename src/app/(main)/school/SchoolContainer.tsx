"use client";

import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

import SchoolAddForm from "@/app/(main)/school/SchoolAddForm";
import SchoolSearchFilter from "@/app/(main)/school/SchoolSearchFilter";
import SchoolTable from "@/app/(main)/school/SchoolTable";
import CountTab from "@/app/_components/common/CountTab";
import Modal from "@/app/_components/common/Modal";
import SearchInput from "@/app/_components/common/SearchInput";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import PlusIcon from "@/public/images/icons/plus-icon.svg";

export type TTab = "total" | "use" | "expire";

interface IProps {
  schoolList: GetSchoolListResponse;
}

export default function SchoolContainer(props: IProps) {
  const { schoolList } = props;

  // 사용카운트
  const useCount =
    schoolList.result?.filter((el) => {
      const today = dayjs().startOf("day");
      const start = dayjs(el.startAt).startOf("day");
      const end = dayjs(el.endAt).startOf("day");

      // start <= today <= end 를 표현하는 방식
      return (
        start.isBefore(today.add(1, "day")) &&
        end.isAfter(today.subtract(1, "day"))
      );
    }).length ?? 0;

  // 만료 카운트
  const expireCount =
    schoolList.result?.filter((el) => {
      const today = dayjs().startOf("day");
      const start = dayjs(el.startAt).startOf("day");
      const end = dayjs(el.endAt).startOf("day");

      // today < start || today > end
      return today.isBefore(start) || today.isAfter(end);
    }).length ?? 0;

  const tabList = [
    { label: "전체", value: "total", count: schoolList.result?.length ?? 0 },
    {
      label: "사용",
      value: "use",
      count: useCount,
    },
    {
      label: "만료",
      value: "expire",
      count: expireCount,
    },
  ] as const;

  const [selectedTab, setSelectedTab] = useState<TTab>("total");

  const [selectedFilter, setSelectedFilter] = useState("schoolname");
  const [value, setValue] = useState("");

  const [open, setOpen] = useState(false);

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
            <SchoolSearchFilter
              selectedFilter={selectedFilter}
              onChange={(value) => setSelectedFilter(value)}
            />

            <SearchInput
              value={value}
              placeholder="학교 검색"
              onChange={(e) => setValue(e.target.value)}
            />
          </Box>

          <RegistBtn onClick={() => setOpen(true)}>
            <Plus />
            학교등록
          </RegistBtn>
        </SearchWrap>

        <SchoolTable list={schoolList.result} />
      </ContentWrap>

      {/* <TopContent>
        <CountText>등록된 학교 {schoolList.result?.length}개</CountText>

        <AddSchool onClick={() => setOpen(true)}>
          <AddRounded sx={{ color: "#fff", width: "24px" }} />
          학교 추가
        </AddSchool>
      </TopContent>
      <Divider />

      <ListWrap>
        {schoolList.result?.map((el) => {
          return (
            <SingleRow key={el.id}>
              <Box sx={{}}>{el.schoolName}</Box>
              <Box sx={{}}>{el.teacherName}</Box>
              <Box sx={{}}>{el.teacherEmail}</Box>
              <Box sx={{}}>{el.teacherPhone}</Box>
              <Box sx={{}}>{el.loginId}</Box>
              <Box sx={{}}>
                계약 종료일 : {customDayjs(el.endAt).format("YYYY-MM-DD")}
              </Box>
              <Box sx={{}}>{el.schoolStatus.toString()}</Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  backgroundColor: "#3196ff",
                  padding: "4px 8px",
                  cursor: "pointer",
                  color: "#fff",
                }}
                onClick={async () => {
                  const res = await getMeal(el);
                  setTest(res);
                }}
              >
                급식보기
              </Box>
            </SingleRow>
          );
        })}
      </ListWrap>
      {test}

      */}

      <Modal
        open={open}
        maxWidth={571}
        children={
          <SchoolAddForm
            onSuccess={() => {
              setOpen(false);
              // revalidatePath("/school/list");
              // router.refresh();
            }}
          />
        }
        onClose={() => setOpen(false)}
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
    color: "#fff",
    fontWeight: 600,
    display: "flex",
    maxWidth: "120px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 12px",
    alignItems: "center",
    backgroundColor: "#32C794",
  };
});

const Plus = styled(PlusIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "24px",
  height: "24px",
  path: {
    fill: "#fff",
  },
  transition: "transform 0.2s ease-in-out",
  transform: `rotate(${isopen === "true" ? 180 : 0}deg)`,
}));
