import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
};

export function NavigationButtons({
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
  nextLabel = "Next",
}: Props) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <Button variant="glass" size="lg" onClick={onBack} disabled={backDisabled}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button variant="gold" size="lg" onClick={onNext} disabled={nextDisabled}>
        {nextLabel} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
