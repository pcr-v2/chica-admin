// "use server";

// import dayjs from "dayjs";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";
// import weekday from "dayjs/plugin/weekday";
// import z from "zod";

// import { getRankPageStatisticSchema } from "@/app/actions/statistic/statisticSchema";
// import { mysqlPrisma } from "@/libs/prisma";

// dayjs.extend(utc);
// dayjs.extend(timezone);

// export type GetRankPageStatisticRequest = z.infer<
//   typeof getRankPageStatisticSchema
// >;

// export type GetRankPageStatisticResponse = Awaited<
//   ReturnType<typeof getRankPageStatistic>
// >;

// export async function getRankPageStatistic(
//   request: GetRankPageStatisticRequest,
// ) {
//   // 1. 요청 검증
//   const validated = getRankPageStatisticSchema.safeParse(request);
//   if (!validated.success) {
//     return {
//       code: "VALIDATION_ERROR" as const,
//       message: validated.error.issues[0].message,
//     };
//   }

//   const { schoolId, type } = validated.data;

//   // 오늘 날짜 문자열
//   const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

//   // 오늘 dayjs 객체 (한국 시간대가 필요하면 .tz("Asia/Seoul") 추가)
//   const today = dayjs(todayStr);

//   // 최근 7일 워킹데이(평일) 구하는 함수 (오늘 포함 역순)
//   function getLast7WorkingDays(todayStr: string): string[] {
//     const dates: string[] = [];
//     let date = dayjs(todayStr);

//     for (let i = 0; i < 14 && dates.length < 7; i++) {
//       const day = date.day(); // 0=일요일, 6=토요일
//       if (day !== 0 && day !== 6) {
//         dates.push(date.format("YYYY-MM-DD"));
//       }
//       date = date.subtract(1, "day");
//     }

//     return dates.reverse();
//   }

//   const last7WorkingDays = getLast7WorkingDays(todayStr);

//   // holiday 체크 (오늘 날짜)
//   // dayjs(todayStr).toDate() 사용
//   const isHoliday = await mysqlPrisma.holiday.findFirst({
//     where: {
//       holidayStatus: true,
//       holidayAt: dayjs(todayStr).toDate(),
//     },
//   });

//   if (isHoliday) {
//     return {
//       code: "SUCCESS" as const,
//       data: {
//         unCheckedListRaw: [],
//         studentRankArray: [],
//         type,
//         start: "",
//         end: today.format("YYYY-MM-DD"),
//       },
//     };
//   }

//   // 오늘 유효한 스케줄 조회 (복수)
//   const schedules = await mysqlPrisma.schedules.findMany({
//     where: {
//       schoolId: schoolId,
//       scheduleStatus: true,
//       scheduleAt: new Date(todayStr),
//     },
//     select: {
//       scheduleTarget: true,
//       schoolId: true,
//     },
//   });

//   // console.log("schedules", schedules);

//   type ExcludeMap = Map<string, number[] | "all">;
//   const excludeMap: ExcludeMap = new Map();

//   for (const schedule of schedules) {
//     if (schedule.scheduleTarget === "all") {
//       excludeMap.set(schedule.schoolId, "all");
//     } else {
//       const targets = schedule.scheduleTarget
//         .split(/[\s,]+/)
//         .map((x) => Number(x.trim()))
//         .filter((x) => !isNaN(x));
//       const prev = excludeMap.get(schedule.schoolId);
//       if (prev === "all") {
//         excludeMap.set(schedule.schoolId, "all");
//       } else {
//         excludeMap.set(
//           schedule.schoolId,
//           prev ? [...prev, ...targets] : targets,
//         );
//       }
//     }
//   }

//   // console.log("excludeMap", excludeMap);

//   // 제외조건을 SQL WHERE 절로 변환
//   function buildExcludeConditionSQL(excludeMap: ExcludeMap): string {
//     if (excludeMap.size === 0) return "1=1";
//     const conditions: string[] = [];
//     for (const [schoolId, excludeGrades] of excludeMap.entries()) {
//       if (excludeGrades === "all") {
//         conditions.push(`NOT (s.school_id = '${schoolId}')`);
//       } else {
//         const gradesStr = excludeGrades.join(",");
//         conditions.push(
//           `NOT (s.school_id = '${schoolId}' AND s.student_grade IN (${gradesStr}))`,
//         );
//       }
//     }
//     return conditions.length > 0 ? conditions.join(" AND ") : "1=1";
//   }
//   const excludeConditionSQL = buildExcludeConditionSQL(excludeMap);
//   const last7WorkingDaysStr = last7WorkingDays.map((d) => `'${d}'`).join(",");

//   // 최근 7일 워킹데이 중 brushed_status = 'No' 학생 조회 (exclude 조건 반영)
//   const unCheckedListRaw = await mysqlPrisma.$queryRawUnsafe<
//     {
//       student_id: string;
//       student_name: string;
//       student_grade: number;
//       student_number: number;
//       student_class: string;
//       student_gender: "male" | "female";
//       brushed_at: Date;
//     }[]
//   >(
//     `
//     SELECT
//       s.student_id,
//       s.student_name,
//       s.student_grade,
//       s.student_class,
//       s.student_number,
//       s.student_gender,
//       MAX(b.brushed_at) AS brushed_at
//     FROM Student s
//     JOIN Brushed b ON s.student_id = b.student_id
//     WHERE b.brushed_status = 'No'
//       AND s.school_id = ?
//       AND DATE(b.brushed_at) IN (${last7WorkingDaysStr})
//       AND s.student_status = true
//     GROUP BY s.student_id, s.student_name, s.student_grade, s.student_class, s.student_gender, s.student_number
//     ORDER BY student_grade ASC, CAST(student_class AS UNSIGNED) ASC, student_number ASC
//   `,
//     schoolId,
//   );

//   // console.log("unCheckedListRaw", unCheckedListRaw);

//   // schoolId 조건 포함한 첫 출석일 구하는 함수 (raw 쿼리)
//   async function getFirstWorkingDay(startDate: dayjs.Dayjs) {
//     const res = await mysqlPrisma.$queryRawUnsafe<{ brushedAt: Date }[]>(
//       `
//         SELECT b.brushed_at AS brushedAt
//         FROM Brushed b
//         JOIN Student s ON b.student_id = s.student_id
//         WHERE s.school_id = ?
//           AND b.brushed_status IN ('Ok', 'No')
//           AND b.brushed_at BETWEEN ? AND ?
//         ORDER BY b.brushed_at ASC
//         LIMIT 1
//       `,
//       schoolId,
//       startDate.toDate(),
//       today.endOf("day").toDate(),
//     );
//     if (res.length === 0) return startDate;
//     return dayjs.utc(res[0].brushedAt).startOf("day");
//   }

//   let periodStart: dayjs.Dayjs;
//   if (type === "month") {
//     const firstDayOfMonth = today.startOf("month");
//     periodStart = await getFirstWorkingDay(firstDayOfMonth);
//   } else if (type === "term") {
//     const month = today.month() + 1;
//     let termStart: dayjs.Dayjs;
//     if (month >= 1 && month <= 7) {
//       termStart = dayjs.utc(new Date(today.year(), 0, 1));
//     } else {
//       termStart = dayjs.utc(
//         new Date(month >= 8 ? today.year() : today.year() - 1, 7, 1),
//       );
//     }
//     periodStart = await getFirstWorkingDay(termStart);
//   } else {
//     return {
//       code: "INVALID_TYPE" as const,
//       message: `지원하지 않는 통계 타입입니다: ${type}`,
//     };
//   }

//   const gteDate = periodStart.toDate();
//   const lteDate = today.endOf("day").toDate();

//   // console.log("날짜", gteDate, lteDate);

//   // 1. 학생별 양치율 상위 30명 (학교 전체)
//   const studentRankArrayRaw = await mysqlPrisma.$queryRawUnsafe<
//     {
//       brushed_at: Date;
//       student_id: string;
//       student_name: string;
//       student_grade: number;
//       student_class: string;
//       student_number: number;
//       percentage: number;
//       student_rank: number;
//       student_gender: "male" | "female";
//     }[]
//   >(
//     `
//     WITH StudentStats AS (
//       SELECT
//         b.brushed_at,
//         s.student_id,
//         s.student_name,
//         s.student_grade,
//         s.student_class,
//         s.student_number,
//         s.student_gender,
//         ROUND(
//           IF(
//             COUNT(CASE WHEN b.brushed_status IN ('Ok', 'No') THEN 1 END) = 0,
//             0,
//             SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) / COUNT(CASE WHEN b.brushed_status IN ('Ok', 'No') THEN 1 END) * 100
//           ),
//           1
//         ) AS percentage
//       FROM Student s
//       LEFT JOIN Brushed b ON s.student_id = b.student_id
//         AND b.brushed_at BETWEEN ? AND ?
//       WHERE s.school_id = ?
//       GROUP BY s.student_id, s.student_name, s.student_grade, s.student_class, s.student_gender, s.student_number
//     ),
//     RankedStudents AS (
//       SELECT
//         brushed_at,
//         student_id,
//         student_name,
//         student_grade,
//         student_class,
//         student_gender,
//         student_number,
//         percentage,
//         DENSE_RANK() OVER (ORDER BY percentage DESC) AS student_rank
//       FROM StudentStats
//     )
//     SELECT *
//     FROM RankedStudents
//     WHERE student_rank <= 30
//     ORDER BY student_rank ASC, student_grade ASC, CAST(student_class AS UNSIGNED) ASC, student_number ASC, student_name
//   `,
//     gteDate,
//     lteDate,
//     schoolId,
//   );

//   const brushedAtList = Array.from(
//     new Set(
//       studentRankArrayRaw
//         .filter((item) => item.brushed_at) // null/undefined 방지
//         .map((item) => dayjs(item.brushed_at).format("YYYY년 M월")),
//     ),
//   );

//   const studentRankArray = studentRankArrayRaw.map((item) => ({
//     ...item,
//     percentage: Number(item.percentage),
//     brushedAt: dayjs(item.brushed_at).format("YYYY년 M월"),
//   }));

//   // console.log("studentRankArray", studentRankArray);

//   return {
//     code: "SUCCESS" as const,
//     data: {
//       type,
//       start: periodStart.format("YYYY-MM-DD"),
//       end: today.format("YYYY-MM-DD"),

//       studentRankArray,
//       unCheckedListRaw,
//       brushedAtList,
//     },
//   };
// }
