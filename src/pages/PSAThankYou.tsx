import { PSAQuizProvider } from "@/context/PSAQuizContext";
import PSAHeader from "@/components/psa/PSAHeader";
import PSAFooter from "@/components/psa/PSAFooter";
import PSAThankYouContent from "@/components/psa/quiz/PSAThankYouContent";

const PSAThankYou = () => {
  return (
    <PSAQuizProvider>
      <div className="min-h-screen flex flex-col">
        <PSAHeader />
        <main className="flex-1 pt-[80px]">
          <PSAThankYouContent />
        </main>
        <PSAFooter />
      </div>
    </PSAQuizProvider>
  );
};

export default PSAThankYou;
