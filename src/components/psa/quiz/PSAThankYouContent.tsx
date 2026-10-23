import { Button } from "@/components/ui/button";
import { AlertTriangle, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SECTION_NAMES = [
  "Guest Experience Engine",
  "Volunteer Pipeline",
  "Leadership Pathway",
  "Marriage Health",
];

interface StoredResults {
  firstName: string;
  totalScore: number;
  sectionScores: number[];
  sectionMaxScores: number[];
  bottleneck: string;
  tierLabel: string;
  tierColor: string;
  diagnosis: string;
}

const getStatusDots = (score: number, max: number) => {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 0.9) return ["142 71% 45%"];
  if (pct >= 0.7) return ["142 71% 45%", "45 93% 58%"];
  if (pct >= 0.45) return ["45 93% 58%"];
  if (pct >= 0.2) return ["45 93% 58%", "0 72% 51%"];
  return ["0 72% 51%"];
};

const STARTER_KIT_DESCRIPTION = "Every template, script, and tool for all 3 Core Systems. Plug-and-play. Customizable to your church. Used by 300+ pastors.";

const PSAThankYouContent = () => {
  const [results, setResults] = useState<StoredResults | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("psa-results");
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const key = "pastor-systems-audit-thank-you";
    (async () => {
      const { readPersistedContact, hasSentThankYou, markThankYouSent } = await import("@/lib/submitLead");
      const { sendToZapier, ZAPIER_WEBHOOK_URL_PSA } = await import("@/lib/sendToZapier");
      if (hasSentThankYou(key)) return;
      markThankYouSent(key);
      await sendToZapier(key, "Thank-You", readPersistedContact("pastor-systems-audit"), ZAPIER_WEBHOOK_URL_PSA);
    })();
  }, []);

  if (!results) {
    return (
      <div className="flex flex-col items-center min-h-full px-5 py-16 md:px-8">
        <p className="text-muted-foreground font-body">No audit results found. Please take the audit first.</p>
      </div>
    );
  }

  const { firstName, totalScore, sectionScores, sectionMaxScores, bottleneck, tierLabel, tierColor, diagnosis } = results;

  return (
    <div className="flex flex-col items-center min-h-full px-5 py-8 md:px-8 md:py-10">
      <div className="w-full max-w-lg">
        <p className="subheading mb-2 text-center">Audit Complete</p>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-center mb-6 leading-tight text-primary">
          Your Systems Audit Is Complete.
          <br />
          Here's What Comes Next.
        </h3>

        {/* Score + Tier Badge */}
        <p className="text-4xl md:text-5xl font-bold text-center mb-1 font-heading text-primary">
          {totalScore} <span className="text-xl md:text-2xl font-medium text-muted-foreground">/ 45</span>
        </p>

        <div className="flex justify-center mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold font-heading"
            style={{
              background: `hsl(${tierColor} / 0.15)`,
              color: `hsl(${tierColor})`,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: `hsl(${tierColor})` }}
            />
            {tierLabel}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-center mb-6 font-body text-muted-foreground">
          {firstName}, {diagnosis}
        </p>

        {/* Section Breakdown Table */}
        <div className="rounded-lg overflow-hidden mb-5 bg-primary">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2.5 text-xs font-semibold font-heading text-secondary border-b border-primary-foreground/10">
            <span>System</span>
            <span className="text-center w-16">Your Score</span>
            <span className="text-center w-14">Max</span>
            <span className="text-center w-12">Status</span>
          </div>

          {SECTION_NAMES.map((name, i) => {
            const score = sectionScores[i] ?? 0;
            const max = sectionMaxScores[i] ?? 0;
            const dots = getStatusDots(score, max);
            return (
              <div
                key={name}
                className={`grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-3 items-center text-sm font-body text-primary-foreground ${
                  i < SECTION_NAMES.length - 1 ? "border-b border-primary-foreground/10" : ""
                }`}
              >
                <span className="text-xs md:text-sm">{name}</span>
                <span className="text-center w-16 font-semibold font-heading">
                  {score} / {max}
                </span>
                <span className="text-center w-14 text-xs text-muted-foreground">{max}</span>
                <span className="flex justify-center gap-1 w-12">
                  {dots.map((dotColor, di) => (
                    <span
                      key={di}
                      className="w-3 h-3 rounded-full"
                      style={{ background: `hsl(${dotColor})` }}
                    />
                  ))}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottleneck */}
        <div className="rounded-lg p-4 mb-6 flex items-start gap-3 bg-destructive/[0.08] border border-destructive/20">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-destructive" />
          <div>
            <p className="text-sm font-bold mb-0.5 font-heading text-primary">
              Your #1 Bottleneck: {bottleneck}
            </p>
            <p className="text-xs font-body text-muted-foreground">
              This is where you start. Build this system FIRST.
            </p>
          </div>
        </div>

        {/* Video Section - hidden for now */}
        {/*
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 font-heading text-secondary">
            A Personal Message from Mike
          </p>

          <div
            className="relative rounded-lg overflow-hidden cursor-pointer group bg-primary"
            style={{ aspectRatio: "16/9" }}
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
          >
            {!isVideoPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 bg-secondary">
                  <Play className="w-7 h-7 ml-1 text-primary" />
                </div>
                <p className="text-sm font-semibold font-heading text-primary-foreground">
                  Watch Mike's Message (90 sec)
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <p className="text-xs leading-relaxed text-center font-body text-primary-foreground">
                  Video player placeholder - embed Mike's 90-second personal message here.
                </p>
              </div>
            )}
          </div>
        </div>
        */}

        {/* Divider + CTA hidden for now */}
        {/*
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider font-heading bg-background text-muted-foreground">
              Recommended Next Step
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h4 className="font-heading text-xl md:text-2xl font-bold mb-2 leading-tight text-primary">
            Ready to Build the Systems You're Missing?
          </h4>
          <p className="text-lg font-semibold mb-4 font-heading text-secondary">
            The Church Systems Starter Kit - $97
          </p>

          <p className="text-sm mb-5 font-body text-muted-foreground">
            {STARTER_KIT_DESCRIPTION}
          </p>

          <Button asChild className="btn-cta w-full text-base">
            <Link to="/church-systems-starter-kit">Get the Starter Kit - $97 →</Link>
          </Button>
        </div>
        */}
      </div>
    </div>
  );
};

export default PSAThankYouContent;
