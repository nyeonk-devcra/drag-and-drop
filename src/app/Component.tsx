"use client";

import React, { useState } from "react";

const DATA = [
  { id: 1, name: "코리", seq: 1 },
  { id: 2, name: "마리", seq: 3 },
];

export default function DraggableComponent() {
  const [data, setData] = useState(DATA);
  const [dropzoneIndex, setDropzoneIndex] = useState<number | null>(null); // 드롭존의 index 값 (드롭 영역 구분을 위해 사용)
  const [draggedId, setDraggedId] = useState<number | null>(null); // 드래그 중인 요소의 Id 값

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDropzoneIndex(null);
    setDraggedId(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (index: number) => {
    setDropzoneIndex(index);
  };

  const handleDragLeave = () => {
    setDropzoneIndex(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>, index: number) => {
    if (draggedId === null) {
      return;
    }
    event.preventDefault();

    const isExist = data.some((item) => item.seq === index + 1);
    if (isExist) {
      return;
    } else {
      setData((prev) =>
        prev.map((item) =>
          item.id === draggedId ? { ...item, seq: index + 1 } : item
        )
      );
    }

    setDropzoneIndex(null);
    setDraggedId(null);
  };

  return (
    <div className="w-full h-40 flex gap-2 py-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(i)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, i)}
          className={`w-full h-full bg-gray-300 border-x flex items-center justify-center ${
            dropzoneIndex === i ? "bg-gray-200" : ""
          }`}
        >
          {data
            .filter((data) => data.seq == i + 1)
            .map((e) => (
              <div
                key={e.id}
                draggable
                onDrag={handleDragOver}
                onDragStart={() => handleDragStart(e.id)}
                onDragEnd={handleDragEnd}
                className="w-full h-full z-10 bg-pink-300 cursor-pointer flex justify-center items-center"
              >
                {e.name}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
