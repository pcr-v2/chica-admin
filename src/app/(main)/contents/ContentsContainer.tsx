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
import { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<
    { id: string; type: "image" | "video"; url: string }[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["video/mp4", "image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("지원하지 않는 파일 형식입니다.");
      return;
    }

    const id = uuidv4();
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : "image";

    setItems((prev) => [...prev, { id, type, url }]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하도록 초기화
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over!.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }, []);

  console.log("item", items);

  const handleDelete = (deleteId: string) => {
    console.log("deleteId", deleteId);
    if (deleteId == null || deleteId === "") return;

    const newItems = items.filter((el) => el.id !== deleteId);

    setItems(newItems);
  };

  return (
    <Wrapper>
      <ContentWrap>
        <ContentsDesc />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <ContentsWrap>
              <ContentsAdd onClick={handleAddClick} />

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="video/mp4,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
              />

              {items.map((item) => (
                <ContentsSortableItem
                  key={item.id}
                  id={item.id}
                  fileType={item.type}
                  fileUrl={item.url}
                  onClickDelete={() => handleDelete(item.id)}
                />
              ))}
            </ContentsWrap>
          </SortableContext>

          <DragOverlay adjustScale style={{ transformOrigin: "0 0" }}>
            {activeId
              ? (() => {
                  const activeItem = items.find((item) => item.id === activeId);
                  if (!activeItem) return null;

                  return (
                    <ContentsItem
                      id={activeId}
                      isDragging
                      fileType={activeItem.type}
                      fileUrl={activeItem.url}
                      onClickDelete={() => handleDelete(activeItem.id)}
                    />
                  );
                })()
              : null}
          </DragOverlay>
        </DndContext>
      </ContentWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    // flex: 1,
    flexGrow: 1,
    gap: "60px",
    // height: "100%",
    width: "100%",
    display: "flex",
    borderRadius: "24px",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "32px 28px 32px",
    justifyContent: "flex-start",
    // alignItems: "center",
    // minHeight: "calc(100dvh - 134px)",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    // flex: 1,
    flexGrow: 1,
    gap: "40px",
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
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    border: "1px solid red",
    // maxWidth: "1364px",
    alignItems: "start",
    justifyContent: "start",
  };
});

const TimeSpan = styled("span")(() => {
  return {
    fontSize: 18,
    fontWeight: 400,
    color: "#D5D7DB",
  };
});
