import logo from "@/assets/cssk-logo.webp";

const CSSKHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="flex items-center justify-between px-6 md:px-12 py-3 h-[80px]">
        <img src={logo} alt="Mike Signorelli Ministries" className="h-[60px] w-auto brightness-0 invert" />
        <a href="#get-kit" className="btn-cta !py-2.5 !px-5 !text-sm">
          Get the Starter Kit →
        </a>
      </div>
    </header>
  );
};

export default CSSKHeader;
