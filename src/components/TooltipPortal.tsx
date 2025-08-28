import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface TooltipPortalProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: Side;
  offset?: number;
  className?: string;
}

export const TooltipPortal: React.FC<TooltipPortalProps> = ({
  children,
  content,
  side = 'top',
  offset = 8,
  className,
}) => {
  const triggerRef = React.useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const updatePosition = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let top = rect.top;
    let left = rect.left;

    switch (side) {
      case 'top':
        top = rect.top - offset;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - offset;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + offset;
        break;
    }
    setPos({ top, left });
  }, [side, offset]);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, updatePosition]);

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-flex align-middle"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        tabIndex={0}
      >
        {children}
      </span>

      {open &&
        ReactDOM.createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
              pointerEvents: 'none',
              transform:
                side === 'top'
                  ? 'translate(-50%, -100%)'
                  : side === 'bottom'
                    ? 'translate(-50%, 0)'
                    : side === 'left'
                      ? 'translate(-100%, -50%)'
                      : 'translate(0, -50%)', // right
            }}
            className={classNames(
              'whitespace-nowrap rounded-md bg-gray-900 text-white px-2 py-1 text-xs shadow transition-opacity duration-150',
              className
            )}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default TooltipPortal;
