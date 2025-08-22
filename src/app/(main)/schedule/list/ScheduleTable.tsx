"use client";

import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import groupBy from "lodash/groupBy";

import { TScheduleRowData } from "@/app/(main)/schedule/ScheduleContainer";
import DeleteIcon from "@/public/images/icons/delete-icon.svg";

interface IProps {
  handleDelete: (scheduleSetId: string) => void;
  rows: TScheduleRowData[];
}

export default function ScheduleTable(props: IProps) {
  const { rows, handleDelete } = props;

  const currentMonth = dayjs().format("M");
  const currentYear = dayjs().format("YYYY");

  // ── 연속 일정 병합 함수 ──
  function mergeContinuousSchedules(rows: TScheduleRowData[]) {
    const merged: (TScheduleRowData & {
      startDate: string;
      endDate: string;
    })[] = [];

    // schedule/holiday 기준 그룹핑 (같은 이름/타겟/타입)
    const continuousRows = rows.filter(
      (r) => r.from === "schedule" || r.from === "holiday",
    );
    const grouped = groupBy(
      continuousRows,
      (row) => `${row.scheduleName}||${row.scheduleTarget}||${row.from}`,
    );

    Object.values(grouped).forEach((groupRows) => {
      const sorted = [...groupRows].sort(
        (a, b) =>
          dayjs(a.date.split("(")[0].trim(), "YYYY.MM.DD").unix() -
          dayjs(b.date.split("(")[0].trim(), "YYYY.MM.DD").unix(),
      );

      let buffer:
        | (TScheduleRowData & { startDate: string; endDate: string })
        | null = null;

      for (const row of sorted) {
        if (!buffer) {
          buffer = { ...row, startDate: row.date, endDate: row.date };
          continue;
        }

        const prevDate = dayjs(
          buffer.endDate.split("(")[0].trim(),
          "YYYY.MM.DD",
        );
        const currDate = dayjs(row.date.split("(")[0].trim(), "YYYY.MM.DD");

        if (currDate.diff(prevDate, "day") === 1) {
          buffer.endDate = row.date; // 연속 일정이면 endDate 갱신
        } else {
          merged.push(buffer);
          buffer = { ...row, startDate: row.date, endDate: row.date };
        }
      }

      if (buffer) merged.push(buffer);
    });

    // schedule이 아닌 행은 그대로 추가
    const nonScheduleRows = rows.filter(
      (r) => r.from !== "schedule" && r.from !== "holiday",
    );
    nonScheduleRows.forEach((row) => {
      merged.push({ ...row, startDate: row.date, endDate: row.date });
    });

    return merged;
  }

  const filtered = rows.filter((el) => el.date.slice(0, 4) === currentYear);
  const mergedRows = mergeContinuousSchedules(filtered);

  // 월별 그룹핑 후, 그룹 내에서 startDate 기준 정렬
  const groupedByMonth = groupBy(
    mergedRows,
    (row) =>
      dayjs(row.startDate.split("(")[0].trim(), "YYYY.MM.DD").month() + 1,
  );

  return (
    <Wrapper>
      {Object.entries(groupedByMonth)
        .sort(([monthA], [monthB]) => Number(monthA) - Number(monthB))
        .map(([month, group], groupIndex) => {
          const sortedGroup = [...group].sort(
            (a, b) =>
              dayjs(a.startDate.split("(")[0].trim(), "YYYY.MM.DD").unix() -
              dayjs(b.startDate.split("(")[0].trim(), "YYYY.MM.DD").unix(),
          );

          return (
            <Table key={groupIndex}>
              {/* 좌측 월 셀 (한 번만 출력) */}
              <LeftMonth
                groupindex={groupIndex}
                style={{
                  backgroundColor:
                    month === currentMonth ? "#C8F1E3" : "#f7f8fa",
                }}
              >
                {month}
              </LeftMonth>

              {/* 우측 셀들 */}
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                {sortedGroup.map((row, rowIndex) => (
                  <Box key={rowIndex} sx={{ display: "flex" }}>
                    {/* 날짜 셀 */}
                    <RightCells groupindex={groupIndex} rowindex={rowIndex}>
                      {row.startDate === row.endDate
                        ? row.startDate
                        : `${row.startDate} ~ ${row.endDate}`}
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
                          <Delete
                            onClick={() => handleDelete(row.scheduleSetId)}
                          />
                        )}
                    </RightCells>
                  </Box>
                ))}
              </Box>
            </Table>
          );
        })}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => ({
  width: "100%",
  margin: "auto",
  display: "flex",
  maxWidth: "917px",
  flexDirection: "column",
}));

const Table = styled(Box)(() => ({
  display: "flex",
}));

const LeftMonth = styled(Box)<{ groupindex: number }>(({ groupindex }) => ({
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
  borderLeft: "1px solid #e0e0e0",
  borderRight: "1px solid #e0e0e0",
  borderBottom: "1px solid #e0e0e0",
  borderTop: groupindex === 0 ? "1px solid #e0e0e0" : "none",
}));

const RightCells = styled(Box)<{ groupindex: number; rowindex: number }>(
  ({ groupindex, rowindex }) => ({
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
  }),
);

const Delete = styled(DeleteIcon)(() => ({
  width: "24px",
  height: "24px",
  cursor: "pointer",
  path: { fill: "#F44336" },
}));

const TargetSpan = styled("span")(() => ({
  fontSize: 10,
  fontWeight: 400,
  color: "#424242",
}));

const TargetWrap = styled(Box)(() => ({
  gap: "4px",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
}));
