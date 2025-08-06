"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, styled } from "@mui/material";
import { useCallback, useState } from "react";

import ContentsAdd from "@/app/(main)/contents/components/ContentsAdd";
import ContentsDesc from "@/app/(main)/contents/components/ContentsDesc";
import ContentsItem from "@/app/(main)/contents/components/ContentsItem";
import ContentsSortableItem from "@/app/(main)/contents/components/ContentsSortableItem";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { GetContentsListResponse } from "@/app/actions/contents/getContentsListAction";
import DeleteIcon from "@/public/images/icons/delete-icon.svg";

interface IProps {
  me: GetMeResponse;
  contentsList: GetContentsListResponse["result"];
}

export default function ContentsContainer(props: IProps) {
  const { me, contentsList } = props;
  console.log("contentsList", contentsList);

  const [items, setItems] = useState(
    Array.from({ length: 0 }, (_, i) => (i + 1).toString()),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as any);
        const newIndex = items.indexOf(over!.id as any);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <Wrapper>
      <ContentWrap>
        <ContentsDesc />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <ContentsWrap>
              <ContentsAdd onClick={() => {}} />

              {items.map((id) => (
                <ContentsSortableItem key={id} id={id} />
              ))}
            </ContentsWrap>
          </SortableContext>

          <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
            {activeId ? <ContentsItem id={activeId} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </ContentWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "60px",
    width: "100%",
    display: "flex",
    borderRadius: "24px",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "32px 28px 32px",
    minHeight: "calc(100dvh - 134px)",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    gap: "40px",
    flex: 1,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const Delete = styled(DeleteIcon)(() => ({
  width: "40px",
  height: "40px",
  padding: "6px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "1px solid #F3F3F3",
  path: {
    fill: "#747D8A",
  },
}));

const ContentsWrap = styled(Box)(() => {
  return {
    gap: "24px",
    margin: "auto",
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "1364px",
    justifyContent: "center",
  };
});

const TimeSpan = styled("span")(() => {
  return {
    fontSize: 18,
    fontWeight: 400,
    color: "#D5D7DB",
  };
});
