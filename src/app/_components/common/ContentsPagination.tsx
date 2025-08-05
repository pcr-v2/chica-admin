import { Box, styled } from "@mui/material";

import First from "@/public/images/icons/pagination/pagi-arrow-first.svg";
import Last from "@/public/images/icons/pagination/pagi-arrow-last.svg";
import Next from "@/public/images/icons/pagination/pagi-arrow-next.svg";
import Prev from "@/public/images/icons/pagination/pagi-arrow-prev.svg";

interface IProps {
  isEmpty: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;

  // 외부에서 전달받는 버튼 핸들러
  onClickFirst: () => void;
  onClickPrev: () => void;
  onClickNext: () => void;
  onClickLast: () => void;

  // 외부에서 전달받는 버튼 상태
  disableFirst: boolean;
  disablePrev: boolean;
  disableNext: boolean;
  disableLast: boolean;
}

export default function ContentsPagination({
  isEmpty,
  totalPages,
  currentPage,
  onPageChange,
  onClickFirst,
  onClickPrev,
  onClickNext,
  onClickLast,
  disableFirst,
  disablePrev,
  disableNext,
  disableLast,
}: IProps) {
  const currentGroup = Math.floor(currentPage / 5);
  const startPage = currentGroup * 5;
  const endPage = Math.min(startPage + 5, totalPages);

  return (
    <Wrapper>
      <PrevBox>
        <FirstArrow onClick={onClickFirst} disabled={disableFirst} />
        <PrevArrow onClick={onClickPrev} disabled={disablePrev} />
      </PrevBox>
      <NumberBox>
        {Array.from({ length: Math.max(endPage - startPage, 1) }, (_, i) => {
          const pageIndex = startPage + i;

          return (
            <PageNumber
              key={pageIndex}
              active={(pageIndex === currentPage).toString()}
              onClick={() => onPageChange(pageIndex)}
            >
              <span>{pageIndex + 1}</span>
            </PageNumber>
          );
        })}
      </NumberBox>
      <NextBox>
        <NextArrow onClick={onClickNext} disabled={disableNext} />
        <LastArrow onClick={onClickLast} disabled={disableLast} />
      </NextBox>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => ({
  gap: "8px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const PrevBox = styled(Box)(() => ({
  gap: "4px",
  display: "flex",
  alignItems: "center",
}));

const NextBox = styled(Box)(() => ({
  gap: "4px",
  display: "flex",
  alignItems: "center",
}));

const NumberBox = styled(Box)(() => ({
  gap: "6px",
  display: "flex",
  alignItems: "center",
}));

const PageNumber = styled(Box)<{ active: string }>(({ active }) => {
  const isActive = active === "true";
  return {
    width: "32px",
    height: "32px",
    display: "flex",
    fontWeight: 500,
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "4px",
    alignItems: "center",
    justifyContent: "center",
    color: isActive ? "#13BA81" : "#747D8A",
    backgroundColor: isActive ? "#EDFCF7" : "transparent",
  };
});

const FirstArrow = styled(First)(() => ({
  width: "24px",
  height: "24px",
  cursor: "pointer",
  path: {
    fill: "#747D8A",
  },
}));

const PrevArrow = styled(Prev)(() => ({
  width: "24px",
  height: "24px",
  cursor: "pointer",
  path: {
    fill: "#747D8A",
  },
}));

const NextArrow = styled(Next)(() => ({
  width: "24px",
  height: "24px",
  cursor: "pointer",
  path: {
    fill: "#747D8A",
  },
}));

const LastArrow = styled(Last)(() => ({
  width: "24px",
  height: "24px",
  cursor: "pointer",
  path: {
    fill: "#747D8A",
  },
}));
