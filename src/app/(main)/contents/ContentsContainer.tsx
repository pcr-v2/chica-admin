"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  PointerSensor,
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
import { Box, Button, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import ContentsAdd from "@/app/(main)/contents/components/ContentsAdd";
import ContentsControlBar from "@/app/(main)/contents/components/ContentsControlBar";
import ContentsDesc from "@/app/(main)/contents/components/ContentsDesc";
import ContentsItem from "@/app/(main)/contents/components/ContentsItem";
import ContentsSortableItem from "@/app/(main)/contents/components/ContentsSortableItem";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { deleteFileFromS3 } from "@/app/actions/contents/deleteFileFromS3";
import {
  getContentsList,
  GetContentsListResponse,
} from "@/app/actions/contents/getContentsListAction";
import { getPresignedUploadUrl } from "@/app/actions/contents/getPresignedUploadUrl";
import { saveMetaToDB } from "@/app/actions/contents/saveMetaToDB";
import { updateSeq } from "@/app/actions/contents/updateSeq";
import { uploadFilesToS3 } from "@/app/actions/contents/uploadFilesToS3";
import DeleteIcon from "@/public/images/icons/delete-icon.svg";

type FileType = "image" | "video";

interface IItem {
  id: string; // 서버에서 받아온 경우 숫자형 id도 string으로 변환해서 사용
  type: FileType;
  url: string; // CloudFront URL or ObjectURL
  fileName?: string; // 서버에서 온 데이터용 (uuid 부분)
  fileType?: string; // 확장자 (jpeg, mp4 등)
  schoolId?: string;
  seq?: number;
  contentsStatus?: boolean;
  file?: File; // 업로드할 때 클라이언트에서만 존재
}

interface IProps {
  me: GetMeResponse;
  contentsList: GetContentsListResponse;
}

export default function ContentsContainer(props: IProps) {
  const { me, contentsList } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  // 초기값 세팅: 서버에서 받은 contentsList를 IItem[] 형태로 매핑
  const [items, setItems] = useState<IItem[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const queryKey = ["contentsList"];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      getContentsList({
        schoolId: me.data?.schoolId!,
      }),
    initialData: contentsList,
    staleTime: 0,
  });

  useEffect(() => {
    if (data.result) {
      setItems(
        data.result.map((content) => ({
          id: content.id.toString(),
          type: content.fileType === "mp4" ? "video" : "image",
          url: `${process.env.NEXT_PUBLIC_AWS_CLOUD_FRONT_KEY}/${content.schoolId}/${content.fileName}.${content.fileType}`,
          fileName: content.fileName,
          fileType: content.fileType,
          schoolId: content.schoolId,
          seq: content.seq,
          contentsStatus: content.contentsStatus,
        })),
      );

      const sumedContentsSize = data.result.reduce(
        (sum, file) => sum + Number(file.fileSize),
        0,
      );

      setTotalSize(sumedContentsSize);
    }
  }, [data]);

  const [activeId, setActiveId] = useState<string | null>(null);

  // const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
      // 여기서 data-no-dnd 속성이 있으면 드래그 시작 무시
      onStart: (event: any) => {
        const target = event?.nativeEvent?.target as HTMLElement;
        if (target?.closest("[data-no-dnd]")) {
          throw new Error("Drag cancelled"); // 강제 취소
        }
      },
    }),
  );

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video");
    const maxVideoSize = 30 * 1024 * 1024; // 30MB
    const maxImageSize = 10 * 1024 * 1024; // 10MB

    if (isVideo && file.size > maxVideoSize) {
      toast.error("30MB 이상의 영상 파일은 업로드할 수 없습니다.");
      return;
    }

    if (!isVideo && file.size > maxImageSize) {
      toast.error("10MB 이상의 이미지 파일은 업로드할 수 없습니다.");
      return;
    }

    const allowedTypes = ["video/mp4", "image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("지원하지 않는 파일 형식입니다.");
      return;
    }

    const id = uuidv4();
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : "image";

    setItems((prev) => [...prev, { id, type, url, file }]);
    e.target.value = "";
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

        const newItems = arrayMove(items, oldIndex, newIndex);

        const seqData = newItems.map((item, index) => ({
          id: Number(item.id),
          seq: index + 1,
        }));

        updateSeq(seqData);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }, []);

  const handleDelete = (deleteId: string) => {
    // console.log("deleteId", deleteId);

    if (!deleteId) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteId));
  };

  // const handleUpload = async () => {
  //   if (!items.length) {
  //     toast.error("업로드할 파일이 없습니다.");
  //     return;
  //   }

  //   // console.log("items", items);

  //   const formData = new FormData();
  //   for (const item of items) {
  //     if (item.file) {
  //       formData.append("files", item.file);
  //     }
  //   }

  //   const res = await uploadFilesToS3({
  //     formData,
  //     schoolId: me.data?.schoolId as string,
  //   });

  //   // console.log("S3 업로드 완료:", uploadedUrls);

  //   toast.success("업로드 완료!");
  //   queryClient.invalidateQueries({
  //     queryKey: ["contentsList"],
  //   });
  // };

  const handleUpload = async () => {
    if (!items.length || items == null) {
      toast.error("업로드할 파일이 없습니다.");
      return;
    }

    // 1. 각 파일별 presigned URL 요청
    const presignedUrls = await Promise.all(
      items.map(async (item) => {
        if (!item.file) return null;
        return await getPresignedUploadUrl({
          fileName: item.file.name,
          fileType: item.file.type,
          schoolId: me.data?.schoolId as string,
          customUuid: item.id, // 프론트에서 만든 uuid를 그대로 전달
        });
      }),
    );

    // 2. S3에 직접 업로드
    await Promise.all(
      presignedUrls.map(async (presigned, idx) => {
        if (!presigned) return;

        await fetch(presigned.url, {
          method: "PUT",
          headers: {
            "Content-Type": items[idx]?.file?.type ?? "",
          },
          body: items[idx].file,
        });
      }),
    );

    const filteredPresignedUrls = presignedUrls.filter(
      (p): p is { url: string; key: string } => p !== null,
    );

    console.log("filteredPresignedUrls", filteredPresignedUrls);

    // 3. DB에 메타 저장: 서버 액션 호출해서 key 리스트 전달
    const uploadedMeta = filteredPresignedUrls.map(({ key }) => {
      const id = key.split("/")[1].split(".")[0];
      const matchedItem = items.find((i) => i.id === id);
      console.log("matchedItem", matchedItem);
      return {
        fileName: id, // UUID만
        fileType: key.split(".").pop(),
        fileSize: matchedItem
          ? Number(((matchedItem.file?.size ?? 0) / (1024 * 1024)).toFixed(2))
          : 0,
        userFileName: matchedItem ? matchedItem.file?.name.split(".")[0] : "",
      };
    });
    console.log("uploadedMeta", uploadedMeta);
    console.log("file", items);

    const res = await saveMetaToDB({
      schoolId: me.data?.schoolId as string,
      files: uploadedMeta,
    });

    if (res.code === "SUCCESS") {
      toast.success("업로드 및 DB 저장 완료!");
      queryClient.invalidateQueries({ queryKey: ["contentsList"] });
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteTest = async (request: {
    deleteId: string;
    fileType: string;
  }) => {
    const { deleteId, fileType } = request;
    // console.log("deleteId", deleteId);
    const res = await deleteFileFromS3({
      keys: [deleteId],
      schoolId: me.data?.schoolId as string,
      fileType: fileType,
    });

    if (res?.code === "FAIL") {
      toast.error(res.message);
    }

    toast.success(res?.message as string);

    // 로컬 상태 즉시 반영
    setItems((prev) => prev.filter((item) => item.fileName !== deleteId));

    // 서버 데이터도 새로 받아오기
    queryClient.refetchQueries({
      queryKey: ["contentsList"],
    });
  };

  return (
    <Wrapper>
      <ContentWrap>
        <ContentsControlBar
          totalSize={Number(totalSize.toFixed(2))}
          contentsLength={data.result?.length ?? 0}
          handleUpdloadFiles={handleUpload}
        />

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
            <SortSection>
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
                  onClickDelete={() =>
                    handleDeleteTest({
                      deleteId: item.fileName as string,
                      fileType: item.fileType as string,
                    })
                  }
                />
              ))}
            </SortSection>
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
    flexGrow: 1,
    gap: "60px",
    width: "100%",
    display: "flex",
    minHeight: "100%",
    alignItems: "start",
    borderRadius: "24px",
    justifyContent: "start",
    backgroundColor: "#fff",
    padding: "32px 28px 32px",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    flexGrow: 1,
    gap: "40px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const SortSection = styled(Box)(() => {
  return {
    gap: "24px",
    flexWrap: "wrap",
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
  };
});

// const Delete = styled(DeleteIcon)(() => ({
//   width: "40px",
//   height: "40px",
//   padding: "6px",
//   cursor: "pointer",
//   borderRadius: "8px",
//   border: "1px solid #F3F3F3",
//   path: {
//     fill: "#747D8A",
//   },
// }));

// const TimeSpan = styled("span")(() => {
//   return {
//     fontSize: 18,
//     fontWeight: 400,
//     color: "#D5D7DB",
//   };
// });
