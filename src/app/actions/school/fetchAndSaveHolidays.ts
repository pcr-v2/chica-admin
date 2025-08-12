"use server";

import dayjs from "dayjs";

import { mysqlPrisma } from "@/libs/prisma";

type RawHoliday = {
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: number;
  seq: number;
};

type Holiday = {
  dateName: string;
  date: string; // YYYY-MM-DD
};

const formatHolidays = (rawHolidays: RawHoliday[]): Holiday[] => {
  return rawHolidays.map(({ dateName, locdate }) => {
    const name = dateName === "기독탄신일" ? "크리스마스" : dateName;
    const date = dayjs(String(locdate), "YYYYMMDD").format("YYYY-MM-DD");
    return {
      dateName: name,
      date,
    };
  });
};

export const fetchAndSaveHolidays = async () => {
  const currentYear = dayjs().year();
  const key = process.env.HOILYDAY_API_KEY?.trim();
  const encodedKey = encodeURIComponent(key!);
  const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${encodedKey}&solYear=${currentYear}&numOfRows=1000&_type=json`;

  // 1. API 호출
  const res = await fetch(url);
  const text = await res.text();
  // console.log("raw text:", text);

  let rawHolidays: RawHoliday[] = [];

  try {
    const data = JSON.parse(text);
    rawHolidays = data.response?.body?.items?.item ?? [];
    // console.log("공휴일 데이터 (가공 전):", rawHolidays);
  } catch (e) {
    console.error("JSON 파싱 실패");
    throw new Error("응답이 JSON 형식이 아님");
  }

  // 2. 가공
  const holidays = formatHolidays(rawHolidays);

  // 3. DB 저장 로직
  // 3-1. 현재 연도 데이터 존재 여부 체크
  const exists = await mysqlPrisma.holiday.findFirst({
    where: {
      holidayAt: {
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`),
      },
      holidayStatus: true,
    },
  });

  if (exists) {
    throw new Error(`${currentYear}년도 휴일 데이터가 이미 존재합니다.`);
  }

  // 3-2. 트랜잭션 시작
  await mysqlPrisma.$transaction(async (trx) => {
    // 이전 모든 연도 휴일 holiday_status true → false
    await trx.holiday.updateMany({
      where: {
        holidayStatus: true,
      },
      data: {
        holidayStatus: false,
      },
    });

    // 현재 연도 휴일 삽입
    await trx.holiday.createMany({
      data: holidays.map(({ dateName, date }) => ({
        holidayName: dateName,
        holidayAt: new Date(date),
        holidayStatus: true,
      })),
      skipDuplicates: true,
    });
  });

  return { message: `${currentYear}년도 공휴일 DB 저장 완료` };
};
