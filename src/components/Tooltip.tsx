import React, { ReactNode, useId } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const id = useId(); // 유일한 id 생성

  return (
    <>
      <span
        data-tooltip-id={id}
        className="cursor-help inline-block align-middle"
      >
        {children}
      </span>
      <ReactTooltip
        id={id}
        place="top"
        content={content}
        className="text-xs z-50"
      />
    </>
  );
};

export default Tooltip;
