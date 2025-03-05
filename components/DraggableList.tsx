import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Fragment, memo, useCallback, useEffect, useState } from "react";

type Item = {
  id: string;
};

interface DraggableListProps<T extends Item>
  extends Omit<Omit<DragDropContextProps, "children">, "onDragEnd"> {
  droppableId: string;
  items: T[];
  renderItem: (item: T, provided: DraggableProvided) => React.ReactNode;
  onDragEnd: (result: T[]) => void;
  listStyle?: React.CSSProperties;
  listClassName?: string;
}

export default function DraggableList<T extends Item>({
  droppableId,
  items,
  renderItem,
  onDragEnd,
  listClassName,
  listStyle,
  ...props
}: DraggableListProps<T>) {
  const [itemsOrder, setItemsOrder] = useState<T[]>(items);

  const handleDragEnd = useCallback(
    (result: DropResult<string>) => {
      if (!result.destination) {
        return;
      }

      const newItems: T[] = reorder(
        itemsOrder,
        result.source.index,
        result.destination.index
      );

      setItemsOrder(newItems);
      onDragEnd(newItems);
    },
    [itemsOrder, onDragEnd]
  );

  useEffect(() => {
    setItemsOrder(items);
  }, [items]);

  const renderList = useCallback(() => {
    return itemsOrder.map((input, index) => (
      <Draggable key={input.id} draggableId={`item-${input.id}`} index={index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            {renderItem(input, provided)}
          </div>
        )}
      </Draggable>
    ));
  }, [itemsOrder, renderItem, items]);

  return (
    <DragDropContext {...props} onDragEnd={handleDragEnd}>
      <Droppable droppableId={droppableId}>
        {(droppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={listClassName}
            style={listStyle}
          >
            {renderList()} 
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const reorder = <T extends Item>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
