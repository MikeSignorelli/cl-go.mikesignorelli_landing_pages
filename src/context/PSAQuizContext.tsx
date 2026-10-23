import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type ChurchSize = "under-100" | "100-200" | "200-300" | "300-500";

export interface QuizUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  churchSize: ChurchSize | "";
  zipCode: string;
  contactNumber: string;
}

export interface QuizAnswer {
  questionIndex: number;
  sectionIndex: number;
  value: number;
}

export interface QuizState {
  isOpen: boolean;
  currentStep: "email-capture" | "intro" | "quiz" | "results" | "thank-you";
  currentSection: number;
  currentQuestion: number;
  userInfo: QuizUserInfo;
  answers: QuizAnswer[];
}

interface QuizContextType {
  state: QuizState;
  openQuiz: () => void;
  closeQuiz: () => void;
  setUserInfo: (info: QuizUserInfo) => void;
  goToIntro: () => void;
  startQuiz: () => void;
  answerQuestion: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToResults: () => void;
  goToThankYou: (navigate: (path: string) => void) => void;
  getTotalScore: () => number;
  getSectionScore: (sectionIndex: number) => number;
  getProgress: () => number;
}

const initialState: QuizState = {
  isOpen: false,
  currentStep: "email-capture",
  currentSection: 0,
  currentQuestion: 0,
  userInfo: { firstName: "", lastName: "", email: "", churchSize: "", zipCode: "", contactNumber: "" },
  answers: [],
};

const PSAQuizContext = createContext<QuizContextType | undefined>(undefined);

export const SECTION_QUESTION_COUNTS = [10, 10, 7, 3];
export const TOTAL_QUESTIONS = SECTION_QUESTION_COUNTS.reduce((a, b) => a + b, 0);

export const PSAQuizProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<QuizState>(initialState);

  const openQuiz = () =>
    setState((s) => ({ ...s, isOpen: true, currentStep: "email-capture" }));

  const closeQuiz = () => setState(initialState);

  const setUserInfo = (info: QuizUserInfo) =>
    setState((s) => ({ ...s, userInfo: info }));

  const goToIntro = () =>
    setState((s) => ({ ...s, currentStep: "intro" }));

  const startQuiz = () =>
    setState((s) => ({ ...s, currentStep: "quiz", currentSection: 0, currentQuestion: 0 }));

  const answerQuestion = (answer: QuizAnswer) =>
    setState((s) => ({
      ...s,
      answers: [
        ...s.answers.filter(
          (a) => !(a.sectionIndex === answer.sectionIndex && a.questionIndex === answer.questionIndex)
        ),
        answer,
      ],
    }));

  const nextQuestion = () =>
    setState((s) => {
      const maxQ = SECTION_QUESTION_COUNTS[s.currentSection];
      if (s.currentQuestion + 1 < maxQ) {
        return { ...s, currentQuestion: s.currentQuestion + 1 };
      }
      if (s.currentSection + 1 < SECTION_QUESTION_COUNTS.length) {
        return { ...s, currentSection: s.currentSection + 1, currentQuestion: 0 };
      }
      return { ...s, currentStep: "results" };
    });

  const prevQuestion = () =>
    setState((s) => {
      if (s.currentQuestion > 0) {
        return { ...s, currentQuestion: s.currentQuestion - 1 };
      }
      if (s.currentSection > 0) {
        const prevSection = s.currentSection - 1;
        return { ...s, currentSection: prevSection, currentQuestion: SECTION_QUESTION_COUNTS[prevSection] - 1 };
      }
      return { ...s, currentStep: "intro" };
    });

  const goToResults = () => setState((s) => ({ ...s, currentStep: "results" }));
  const goToThankYou = useCallback((navigate: (path: string) => void) => {
    setState((s) => ({ ...s, isOpen: false, currentStep: "thank-you" }));
    navigate("/pastor-systems-audit-thank-you");
  }, []);

  const getSectionScore = (sectionIndex: number) =>
    state.answers
      .filter((a) => a.sectionIndex === sectionIndex)
      .reduce((sum, a) => sum + a.value, 0);

  const getTotalScore = () =>
    state.answers.reduce((sum, a) => sum + a.value, 0);

  const getProgress = () => {
    let answered = 0;
    for (let s = 0; s < state.currentSection; s++) {
      answered += SECTION_QUESTION_COUNTS[s];
    }
    answered += state.currentQuestion;
    return Math.round((answered / TOTAL_QUESTIONS) * 100);
  };

  return (
    <PSAQuizContext.Provider
      value={{
        state,
        openQuiz,
        closeQuiz,
        setUserInfo,
        goToIntro,
        startQuiz,
        answerQuestion,
        nextQuestion,
        prevQuestion,
        goToResults,
        goToThankYou,
        getTotalScore,
        getSectionScore,
        getProgress,
      }}
    >
      {children}
    </PSAQuizContext.Provider>
  );
};

export const usePSAQuiz = () => {
  const ctx = useContext(PSAQuizContext);
  if (!ctx) throw new Error("usePSAQuiz must be used within PSAQuizProvider");
  return ctx;
};
