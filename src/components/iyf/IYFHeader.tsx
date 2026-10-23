import { Button } from "@/components/ui/button";
import logo from "@/assets/iyf-logo.webp";

const IYFHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 md:px-12 py-4 h-28">
        <img src={logo} alt="Mike Signorelli" className="h-20 w-auto brightness-0" />
        <Button size="sm" className="font-heading uppercase tracking-widest text-xs bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0">
          Contact
        </Button>
      </div>
    </header>
  );
};

export default IYFHeader;
