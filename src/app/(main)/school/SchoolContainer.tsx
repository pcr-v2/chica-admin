"use client";

import { Box, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import SchoolAddForm from "@/app/(main)/school/SchoolAddForm";
import SchoolSearchFilter from "@/app/(main)/school/SchoolSearchFilter";
import SchoolTable from "@/app/(main)/school/SchoolTable";
import CountTab from "@/app/_components/common/CountTab";
import Modal from "@/app/_components/common/Modal";
import SearchInput from "@/app/_components/common/SearchInput";
import { getSchool } from "@/app/actions/school/getSchoolAction";
import {
  getSchoolList,
  GetSchoolListResponse,
} from "@/app/actions/school/getSchoolListAction";
import { UpdateSchoolStatus } from "@/app/actions/school/updateSchoolStatusAction";
import PlusIcon from "@/public/images/icons/plus-icon.svg";

export type TTab = "total" | "use" | "not" | "expire";

interface IProps {
  schoolList: GetSchoolListResponse;
}

export default function SchoolContainer(props: IProps) {
  const { schoolList } = props;

  const [selectedTab, setSelectedTab] = useState<TTab>("total");

  const [selectedFilter, setSelectedFilter] = useState("schoolname");
  const [value, setValue] = useState("");

  const [updateSchoolId, setUpdateSchoolId] = useState("");

  const [open, setOpen] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});

  const queryKey = ["schoolList", open, statusMap];

  const { data } = useQuery({
    queryKey,
    queryFn: () => getSchoolList(),
    initialData: schoolList,
    staleTime: 0,
  });

  const { data: updatedData } = useQuery({
    queryKey: open
      ? ["student-update", updateSchoolId, open]
      : [updateSchoolId],
    queryFn: () =>
      updateSchoolId
        ? getSchool({ schoolId: updateSchoolId })
        : Promise.resolve(null),
    enabled: !!updateSchoolId, // boardId 있을 때만 실행
  });

  // 사용카운트
  const useCount =
    data.result?.filter((el) => {
      const today = dayjs().startOf("day");
      const start = dayjs(el.startAt).startOf("day");
      const end = dayjs(el.endAt).startOf("day");

      // start <= today <= end 를 표현하는 방식
      return (
        start.isBefore(today.add(1, "day")) &&
        end.isAfter(today.subtract(1, "day"))
      );
    }).length ?? 0;

  // 미사용카운트
  const notCount =
    data.result?.filter((el) => {
      const status = statusMap[el.schoolId] ?? el.schoolStatus;
      return status === false;
    }).length ?? 0;

  // 만료 카운트
  const expireCount =
    data.result?.filter((el) => {
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
      label: "미사용",
      value: "not",
      count: notCount,
    },
    {
      label: "만료",
      value: "expire",
      count: expireCount,
    },
  ] as const;

  const filteredList = useMemo(() => {
    if (!data.result) return [];

    const today = dayjs().startOf("day");

    const listWithTabFilter = data.result.filter((el) => {
      const start = dayjs(el.startAt).startOf("day");
      const end = dayjs(el.endAt).startOf("day");

      if (selectedTab === "use") {
        return (
          start.isBefore(today.add(1, "day")) &&
          end.isAfter(today.subtract(1, "day"))
        );
      }

      if (selectedTab === "not") {
        return el.schoolStatus === false;
      }

      if (selectedTab === "expire") {
        return today.isBefore(start) || today.isAfter(end);
      }

      return true; // 전체 탭일 경우
    });

    if (!value.trim()) return listWithTabFilter;

    return listWithTabFilter.filter((item) => {
      let targetValue: string | null = null;

      switch (selectedFilter) {
        case "schoolname":
          targetValue = item["schoolName"];
          break;
        case "teachername":
          targetValue = item["teacherName"];
          break;
        case "email":
          targetValue = item["teacherEmail"];
          break;
        default:
          targetValue = null;
      }

      if (!targetValue || typeof targetValue !== "string") return false;

      return targetValue.toLowerCase().includes(value.toLowerCase());
    });
  }, [data.result, selectedFilter, value, selectedTab]);

  const handleToggle = async (schoolId: string, newStatus: boolean) => {
    setStatusMap((prev) => ({ ...prev, [schoolId]: newStatus }));

    try {
      const res = await UpdateSchoolStatus({
        schoolId,
        schoolStatus: newStatus,
      });

      if (res.code === "FAIL") {
        toast.error(res.message);
        setStatusMap((prev) => ({ ...prev, [schoolId]: !newStatus }));
        return;
      }

      toast.success(`${res.result?.schoolName} 상태 변경 완료`);
    } catch (e) {
      toast.error("상태 변경 실패");
      setStatusMap((prev) => ({ ...prev, [schoolId]: !newStatus }));
    }
  };

  useEffect(() => {
    if (!data) return;

    const initialMap: Record<string, boolean> = {};
    data.result?.forEach((item) => {
      initialMap[item.schoolId] = item.schoolStatus;
    });

    setStatusMap(initialMap);
  }, [data]);

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

        <SchoolTable
          statusMap={statusMap}
          handleToggle={handleToggle}
          list={filteredList}
          onClickEdit={(schoolId) => {
            setUpdateSchoolId(schoolId);
            setOpen(true);
          }}
        />
      </ContentWrap>

      <Modal
        open={open}
        maxWidth={571}
        children={
          <SchoolAddForm
            updatedData={updatedData?.result}
            onSuccess={() => setOpen(false)}
            onClose={() => {
              setUpdateSchoolId("");
              setOpen(false);
            }}
          />
        }
        onClose={() => {
          setUpdateSchoolId("");
          setOpen(false);
        }}
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
