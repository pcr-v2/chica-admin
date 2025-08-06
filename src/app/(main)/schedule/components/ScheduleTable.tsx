"use client";

import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import groupBy from "lodash/groupBy";

import { TScheduleRowData } from "@/app/(main)/schedule/ScheduleContainer";
import DeleteIcon from "@/public/images/icons/delete-icon.svg";

interface IProps {
  onClickEdit: (scheduleId: number) => void;
  rows: TScheduleRowData[];
}

export default function ScheduleTable(props: IProps) {
  const { rows, onClickEdit } = props;

  // 1. 월별로 그룹핑 (예: '1월', '2월', ...)
  const groupedByMonth = groupBy(rows, (row) => {
    const month = dayjs(row.date).month() + 1;
    return `${month}월`;
  });

  return (
    <Wrapper>
      {Object.entries(groupedByMonth).map(([month, group], groupIndex) => (
        <Table key={groupIndex}>
          {/* 좌측 월 셀 (한 번만 출력) */}
          <LeftMonth groupindex={groupIndex}>{month}</LeftMonth>

          {/* 우측 셀들 */}
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {group.map((row, rowIndex) => {
              return (
                <Box key={rowIndex} sx={{ display: "flex" }}>
                  {/* 날짜 셀 */}
                  <RightCells groupindex={groupIndex} rowindex={rowIndex}>
                    {row.date}
                  </RightCells>

                  {/* 일정 이름 셀 */}
                  <RightCells
                    groupindex={groupIndex}
                    rowindex={rowIndex}
                    style={{
                      justifyContent:
                        row.from === "schedule" ? "space-between" : "start",
                    }}
                  >
                    <TargetWrap>
                      <Box> {row.scheduleName}</Box>
                      <TargetSpan>
                        (
                        {row.scheduleTarget === "all"
                          ? "전교생"
                          : `${row.scheduleTarget}학년`}
                        )
                      </TargetSpan>
                    </TargetWrap>

                    {row.from === "schedule" &&
                      row.scheduleName !== "개교기념일" && (
                        <Delete onClick={() => onClickEdit(row.id)} />
                      )}
                  </RightCells>
                </Box>
              );
            })}
          </Box>
        </Table>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    margin: "auto",
    display: "flex",
    maxWidth: "917px",
    flexDirection: "column",
  };
});

const Table = styled(Box)(() => {
  return {
    display: "flex",
  };
});

const LeftMonth = styled(Box)<{ groupindex: number }>(({ groupindex }) => {
  return {
    fontSize: 18,
    fontWeight: 600,
    display: "flex",
    minHeight: "59px",
    maxWidth: "131px",
    minWidth: "131px",
    color: "#464B53",
    alignItems: "center",
    justifyContent: "start",
    padding: "16px 14px 14px",
    backgroundColor: "#F7F8FA",
    borderLeft: "1px solid #e0e0e0",
    borderRight: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    borderTop: groupindex === 0 ? "1px solid #e0e0e0" : "none",
  };
});

const RightCells = styled(Box)<{ groupindex: number; rowindex: number }>(({
  groupindex,
  rowindex,
}) => {
  return {
    fontSize: 16,
    width: "100%",
    fontWeight: 400,
    display: "flex",
    padding: "14px",
    maxWidth: "393px",
    minHeight: "59px",
    color: "#464B53",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRight: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    borderTop:
      groupindex === 0 && rowindex === 0 ? "1px solid #e0e0e0" : "none",
  };
});

const Delete = styled(DeleteIcon)(() => ({
  width: "24px",
  height: "24px",
  cursor: "pointer",
  path: {
    fill: "#F44336",
  },
}));

const TargetSpan = styled("span")(() => {
  return {
    fontSize: 10,
    fontWeight: 400,
    color: "#424242",
  };
});

const TargetWrap = styled(Box)(() => {
  return {
    gap: "4px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  };
});
