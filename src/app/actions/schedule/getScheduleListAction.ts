"use server";

import dayjs from "dayjs";
import { z } from "zod";

import { getScheduleListSchema } from "@/app/actions/schedule/scheduleSchema";
import { mysqlPrisma } from "@/libs/prisma";
import customDayjs from "@/utils/customDayjs";

export type GetScheduleListRequest = z.infer<typeof getScheduleListSchema>;
export type GetScheduleListResponse = Awaited<
  ReturnType<typeof getScheduleList>
>;

type MergedSchedule = {
  [month: string]: {
    id: number;
    scheduleName: string;
    date: string;
    from: "holiday" | "schedule";
    scheduleTarget: string;
  }[];
};

export async function getScheduleList(request: GetScheduleListRequest) {
  const validated = getScheduleListSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const currentYear = dayjs().year();

  const { schoolId } = validated.data;

  const validSchoolId = await mysqlPrisma.school.findFirst({
    where: {
      schoolId,
      schoolStatus: true,
      startAt: { lte: dayjs().toISOString() },
      endAt: { gte: dayjs().toISOString() },
    },
  });

  if (validSchoolId == null) {
    return {
      code: "FAIL" as const,
      message: "만료된 학교 혹은 사용중이지 않은 학교입니다.",
    };
  }

  const holiday = await mysqlPrisma.holiday.findMany({
    where: {
      holidayStatus: true,
    },
  });

  const schoolSchedule = await mysqlPrisma.schedules.findMany({
    where: {
      schoolId: validated.data.schoolId,
      scheduleStatus: true,
    },
  });

  if (!schoolSchedule || !holiday) {
    return {
      code: "INVALID_CREDENTIAL" as const,
      message: "휴일 정보를 가져오는중 문제가 발생했습니다.",
    };
  }

  // console.log("schoolSchedule", schoolSchedule);

  // 1. 학교 스케줄 날짜를 현재 연도로 변경
  const updatedSchoolScheduleList = schoolSchedule.map((schedule) => {
    const updatedDate = dayjs(schedule.scheduleAt).year(currentYear);
    return {
      id: schedule.id,
      scheduleName: schedule.scheduleName,
      date: customDayjs(updatedDate).format("MM.DD.(ddd)"),
      from: "schedule" as const,
      scheduleTarget: schedule.scheduleTarget,
    };
  });

  // 2. 공휴일도 포맷팅
  const formattedHolidays = holiday.map((h) => ({
    id: h.id,
    scheduleName: h.holidayName,
    date: customDayjs(h.holidayAt).format("MM.DD.(ddd)"),
    from: "holiday" as const,
    scheduleTarget: "all",
  }));

  // 3. 공휴일 + 학교 스케줄 병합
  const merged = [...updatedSchoolScheduleList, ...formattedHolidays];

  // 4. 월별로 분류
  const formatted: MergedSchedule = {};
  merged.forEach((item) => {
    const month = item.date.slice(0, 2) + "월"; // "01월", "02월", ...
    if (!formatted[month]) {
      formatted[month] = [];
    }
    formatted[month].push(item);
  });

  // 4-1. 월별 배열 내 날짜 기준 정렬 (오름차순)
  Object.keys(formatted).forEach((month) => {
    formatted[month].sort((a, b) => {
      // a.date, b.date 포맷: "MM.DD.(ddd)"
      // MM은 동일한 월이라 1~2번째 문자 같음, 비교는 DD(3~4번째 문자) 기준으로 함
      // substring 으로 일(day) 부분만 추출
      const dayA = Number(a.date.slice(3, 5));
      const dayB = Number(b.date.slice(3, 5));
      return dayA - dayB;
    });
  });

  // 5. 월 정렬
  const sortedFormatted = Object.keys(formatted)
    .sort((a, b) => Number(a.replace("월", "")) - Number(b.replace("월", "")))
    .reduce((acc, key) => {
      acc[key] = formatted[key];
      return acc;
    }, {} as MergedSchedule);

  return {
    code: "SUCCESS" as const,
    message: "휴일 정보를 가져왔습니다.",
    result: sortedFormatted,
  };
}
