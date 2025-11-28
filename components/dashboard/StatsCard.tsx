"use client";

import { useState } from "react";
import CardSaved from "../icons/CardSavedIcon";
import CardSpend from "../icons/CardSpendIcon";

interface StatsCardProps {
  title: string;
  value: string;
  icon: "saved" | "spend";
  isActive?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon,
  isActive = false
}: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const active = isHovered || isActive;

  const iconColor = active ? "#CAFF33" : "#363A3F";

  return (
    <div
      className={`
        rounded-2xl p-6 transition-all duration-300 ease-in-out min-h-[105px]
        ${active
          ? "bg-[#2F3438] shadow-lg"
          : "bg-gray-100 shadow-sm"
        }
        hover:scale-103 hover:shadow-xl
        cursor-pointer
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`
            w-14 h-14 rounded-full flex items-center justify-center shrink-0
            transition-all duration-300
            ${active
              ? "bg-[#3F4448]"
              : "bg-gray-200"
            }
          `}
        >
          {icon === "saved" ? (
            <CardSaved color={iconColor} width={24} height={24} />
          ) : (
            <CardSpend color={iconColor} width={24} height={24} />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <h3
            className={`
              text-md font-medium transition-colors duration-300 mb-2
              ${active ? "text-[#929EAE]" : "text-[#929EAE]"}
            `}
          >
            {title}
          </h3>
          <p
            className={`
              text-[27px] font-extrabold transition-colors duration-300
              ${active ? "text-white" : "text-gray-900"}
            `}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
