import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ContentsItem, {
  ItemProps,
} from "@/app/(main)/contents/components/ContentsItem";

const animateLayoutChanges = (args: any) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

interface Props extends Omit<ItemProps, "style" | "ref"> {}

const ContentsSortableItem = (props: Props) => {
  const {
    id,
    fileType,
    fileUrl,
    onClickDelete,
    isDragging: isDraggingProp,
    withOpacity,
    opacity,
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <ContentsItem
      onClickDelete={onClickDelete}
      ref={setNodeRef}
      id={id}
      fileType={fileType}
      fileUrl={fileUrl}
      isDragging={isDragging}
      withOpacity={withOpacity}
      opacity={opacity}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

export default ContentsSortableItem;
