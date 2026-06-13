type SearchAuthoringChromeProps = {
  label: string;
};

export function SearchAuthoringChrome({ label }: SearchAuthoringChromeProps) {
  return (
    <div className="border-border bg-background-muted/30 text-foreground-light min-h-[80px] rounded-md border border-dashed px-4 py-6 text-center text-sm select-none">
      {label}
    </div>
  );
}
