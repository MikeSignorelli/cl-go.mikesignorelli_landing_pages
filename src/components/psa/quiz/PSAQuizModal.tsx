import { usePSAQuiz } from "@/context/PSAQuizContext";
import { X } from "lucide-react";
import PSAEmailCapture from "./PSAEmailCapture";
import PSAQuizIntro from "./PSAQuizIntro";
import PSAQuizQuestions from "./PSAQuizQuestions";
import PSAResultsView from "./PSAResultsView";

const PSAQuizModal = () => {
  const { state, closeQuiz } = usePSAQuiz();

  if (!state.isOpen) return null;

  const renderStep = () => {
    switch (state.currentStep) {
      case "email-capture":
        return <PSAEmailCapture />;
      case "intro":
        return <PSAQuizIntro />;
      case "quiz":
        return <PSAQuizQuestions />;
      case "results":
        return <PSAResultsView />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-primary/85" />
      <div
        className="relative z-10 w-full max-w-2xl mx-4 rounded-xl shadow-2xl overflow-y-auto bg-cream"
        style={{ maxHeight: "95vh" }}
      >
        <button
          onClick={closeQuiz}
          className="absolute top-4 right-4 p-1 rounded-full transition-colors hover:bg-muted z-10"
          aria-label="Close quiz"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        {renderStep()}
      </div>
    </div>
  );
};

export default PSAQuizModal;
