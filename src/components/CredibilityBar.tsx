const CredibilityBar = () => {
  const items = [
    "Led by Pastor Mike Signorelli",
    "1.6M YouTube Subscribers",
    "TBN Host",
    "Baker Books Author",
    "Hosted by America Greece Tours - Specialists in Biblical Travel",
  ];

  return (
    <section className="bg-primary py-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {items.map((item, index) => (
            <span key={index} className="flex items-center">
              <span className="text-primary-foreground/90 text-xs md:text-sm font-body font-medium tracking-wide">
                {item}
              </span>
              {index < items.length - 1 && (
                <span className="text-gold ml-4 text-xs">✦</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredibilityBar;
