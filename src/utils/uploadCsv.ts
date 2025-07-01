import toast from "react-hot-toast";
import { z } from "zod";

/**
 * 한글 필드명을 영어 필드명으로 변환하는 함수
 *
 * 양식 통일과정에서 제공하는 CSV파일의 헤더 (컬럼명)가 한글임으로 키밸류로 영문으로 전환해서 사용
 */
const mapHeadersKoreanToEnglish = (header: string) => {
  const headerMap: { [key: string]: string } = {
    학생이름: "student_name",
    학년: "student_grade",
    반: "student_class",
    번호: "student_number",
    성별: "student_gender",
    학생사용여부: "student_status",
  };
  return headerMap[header] || header;
};
/**
 * uploadCsv 함수 동작
 *
 * 1. 파일 선택 (pickFiles 함수)
 * 2. 파일을 text로 변환 file.text()
 * 3. text를 Json 배열로 변환 및 json 배열을 반환
 * 3-1. 스키마를 통한 검증은 3번에서 Json배열이 생성된 시점에 진행합니다. readTextAsJson()함수 내부
 
 * 4. uploadCSV 함수 내부에서 (1, 2, 3 의 동작 수행)
 *
 * @param
 * 함수가 호출되는 컴포넌트에 따라서 받아야하는 csv데이터의 스키마가 다를수 있기때문에
 * const result = uploadCsv(스키마) 의 형식으로 스키마를 매개변수로 넣어줍니다.
 * 스키마는 기본적으로 z.Array(z.objcet({ name : z.string() , ... })) 의 형식으로 넣어주어야 합니다.
 * 
 * @returns
 * 매개변수로 넣어준 schema 타입의 json Array 반환
 *
 */

export default async function uploadCsv<Z extends z.ZodSchema>(schema: Z) {
  // 1. 파일 선택
  const pickFiles = async (): Promise<FileList> => {
    return new Promise<FileList>((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";

      input.onchange = function (event) {
        const files = (event.target as HTMLInputElement)?.files;

        if (files != null) {
          document.body.removeChild(input);
          resolve(files);
        } else {
          reject("file pick error");
        }
      };

      input.click();
      input.style.position = "absolute";
      input.style.top = "-9999px";
      document.body.appendChild(input);
    });
  };

  // 2. text => json 변환
  const readTextAsJson = (text: string) => {
    const lines = text?.split("\n")?.filter((line) => line?.trim() !== "");

    let headers = lines[0]?.replace(`"`, "")?.trim()?.split(",");
    headers = headers.map(mapHeadersKoreanToEnglish); // 헤더 변환

    const rows = lines?.slice(1);

    const jsonArray = rows?.map((row) => {
      const values = row
        ?.split(",")
        .map((value) =>
          value?.replace(/\r/g, "")?.trim()?.replace(/^"|"$/g, ""),
        );

      const jsonObject: { [key: string]: string } = {};

      headers.forEach((header, index) => {
        jsonObject[header] = values[index];
      });

      return jsonObject;
    });
    console.log("jsonArray", jsonArray);
    const result = schema.safeParse(jsonArray);

    if (!result.success) {
      toast.error(
        `${result.error.errors[0].path[1]} 형식이 올바르지 않습니다.`,
      );
      const defaultData = [{}]; // 기본값으로 빈 객체 배열 반환
      return defaultData as z.infer<Z>;
    }

    return result.data as z.infer<Z>;
  };

  // CSV 파일 파싱
  const files = await pickFiles();
  const file = files.item(0);

  if (file == null) {
    toast.error("파일을 선택해 주세요.");
    const defaultData = [{}]; // 기본값으로 빈 객체 배열 반환
    return defaultData as z.infer<Z>;
  }

  const text = await file.text();
  const result = readTextAsJson(text);

  return result;
}
