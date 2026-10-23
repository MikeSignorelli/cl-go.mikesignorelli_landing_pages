import { usePSAQuiz, SECTION_QUESTION_COUNTS } from "@/context/PSAQuizContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { generateAuditReportPDF } from "@/lib/generateAuditReport";
import { useNavigate } from "react-router-dom";

const SECTION_NAMES = [
  "Guest Experience Engine",
  "Volunteer Pipeline",
  "Leadership Pathway",
  "Marriage Health",
];

const SECTION_MAX_SCORES = SECTION_QUESTION_COUNTS.map((count) => count * 1.5);

interface ScoreTier {
  range: [number, number];
  label: string;
  color: string;
  diagnosis: string;
}

const SCORE_TIERS: ScoreTier[] = [
  {
    range: [0, 12],
    label: "Critical",
    color: "0 72% 51%",
    diagnosis:
      "Your church is operating on charisma alone. ALL three core systems are missing or severely broken. You're the bottleneck for everything. Marriage likely under significant strain. Immediate structural intervention needed.",
  },
  {
    range: [13, 22],
    label: "Foundation Needed",
    color: "45 93% 58%",
    diagnosis:
      "You have fragments of systems but nothing complete. Likely one system partially functioning, two missing. You're doing 70%+ of the work yourself. Growth is structurally impossible at current capacity.",
  },
  {
    range: [23, 33],
    label: "Growth Ready",
    color: "45 93% 58%",
    diagnosis:
      "You have 1-2 systems partially built. Growth is happening but inconsistent. You work too many hours. There's a specific system that, if completed, would unlock your next phase. Close to breakthrough.",
  },
  {
    range: [34, 40],
    label: "Scaling",
    color: "142 71% 45%",
    diagnosis:
      "Strong systems foundation. 2-3 systems functioning. Growth is consistent. Marriage is reasonably healthy. Focus now shifts to optimization, leadership multiplication, and strategic planning.",
  },
  {
    range: [41, 45],
    label: "Exceptional",
    color: "199 89% 48%",
    diagnosis:
      "All 3 core systems are built and functioning. Leadership is distributed. You work sustainable hours. Marriage is thriving. You're ready for multi-campus, advanced strategy, or mentoring other pastors.",
  },
];

const getStatusDots = (score: number, max: number) => {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 0.9) return ["142 71% 45%"];
  if (pct >= 0.7) return ["142 71% 45%", "45 93% 58%"];
  if (pct >= 0.45) return ["45 93% 58%"];
  if (pct >= 0.2) return ["45 93% 58%", "0 72% 51%"];
  return ["0 72% 51%"];
};

const getTier = (score: number): ScoreTier => {
  for (const tier of SCORE_TIERS) {
    if (score >= tier.range[0] && score <= tier.range[1]) return tier;
  }
  return SCORE_TIERS[0];
};

const getBottleneck = (getSectionScore: (i: number) => number) => {
  let minScore = Infinity;
  let minIndex = 0;
  for (let i = 0; i < 3; i++) {
    const pct = getSectionScore(i) / SECTION_MAX_SCORES[i];
    if (pct < minScore) {
      minScore = pct;
      minIndex = i;
    }
  }
  return SECTION_NAMES[minIndex];
};

const PSAResultsView = () => {
  const { state, getTotalScore, getSectionScore, closeQuiz } = usePSAQuiz();
  const navigate = useNavigate();
  const totalScore = getTotalScore();
  const tier = getTier(totalScore);
  const bottleneck = getBottleneck(getSectionScore);

  const sectionScores = SECTION_NAMES.map((_, i) => getSectionScore(i));
  const sectionMaxScores = SECTION_QUESTION_COUNTS.map((c) => c * 1.5);

  const handleDownload = async () => {
    const pdfBytes = await generateAuditReportPDF({
      firstName: state.userInfo.firstName,
      totalScore,
      sectionScores,
      sectionMaxScores,
      bottleneck,
    });
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Pastor-Systems-Audit-Report.pdf";
    a.click();
    URL.revokeObjectURL(url);

    // Persist results for thank you page
    localStorage.setItem("psa-results", JSON.stringify({
      firstName: state.userInfo.firstName,
      totalScore,
      sectionScores,
      sectionMaxScores,
      bottleneck,
      tierLabel: tier.label,
      tierColor: tier.color,
      diagnosis: tier.diagnosis,
    }));

    closeQuiz();
    navigate("/pastor-systems-audit-thank-you");
  };

  return (
    <div className="flex flex-col items-center min-h-full px-5 py-8 md:px-8 md:py-10">
      <div className="w-full max-w-lg">
        <p className="subheading mb-1 text-center">Your Systems Score</p>
        <h3 className="text-4xl md:text-5xl font-bold text-center mb-1 font-heading text-primary">
          {totalScore} <span className="text-xl md:text-2xl font-medium text-muted-foreground">/ 45</span>
        </h3>

        <div className="flex justify-center mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold font-heading"
            style={{
              background: `hsl(${tier.color} / 0.15)`,
              color: `hsl(${tier.color})`,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: `hsl(${tier.color})` }}
            />
            {tier.label}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-center mb-6 font-body text-muted-foreground">
          {state.userInfo.firstName}, {tier.diagnosis}
        </p>

        <div className="rounded-lg overflow-hidden mb-5 bg-primary">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2.5 text-xs font-semibold font-heading text-secondary border-b border-primary-foreground/10">
            <span>System</span>
            <span className="text-center w-16">Your Score</span>
            <span className="text-center w-14">Max</span>
            <span className="text-center w-12">Status</span>
          </div>

          {SECTION_NAMES.map((name, i) => {
            const score = getSectionScore(i);
            const max = SECTION_MAX_SCORES[i];
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

        <div className="rounded-lg p-4 mb-4 flex items-start gap-3 bg-destructive/[0.08] border border-destructive/20">
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

        <Button onClick={handleDownload} className="btn-cta w-full text-base">
          Download Your Full Report
        </Button>
      </div>
    </div>
  );
};

export default PSAResultsView;
