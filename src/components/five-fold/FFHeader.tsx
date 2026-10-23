import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/five-fold/logo.webp";
import FFQuizModal from "@/components/five-fold/FFQuizModal";

const FFHeader = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-6 md:px-12 py-3 h-[104px]">
          <img src={logo} alt="Mike Signorelli" className="h-[80px] w-auto brightness-0" />
          <Button
            variant="outline"
            size="sm"
            className="font-body uppercase tracking-widest text-xs border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            onClick={() => setQuizOpen(true)}
          >
            Take the Free Quiz
          </Button>
        </div>
      </header>
      <FFQuizModal open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  );
};

export default FFHeader;
