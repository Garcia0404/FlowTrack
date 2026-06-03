interface StepSectionTitleProps {
  children: React.ReactNode;
}

export function StepSectionTitle({
  children,
}: StepSectionTitleProps) {
  return (
    <h4
      className="
        mb-3
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-muted-foreground
      "
    >
      {children}
    </h4>
  );
}