import { useState, useEffect } from "react";
import { usePSAQuiz, TOTAL_QUESTIONS } from "@/context/PSAQuizContext";
import { quizSections } from "@/data/psaQuizQuestions";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

const SECTION_ICONS = ["🚪", "🤝", "🏗️", "💍"];

const PSAQuizQuestions = () => {
  const { state, answerQuestion, nextQuestion, prevQuestion, getProgress } = usePSAQuiz();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const section = quizSections[state.currentSection];
  const question = section.questions[state.currentQuestion];
  const progress = getProgress();

  let overallQ = state.currentQuestion + 1;
  for (let i = 0; i < state.currentSection; i++) {
    overallQ += quizSections[i].questions.length;
  }

  // Restore previous answer when navigating back
  useEffect(() => {
    const prev = state.answers.find(
      (a) => a.sectionIndex === state.currentSection && a.questionIndex === state.currentQuestion
    );
    if (prev) {
      const idx = question.options.findIndex((o) => o.value === prev.value);
      setSelectedIndex(idx >= 0 ? idx : null);
    } else {
      setSelectedIndex(null);
    }
  }, [state.currentSection, state.currentQuestion]);

  const handleNext = () => {
    if (selectedIndex === null) return;
    answerQuestion({
      sectionIndex: state.currentSection,
      questionIndex: state.currentQuestion,
      value: question.options[selectedIndex].value,
    });
    setSelectedIndex(null);
    nextQuestion();
  };

  const letters = ["A", "B", "C"];

  return (
    <div className="flex flex-col min-h-full px-6 py-8 md:py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="subheading flex items-center gap-2">
            {SECTION_ICONS[state.currentSection]} Section {state.currentSection + 1} of 4
          </span>
          <span className="text-xs font-medium font-heading text-muted-foreground">
            Q{overallQ} of {TOTAL_QUESTIONS}
          </span>
        </div>

        <h3 className="text-sm md:text-base font-semibold mb-3 font-heading text-primary">
          {section.title}
        </h3>

        <Progress value={progress} className="h-2" />
      </div>

      <h4 className="text-lg md:text-xl font-bold mb-6 leading-snug font-heading text-primary">
        {question.question}
      </h4>

      <div className="space-y-3 flex-1">
        {question.options.map((option, i) => {
          const isActive = selectedIndex === i;
          return (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`w-full text-left rounded-lg border-2 p-4 transition-all flex items-center gap-3 ${
                isActive ? "border-secondary bg-secondary/[0.08]" : "border-border bg-transparent"
              }`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 font-heading ${
                  isActive ? "bg-secondary text-primary" : "bg-border text-muted-foreground"
                }`}
              >
                {letters[i]}
              </span>
              <span
                className={`text-sm leading-relaxed font-body ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={prevQuestion}
          className="flex items-center justify-center gap-1 px-4 py-3 rounded-lg border-2 border-border text-muted-foreground hover:bg-muted transition-colors text-sm font-heading"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedIndex === null}
          className="btn-cta text-base flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {overallQ === TOTAL_QUESTIONS ? "See My Results →" : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default PSAQuizQuestions;
