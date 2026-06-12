import type { HTMLAttributes, ReactNode } from 'react';

type GridViewProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const GridView = ({ children, className = '', ...props }: GridViewProps) => (
  <div
    className={`grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-4 md:gap-y-8 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-9 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-10 ${className}`}
    {...props}
  >
    {children}
  </div>
);
