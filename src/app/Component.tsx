"use client";

import React, { useState } from "react";

const DATA = [
  {
    id: 1,
    list: [
      { id: 1, name: "코리", seq: 1 },
      { id: 2, name: "마리", seq: 3 },
    ],
  },
  {
    id: 2,
    list: [
      { id: 3, name: "아아", seq: 1 },
      { id: 4, name: "우우", seq: 3 },
      { id: 5, name: "오오", seq: 5 },
    ],
  },
];

export default function DraggableComponent() {
  const [data, setData] = useState(DATA);
  const [dropzoneIndex, setDropzoneIndex] = useState<boolean[][]>([[], []]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [currentRow, setCurrentRow] = useState<number | null>(null);

  const handleDragStart = (id: number, row: number) => {
    setDraggedId(id);
    setCurrentRow(row);
  };

  const handleDragEnd = () => {
    setDropzoneIndex([[], []]);
    setDraggedId(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const updateDropzoneIndex = (row: number, index: number, value: boolean) => {
    setDropzoneIndex((prev) => {
      const updatedDropzoneState = [...prev];
      updatedDropzoneState[row][index] = value;
      return updatedDropzoneState;
    });
  };

  const handleDragEnter = (row: number, index: number) => {
    if (currentRow === row) {
      updateDropzoneIndex(row, index, true);
    }
  };

  const handleDragLeave = (row: number, index: number) => {
    updateDropzoneIndex(row, index, false);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    row: number,
    index: number
  ) => {
    if (draggedId === null || currentRow !== row) {
      return;
    }
    event.preventDefault();

    const isExist = data[row].list.some((item) => item.seq === index + 1);

    if (isExist) {
      return;
    } else {
      setData((prev) =>
        prev.map((group, gIdx) => {
          if (gIdx === row) {
            return {
              ...group,
              list: group.list.map((item) =>
                item.id === draggedId ? { ...item, seq: index + 1 } : item
              ),
            };
          }
          return group;
        })
      );
    }

    setDropzoneIndex([[], []]);
    setDraggedId(null);
  };

  return (
    <div className="w-full h-full grid grid-cols-5">
      {data.map((el, rowIdx) =>
        Array.from({ length: 5 }).map((_, colIdx) => (
          <div key={rowIdx + colIdx} className="h-40 flex gap-2 py-2">
            <div
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(rowIdx, colIdx)}
              onDragLeave={() => handleDragLeave(rowIdx, colIdx)}
              onDrop={(e) => handleDrop(e, rowIdx, colIdx)}
              className={`w-full h-full bg-gray-300 border-x flex items-center justify-center ${
                dropzoneIndex[rowIdx][colIdx] ? "bg-gray-200" : ""
              }`}
            >
              {el.list
                .filter((item) => item.seq === colIdx + 1)
                .map((e) => (
                  <div
                    key={e.id}
                    draggable
                    onDragStart={() => handleDragStart(e.id, rowIdx)}
                    onDragEnd={handleDragEnd}
                    className="w-full h-full z-10 bg-pink-300 dark:text-black dark:bg-blue-300 cursor-pointer flex justify-center items-center"
                  >
                    {e.name}
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
