import type { HTMLAttributes, ReactNode } from 'react';

type GridViewProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const GridView = ({ children, className = '', ...props }: GridViewProps) => (
  <div
    className={`grid grid-cols-2 gap-x-1 gap-y-8 md:grid-cols-3 md:gap-y-10 lg:grid-cols-4 xl:grid-cols-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);
