import mikePhoto from "@/assets/five-fold/pastor-mike.webp";

const FFAboutSection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground text-center mb-14">
          About Pastor Mike Signorelli
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <img
              src={mikePhoto}
              alt="Pastor Mike Signorelli teaching"
              className="w-full h-[400px] lg:h-[500px] object-cover object-[center_20%] rounded-[10px]"
            />
          </div>

          <div className="space-y-6">
            <p className="font-body text-base md:text-lg leading-relaxed text-primary-foreground/80">
              Pastor Mike Signorelli is the founding pastor of V1 Church and the voice behind Mike Signorelli Ministries. With <span className="text-secondary font-semibold">1.6 million YouTube subscribers</span>, a weekly TBN show reaching <span className="text-secondary font-semibold">3 million viewers</span>, and recognition as the pastor behind the <span className="text-secondary font-semibold">fastest-growing church in America for 5 consecutive years</span>, Mike's mission is simple: distill ancient truth into lasting freedom.
            </p>
            <p className="font-body text-base md:text-lg leading-relaxed text-primary-foreground/80">
              A Baker Books published author (<em>Inherit Your Freedom</em>, <em>Fire Starters</em>) with Disney+ credits, Mike is known for making deep biblical truth accessible without dumbing it down - combining theological rigor with practical application that changes how people live.
            </p>
            <p className="font-body text-base md:text-lg leading-relaxed text-primary-foreground/90 font-medium">
              The Five-Fold Gift quiz is Mike's way of helping every Christian discover the unique gift God has placed in them - so they can stop guessing and start walking in their calling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FFAboutSection;
