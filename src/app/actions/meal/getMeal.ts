// lib/testMealFetch.ts
export const fetchTestMealData = async () => {
  const key = process.env.NEIS_API_KEY; // .env.local에 저장된 인증키
  const baseUrl = "https://open.neis.go.kr/hub/mealServiceDietInfo";

  const params = new URLSearchParams({
    KEY: key ?? "",
    Type: "json",
    ATPT_OFCDC_SC_CODE: "S10", // 경기도교육청 예시
    SD_SCHUL_CODE: "9022058", // 학교 코드
    MLSV_FROM_YMD: "20250701", // 시작일
    MLSV_TO_YMD: "20250701", // 종료일
    MMEAL_SC_CODE: "2", // 중식
  });

  const res = await fetch(`${baseUrl}?${params.toString()}`);
  const data = await res.json();
  return data;
};
