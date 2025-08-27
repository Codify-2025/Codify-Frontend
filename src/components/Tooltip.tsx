import React, { useState } from 'react';
import classNames from 'classnames';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'top',
  className,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={classNames('relative inline-flex align-middle', className)}
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span
        role="tooltip"
        className={classNames(
          'pointer-events-none absolute z-[9999] whitespace-nowrap rounded-md bg-gray-900/95 px-2 py-1 text-xs text-white shadow',
          'transition-opacity duration-150',
          open ? 'opacity-100' : 'opacity-0',
          side === 'top'
            ? 'bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2'
            : 'top-[calc(100%+6px)] left-1/2 -translate-x-1/2'
        )}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
