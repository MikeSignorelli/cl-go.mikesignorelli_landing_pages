import { usePSAQuiz } from "@/context/PSAQuizContext";
import { ClipboardList, Target, Award } from "lucide-react";

const PSAQuizIntro = () => {
  const { startQuiz, state } = usePSAQuiz();

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-10">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 bg-secondary/15">
          <ClipboardList className="w-7 h-7 text-secondary" />
        </div>

        <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-3 text-primary">
          Ready, {state.userInfo.firstName}?
        </h2>

        <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 font-body">
          You're about to take the Systems Audit - a quick diagnostic to uncover
          what's holding your church back from its next level of growth.
        </p>

        <div className="grid grid-cols-3 gap-4 rounded-lg p-5 mb-8 bg-primary/[0.04]">
          <div className="flex flex-col items-center gap-1.5">
            <ClipboardList className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold font-heading text-primary">30</span>
            <span className="text-xs text-muted-foreground">Questions</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold font-heading text-primary">45</span>
            <span className="text-xs text-muted-foreground">Max Score</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold font-heading text-primary">3</span>
            <span className="text-xs text-muted-foreground">Score Levels</span>
          </div>
        </div>

        <div className="text-left space-y-2 mb-8">
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-3 font-heading text-primary">
            Scoring
          </h4>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-destructive/10 text-destructive">
              0
            </span>
            <span>Not in place</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-secondary/15 text-secondary">
              0.5
            </span>
            <span>Partially in place</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/10 text-primary">
              1.5
            </span>
            <span>Fully functioning</span>
          </div>
        </div>

        <button onClick={startQuiz} className="btn-cta text-base w-full">
          Start the Audit →
        </button>
      </div>
    </div>
  );
};

export default PSAQuizIntro;
