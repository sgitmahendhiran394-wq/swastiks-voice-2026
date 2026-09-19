import { motion } from "motion/react";
import { RatingSelector } from "./RatingSelector";
import { TextQuestion } from "./TextQuestion";
import type { Answers, Question } from "@/lib/questions";

type Props = {
  question: Question;
  answers: Answers;
  onAnswer: (id: string, value: number | string) => void;
};

export function QuestionCard({ question, answers, onAnswer }: Props) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <p className="eyebrow">Question {question.index}</p>
      <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
        {question.title}
      </h2>
      <div className="mt-7">
        {question.type === "rating" ? (
          <RatingSelector
            labels={question.labels}
            value={answers[question.id]}
            onChange={(v) => onAnswer(question.id, v)}
          />
        ) : (
          <TextQuestion
            value={answers[question.id] ?? ""}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
            onChange={(v) => onAnswer(question.id, v)}
          />
        )}
      </div>
    </motion.div>
  );
}
