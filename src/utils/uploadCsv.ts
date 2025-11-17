import toast from "react-hot-toast";
import { z } from "zod";

/**
 * 한글 필드명을 영어 필드명으로 변환하는 함수
 *
 * 양식 통일과정에서 제공하는 CSV파일의 헤더 (컬럼명)가 한글임으로 키밸류로 영문으로 전환해서 사용
 */
const headerAliases: Record<string, string[]> = {
  studentName: ["이름", "학생이름", "성명", "학생명"],
  studentGrade: ["학년"],
  studentClass: ["반", "학급"],
  studentNumber: ["번호", "출석번호"],
  studentGender: ["성별"],
  studentStatus: ["학생사용여부", "사용여부"],
};

const mapHeadersKoreanToEnglish = (header: string) => {
  const normalized = header.trim().replace(/"/g, "");

  for (const [key, candidates] of Object.entries(headerAliases)) {
    if (candidates.includes(normalized)) return key;
  }

  return normalized;
};

/**
 * 인코딩 자동 감지 후 텍스트로 변환
 * - UTF-8 우선 시도
 * - 깨지면 EUC-KR(CP949)로 재시도
 */
const readFileWithSmartEncoding = async (file: File) => {
  const buffer = await file.arrayBuffer();

  // 1) UTF-8 우선 디코딩
  let text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);

  // 2) 깨짐 여부 판단 (� replacement character 등장)
  const broken = (text.match(/�/g)?.length ?? 0) > 3;

  // 3) 깨졌으면 EUC-KR로 다시 디코딩
  if (broken) {
    text = new TextDecoder("euc-kr").decode(buffer);
  }

  return text;
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
  /**
   * 파일 선택 UI
   */
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

  /**
   * CSV 텍스트 → JSON 배열 변환
   */
  const readTextAsJson = (text: string) => {
    const lines = text?.split("\n")?.filter((line) => line?.trim() !== "");
    if (!lines || lines.length === 0) return [{}] as z.infer<Z>;

    let headers = lines[0]?.replace(`"`, "")?.trim()?.split(",");
    headers = headers.map(mapHeadersKoreanToEnglish);

    const rows = lines.slice(1);

    const jsonArray = rows.map((row) => {
      const values = row
        .split(",")
        .map((v) => v.replace(/\r/g, "").trim().replace(/^"|"$/g, ""));

      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = values[i];
      });

      return obj;
    });

    const result = schema.safeParse(jsonArray);

    if (!result.success) {
      toast.error(
        `${result.error.errors[0].path[1]} 형식이 올바르지 않습니다.`,
      );
      return [{}] as z.infer<Z>;
    }

    return result.data as z.infer<Z>;
  };

  // 1) 파일 선택
  const files = await pickFiles();
  const file = files.item(0);

  if (file == null) {
    toast.error("파일을 선택해 주세요.");
    return [{}] as z.infer<Z>;
  }

  // 2) 인코딩 자동 감지로 텍스트 변환
  const text = await readFileWithSmartEncoding(file);
  console.log(text);
  // 3) CSV → JSON 변환 + 스키마 검증
  return readTextAsJson(text);
}
