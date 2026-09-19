import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  placeholder: string;
  maxLength: number;
  onChange: (value: string) => void;
};

export function TextQuestion({ value, placeholder, maxLength, onChange }: Props) {
  const count = value.length;
  return (
    <div>
      <Textarea
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="resize-none rounded-2xl border-glass-border bg-glass text-base focus-visible:ring-gold"
      />
      <div className="mt-2 flex justify-end">
        <span
          className={cn(
            "text-xs font-medium",
            count > maxLength * 0.9 ? "text-red-bright" : "text-muted-foreground",
          )}
        >
          {count}/{maxLength}
        </span>
      </div>
    </div>
  );
}
