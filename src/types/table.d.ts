// types/table.d.ts 또는 프로젝트 내 d.ts 파일에 추가
import type { SxProps, Theme } from "@mui/material/styles";
import type { ColumnMeta } from "@tanstack/react-table";
import type { RowData } from "@tanstack/table-core";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    sx?: SxProps<Theme>;
  }
}
