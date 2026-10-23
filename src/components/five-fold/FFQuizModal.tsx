import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { generateCertificatePDF, downloadPDF } from "@/lib/generateCertificate";
import { sendToZapierViaEdge } from "@/lib/sendToZapier";
import { persistContact } from "@/lib/submitLead";

interface FFQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type QuizStep = "capture" | "scoring" | "questions" | "results" | "thankyou";
type Gift = "A" | "P" | "E" | "S" | "T";

interface QuizQuestion {
  question: string;
  options: { label: string; gift: Gift }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: "When you see a need in your community, your first instinct is to:",
    options: [
      { label: "Create a new initiative or structure to address it", gift: "A" },
      { label: "Call attention to what is really going on beneath the surface", gift: "P" },
      { label: "Share the need with others and invite them to be part of the solution", gift: "E" },
      { label: "Personally care for the people affected and walk alongside them", gift: "S" },
      { label: "Research the issue thoroughly and help others understand what Scripture says about it", gift: "T" },
    ],
  },
  {
    question: "In a group Bible study, you naturally tend to:",
    options: [
      { label: "Challenge the group to move from discussion to action", gift: "A" },
      { label: "Raise questions about what God might be revealing beyond the obvious reading", gift: "P" },
      { label: "Get excited about sharing what you have learned with people outside the group", gift: "E" },
      { label: "Notice who is struggling and check in on them after the study", gift: "S" },
      { label: "Dig deeper into the historical context, meaning, and implications of the passage", gift: "T" },
    ],
  },
  {
    question: "When a friend comes to you with a spiritual struggle, you:",
    options: [
      { label: "Help them develop a plan of action to move through it", gift: "A" },
      { label: "Ask honest questions and help them see what might be at the root of their situation", gift: "P" },
      { label: "Share your own story of how God helped you through something similar", gift: "E" },
      { label: "Listen patiently, comfort them, and commit to walking through it with them", gift: "S" },
      { label: "Open Scripture and walk them through what the Bible teaches about their situation", gift: "T" },
    ],
  },
  {
    question: "The part of a church gathering that resonates with you most is:",
    options: [
      { label: "The vision-casting and call to action - hearing where the community is headed", gift: "A" },
      { label: "Moments where truth is spoken that cuts through the noise and brings clarity", gift: "P" },
      { label: "The invitation - seeing people respond and take a step of faith", gift: "E" },
      { label: "Connection time - greeting people, small groups, and making sure everyone feels welcomed", gift: "S" },
      { label: "The teaching - especially when it is thorough, well-researched, and goes deep", gift: "T" },
    ],
  },
  {
    question: "If you could start any new initiative in your church, it would be:",
    options: [
      { label: "A new outreach in an unreached community or a church-planting effort", gift: "A" },
      { label: "A prayer and discernment group focused on seeking God's direction for the community", gift: "P" },
      { label: "An outreach team focused on connecting with unchurched people in your city", gift: "E" },
      { label: "A care ministry, support group, or mentoring program for people walking through difficult seasons", gift: "S" },
      { label: "A discipleship school or in-depth Bible study program", gift: "T" },
    ],
  },
  {
    question: "When you read the Bible, you are most drawn to:",
    options: [
      { label: "Stories of leaders who pioneered, built, and broke new ground - Moses, Paul, Nehemiah", gift: "A" },
      { label: "Passages where God calls people to account, reveals truth, and demands faithfulness", gift: "P" },
      { label: "Stories of the gospel spreading and people coming to faith for the first time", gift: "E" },
      { label: "Stories of Jesus caring for individuals - healing, comforting, and restoring the broken", gift: "S" },
      { label: "Deep theological passages that reveal God's character, wisdom, and design for life", gift: "T" },
    ],
  },
  {
    question: "Your friends would describe you as someone who:",
    options: [
      { label: "Gets things started and inspires others to follow", gift: "A" },
      { label: "Sees what others miss and is not afraid to name it honestly", gift: "P" },
      { label: "Is always inviting people into faith conversations or church community", gift: "E" },
      { label: "Is the first to show up when someone needs help", gift: "S" },
      { label: "Loves to explain complex ideas in ways that make sense to everyone", gift: "T" },
    ],
  },
  {
    question: "When your church community faces a significant challenge, your response is typically:",
    options: [
      { label: "\"Let me help lead us in a new direction - we need a fresh approach\"", gift: "A" },
      { label: "\"Something deeper is going on here - let me help us see what it really is\"", gift: "P" },
      { label: "\"Let me rally people and bring energy and urgency to the solution\"", gift: "E" },
      { label: "\"Let me make sure the people affected are being cared for\"", gift: "S" },
      { label: "\"Let me study what Scripture says about this and bring clarity to the group\"", gift: "T" },
    ],
  },
  {
    question: "The activity that energizes you most spiritually is:",
    options: [
      { label: "Launching something new or stepping into uncharted territory for God's purposes", gift: "A" },
      { label: "Extended time in prayer, reflection, and seeking God's perspective on a situation", gift: "P" },
      { label: "Having a genuine conversation with someone who does not yet know Jesus", gift: "E" },
      { label: "Walking alongside someone through a difficult season with patience and consistency", gift: "S" },
      { label: "Preparing a teaching, leading a study, or helping someone understand a difficult passage", gift: "T" },
    ],
  },
  {
    question: "When you imagine the next season of your spiritual life, you hope to:",
    options: [
      { label: "Pioneer something new - an initiative, a venture, or a community that does not yet exist", gift: "A" },
      { label: "Grow in your ability to discern what is true and help others see it clearly", gift: "P" },
      { label: "See more people come to faith through your personal influence and invitation", gift: "E" },
      { label: "Be more available and present for the people in your life who need consistent care", gift: "S" },
      { label: "Develop a deeper understanding of Scripture and share it in ways that transform others", gift: "T" },
    ],
  },
  {
    question: "In a team or group project, you naturally take the role of:",
    options: [
      { label: "The one who sees the big picture, sets direction, and mobilizes people toward it", gift: "A" },
      { label: "The one who senses when something is off course and is willing to redirect the group", gift: "P" },
      { label: "The one who recruits others, builds momentum, and generates excitement", gift: "E" },
      { label: "The one who makes sure everyone feels included, heard, and supported", gift: "S" },
      { label: "The one who does the research, organizes the information, and presents the findings", gift: "T" },
    ],
  },
  {
    question: "The criticism that has been hardest for you to hear is:",
    options: [
      { label: "\"You are always starting new things but do not always finish them\"", gift: "A" },
      { label: "\"You are too intense - you take things too seriously and it pushes people away\"", gift: "P" },
      { label: "\"You talk about your faith too much - not everyone wants to hear about it\"", gift: "E" },
      { label: "\"You care too much about people who do not appreciate it\"", gift: "S" },
      { label: "\"You overthink everything and get stuck in details instead of acting\"", gift: "T" },
    ],
  },
  {
    question: "During a time of worship or reflection, you most frequently find yourself:",
    options: [
      { label: "Feeling stirred to go and do something meaningful for God's purposes", gift: "A" },
      { label: "Sensing an awareness of something God is highlighting - a conviction, a clarity, a direction", gift: "P" },
      { label: "Thinking about the people in your life who have not experienced this and wishing they could", gift: "E" },
      { label: "Feeling deep compassion for the people around you and a desire to care for them", gift: "S" },
      { label: "Connecting the truths being expressed to broader Scripture and reflecting on deeper meaning", gift: "T" },
    ],
  },
  {
    question: "Your biggest frustration with your church community is:",
    options: [
      { label: "It plays things too safe - there is not enough vision, risk-taking, or forward movement", gift: "A" },
      { label: "It avoids hard truths and uncomfortable conversations that need to happen", gift: "P" },
      { label: "It is too focused inward and not enough on the people outside who need to be reached", gift: "E" },
      { label: "People fall through the cracks - the community does not care for individuals well enough", gift: "S" },
      { label: "The teaching lacks depth - it stays surface-level and does not challenge people to grow", gift: "T" },
    ],
  },
  {
    question: "If you had to choose one word that best describes how God has designed you to contribute, it would be:",
    options: [
      { label: "Pioneer", gift: "A" },
      { label: "Truth-teller", gift: "P" },
      { label: "Connector", gift: "E" },
      { label: "Caretaker", gift: "S" },
      { label: "Instructor", gift: "T" },
    ],
  },
  {
    question: "The Bible verse that resonates with you most deeply is:",
    options: [
      { label: "\"For we are God's masterpiece, created in Christ Jesus to do good works, which God prepared in advance for us to do.\" - Ephesians 2:10", gift: "A" },
      { label: "\"But if I say I will not mention His word or speak anymore in His name, His word is in my heart like a fire, a fire shut up in my bones.\" - Jeremiah 20:9", gift: "P" },
      { label: "\"How beautiful are the feet of those who bring good news.\" - Romans 10:15", gift: "E" },
      { label: "\"Carry each other's burdens, and in this way you will fulfill the law of Christ.\" - Galatians 6:2", gift: "S" },
      { label: "\"Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth.\" - 2 Timothy 2:15", gift: "T" },
    ],
  },
  {
    question: "When you think about the impact you want to have on future generations, you want to:",
    options: [
      { label: "Build something that outlasts you - an organization, a movement, or a legacy that keeps multiplying", gift: "A" },
      { label: "Be known as someone who was faithful to the truth regardless of whether it was popular", gift: "P" },
      { label: "Ensure that the people in your life - family and community - have genuinely encountered the gospel", gift: "E" },
      { label: "Create a culture of love, care, and emotional health that your children and grandchildren inherit", gift: "S" },
      { label: "Pass on a deep understanding of Scripture so the next generation knows what they believe and why", gift: "T" },
    ],
  },
  {
    question: "The leader in Scripture you most identify with is:",
    options: [
      { label: "Paul - pioneered new communities of faith across the known world and developed leaders everywhere he went", gift: "A" },
      { label: "Nathan - spoke difficult truth directly to King David when no one else would", gift: "P" },
      { label: "Philip - led the Ethiopian official to faith through a single conversation on the road", gift: "E" },
      { label: "Barnabas - known as the \"Son of Encouragement,\" he mentored, supported, and walked alongside others", gift: "S" },
      { label: "Apollos - described as \"mighty in the Scriptures,\" he taught with accuracy and passion", gift: "T" },
    ],
  },
  {
    question: "When you are facing a difficult spiritual season, you tend to:",
    options: [
      { label: "Look for a new approach or strategy and take decisive action to move through it", gift: "A" },
      { label: "Spend time in prayer and reflection seeking to understand what God is doing in the situation", gift: "P" },
      { label: "Reach out to others, share what you are going through, and draw strength from community and testimony", gift: "E" },
      { label: "Lean into trusted relationships, ask for support, and let others care for you", gift: "S" },
      { label: "Study what Scripture teaches about the specific challenge and anchor yourself in truth", gift: "T" },
    ],
  },
  {
    question: "The legacy you most want to leave is:",
    options: [
      { label: "\"They built something that extended God's mission and changed the landscape\"", gift: "A" },
      { label: "\"They were faithful to the truth and never compromised what mattered most\"", gift: "P" },
      { label: "\"They helped more people encounter the good news than anyone thought possible\"", gift: "E" },
      { label: "\"They loved people deeply and no one was ever alone or uncared for on their watch\"", gift: "S" },
      { label: "\"They understood God's Word and helped others understand it in ways that changed their lives\"", gift: "T" },
    ],
  },
];

const GIFT_NAMES: Record<Gift, string> = {
  A: "Apostle",
  P: "Prophet",
  E: "Evangelist",
  S: "Shepherd",
  T: "Teacher",
};

const GIFT_PROFILES: Record<Gift, { title: string; subtitle: string; description: string; howItShows: string[]; growthEdge: string[]; steps: string[] }> = {
  A: {
    title: "Apostle",
    subtitle: "The Pioneer",
    description: "You are wired to extend the mission - to pioneer new ventures, plant new communities, and build structures that multiply God's purposes. Where others see obstacles, you see opportunities. Where others maintain what exists, you imagine what could be.",
    howItShows: [
      "You get restless in routine and are energized by new challenges",
      "You naturally lead, mobilize, and inspire others to move toward a shared vision",
      "You think organizationally - about how systems, teams, and structures can be built or improved",
      "People look to you for direction and strategic clarity",
      "You are drawn to unreached places, unmet needs, and unbuilt solutions",
    ],
    growthEdge: [
      "You can start things without finishing them - learn to build teams and hand off well",
      "You may prioritize the mission over the people in it",
      "Your pace can leave others behind - practice patience and bring people along",
    ],
    steps: [
      "Identify one area in your life or community where something new needs to be built",
      "Study the Apostle Paul's missionary journeys in Acts 13-20",
      "Find a mentor who has built something lasting and learn how they sustained it",
      "Start with one initiative this month and practice building a team around it",
    ],
  },
  P: {
    title: "Prophet",
    subtitle: "The Messenger",
    description: "You are wired to discern what is true, name what is real, and call people to alignment with God's purposes. You see beneath the surface. You notice inconsistencies others overlook. You carry a deep concern for faithfulness, integrity, and justice.",
    howItShows: [
      "You feel things intensely and often sense when something is off before others do",
      "You are drawn to prayer, reflection, and seeking God's perspective on situations",
      "You speak honestly - sometimes bluntly - because you believe truth matters more than comfort",
      "You carry a deep concern for justice, righteousness, and faithfulness in your community",
      "You are frustrated by superficiality, compromise, and situations where hard truths are avoided",
    ],
    growthEdge: [
      "Your intensity can be perceived as judgmental - learn to deliver truth with compassion",
      "You may isolate when you feel misunderstood - stay connected to community",
      "Not every conviction requires immediate expression - practice discernment about when to speak",
    ],
    steps: [
      "Start a daily journal where you record what you sense God is highlighting",
      "Study the prophets of Scripture - particularly Nathan, Isaiah, and Jeremiah",
      "Find a trusted person where you can process what you are sensing before sharing publicly",
      "Practice asking: \"Is this truth that needs to be spoken now, or held in prayer?\"",
    ],
  },
  E: {
    title: "Evangelist",
    subtitle: "The Gatherer",
    description: "You are wired to share the good news, draw people in, and make faith compelling and accessible to those who are far from it. You see every conversation as an opportunity. Your own story is your most powerful tool.",
    howItShows: [
      "You are always inviting people into community, conversation, or experience",
      "You light up when someone takes a step of faith",
      "You think about the people in your life who are not yet connected to faith",
      "You communicate in ways that resonate beyond the church world",
      "You are frustrated when your community focuses inward and neglects those outside",
    ],
    growthEdge: [
      "You can prioritize breadth over depth - make sure you are growing spiritually",
      "You may reduce the gospel to a simple invitation without the full transformation it demands",
      "Not every relationship is a project - learn to love people without an agenda",
    ],
    steps: [
      "Write your personal story in 3 minutes or less - practice telling it naturally",
      "Study how Jesus engaged individuals - the woman at the well, Nicodemus, Zacchaeus",
      "Identify 5 people not connected to faith - commit to praying for them daily",
      "Find one opportunity this week to have a genuine faith conversation",
    ],
  },
  S: {
    title: "Shepherd",
    subtitle: "The Guardian",
    description: "You are wired to care for people, nurture growth, and walk alongside others through every season of life. You see the individual when everyone else sees the crowd. You remember names, notice when someone is missing, and show up when no one else does.",
    howItShows: [
      "You are the first to check on someone who seems off",
      "You prefer small groups over large events - deep relationships over wide networks",
      "You carry a deep empathy and naturally absorb the emotional weight of those around you",
      "You are patient with people in process - you believe in long-term investment",
      "You are frustrated when people fall through the cracks",
    ],
    growthEdge: [
      "You can absorb others' pain to the point of burnout - learn to set boundaries",
      "You may avoid confrontation because you value harmony",
      "Not every person is yours to carry - learn to steward your capacity wisely",
    ],
    steps: [
      "Identify 3 people in your community who need consistent care right now",
      "Study Jesus as the Good Shepherd in John 10 and Psalm 23",
      "Join or lead a small group where your relational gifts can flourish",
      "Set one boundary this week that protects your own spiritual and emotional health",
    ],
  },
  T: {
    title: "Teacher",
    subtitle: "The Guide",
    description: "You are wired to understand God's Word deeply and communicate it in ways that transform how others think and live. You do not just read the Bible - you study it. Historical context, original languages, cross-references, theological frameworks - you love going deep.",
    howItShows: [
      "You are the person who asks \"but what does this actually mean in context?\"",
      "You love preparing studies, organizing information, and making truth accessible",
      "People come to you with theological questions because they trust your thoroughness",
      "You are frustrated by shallow teaching",
      "You are drawn to learning environments - both as a student and as someone who creates them",
    ],
    growthEdge: [
      "You can prioritize knowledge over relationship",
      "You may come across as a corrector rather than a guide",
      "Depth without application is incomplete - practice asking \"so what does this mean for how we live?\"",
    ],
    steps: [
      "Choose one book of the Bible and study it thoroughly this month",
      "Study Apollos in Acts 18:24-28 - he models the combination of depth and humility",
      "Find one opportunity to teach this week",
      "Ask someone you trust: \"When I explain things, do people feel informed or transformed?\"",
    ],
  },
};

const FFQuizModal = ({ open, onOpenChange }: FFQuizModalProps) => {
  const [step, setStep] = useState<QuizStep>("capture");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string; zipCode?: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(Gift | null)[]>(Array(20).fill(null));
  const [selectedOption, setSelectedOption] = useState<Gift | null>(null);

  const handleReset = () => {
    setStep("capture");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setZipCode("");
    setErrors({});
    setCurrentQuestion(0);
    setAnswers(Array(20).fill(null));
    setSelectedOption(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleReset();
    onOpenChange(open);
  };

  const validateAndSubmit = () => {
    const newErrors: { firstName?: string; lastName?: string; email?: string; phone?: string; zipCode?: string } = {};
    const trimmedName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedZip = zipCode.trim();

    if (!trimmedName) newErrors.firstName = "Please enter your first name.";
    else if (trimmedName.length > 100) newErrors.firstName = "Name must be under 100 characters.";

    if (!trimmedLastName) newErrors.lastName = "Please enter your last name.";
    else if (trimmedLastName.length > 100) newErrors.lastName = "Name must be under 100 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) newErrors.email = "Please enter your email address.";
    else if (!emailRegex.test(trimmedEmail)) newErrors.email = "Please enter a valid email address.";

    const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
    if (!trimmedPhone) newErrors.phone = "Please enter your phone number.";
    else if (!phoneRegex.test(trimmedPhone)) newErrors.phone = "Please enter a valid phone number.";

    if (!trimmedZip) newErrors.zipCode = "Please enter your ZIP code.";
    else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(trimmedZip)) newErrors.zipCode = "Please enter a valid ZIP code.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setFirstName(trimmedName);
      setLastName(trimmedLastName);
      setEmail(trimmedEmail);
      setPhone(trimmedPhone);
      setZipCode(trimmedZip);

      const fields = {
        first_name: trimmedName,
        last_name: trimmedLastName,
        email: trimmedEmail,
        phone: trimmedPhone,
        postal_code: trimmedZip,
      };

      persistContact("five-fold-gift", fields);
      sendToZapierViaEdge("five-fold-gift", "Lead", fields, "fivefold").catch((err) =>
        console.error("[Lead] Webhook error:", err),
      );

      setStep("scoring");
    }
  };

  const handleSelectOption = (gift: Gift) => {
    setSelectedOption(gift);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep("results");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1]);
    }
  };

  const calculateResults = (): { primary: Gift; scores: Record<Gift, number> } => {
    const scores: Record<Gift, number> = { A: 0, P: 0, E: 0, S: 0, T: 0 };
    answers.forEach((a) => { if (a) scores[a]++; });
    const primary = (Object.entries(scores) as [Gift, number][]).sort((a, b) => b[1] - a[1])[0][0];
    return { primary, scores };
  };

  const progressPercent = step === "capture" || step === "scoring" ? 0 : step === "questions" ? ((currentQuestion + 1) / QUESTIONS.length) * 100 : 100;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* EMAIL CAPTURE */}
        {step === "capture" && (
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-2 mb-8">
              {["capture", "scoring", "questions", "results", "thankyou"].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= 0 ? "bg-secondary" : "bg-border"}`} />
              ))}
            </div>

            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
                Discover Your Five-Fold Calling
              </h2>
              <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                In Ephesians 4:11, Scripture describes five distinct ways God has designed people to contribute to the body of Christ - Apostle, Prophet, Evangelist, Shepherd, and Teacher. Each one represents a unique calling and contribution. This assessment reveals which one is yours.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ff-firstName" className="font-heading text-sm font-semibold text-foreground">First Name</Label>
                  <Input id="ff-firstName" name="First name" type="text" placeholder="Enter your first name" value={firstName} onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined })); }} maxLength={100} className="h-12 font-body" />
                  {errors.firstName && <p className="text-destructive text-xs font-body">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ff-lastName" className="font-heading text-sm font-semibold text-foreground">Last Name</Label>
                  <Input id="ff-lastName" name="Last Name" type="text" placeholder="Enter your last name" value={lastName} onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined })); }} maxLength={100} className="h-12 font-body" />
                  {errors.lastName && <p className="text-destructive text-xs font-body">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ff-email" className="font-heading text-sm font-semibold text-foreground">Email Address</Label>
                  <Input id="ff-email" name="Email address" type="email" placeholder="Enter your email address" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((prev) => ({ ...prev, email: undefined })); }} maxLength={255} className="h-12 font-body" />
                  {errors.email && <p className="text-destructive text-xs font-body">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ff-phone" className="font-heading text-sm font-semibold text-foreground">Phone Number</Label>
                  <Input id="ff-phone" name="Phone Number" type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined })); }} maxLength={20} className="h-12 font-body" />
                  {errors.phone && <p className="text-destructive text-xs font-body">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ff-zip" className="font-heading text-sm font-semibold text-foreground">Zip Code</Label>
                <Input id="ff-zip" name="Zip Code" type="text" placeholder="Enter your ZIP code" value={zipCode} onChange={(e) => { setZipCode(e.target.value); if (errors.zipCode) setErrors((prev) => ({ ...prev, zipCode: undefined })); }} maxLength={10} className="h-12 font-body" />
                {errors.zipCode && <p className="text-destructive text-xs font-body">{errors.zipCode}</p>}
              </div>

              <Button variant="hero" size="lg" className="w-full h-14 text-base mt-2" onClick={validateAndSubmit}>
                Start the Assessment →
              </Button>

              <p className="text-center font-body text-xs text-muted-foreground">
                We respect your privacy. No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}

        {/* SCORING KEY */}
        {step === "scoring" && (
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-2 mb-8">
              {["capture", "scoring", "questions", "results", "thankyou"].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= 1 ? "bg-secondary" : "bg-border"}`} />
              ))}
            </div>

            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">Scoring Key</h2>
              <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                Each answer corresponds to one of the five callings. Here's how the scoring works:
              </p>
            </div>

            <div className="space-y-4 mb-8 max-w-sm mx-auto">
              {[
                { letter: "A", name: "Apostle" },
                { letter: "P", name: "Prophet" },
                { letter: "E", name: "Evangelist" },
                { letter: "S", name: "Shepherd" },
                { letter: "T", name: "Teacher" },
              ].map((item) => (
                <div key={item.letter} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-heading font-bold text-lg flex-shrink-0">
                    {item.letter}
                  </span>
                  <span className="font-heading text-base font-semibold text-foreground">{item.name}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="w-full h-14 text-base" onClick={() => setStep("questions")}>
              Start the Assessment →
            </Button>
          </div>
        )}

        {/* QUESTIONS */}
        {step === "questions" && (
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading text-xs font-bold text-muted-foreground tracking-widest uppercase">
                  Question {currentQuestion + 1} of {QUESTIONS.length}
                </span>
                <span className="font-heading text-xs font-bold text-secondary">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-6 leading-snug">
              {QUESTIONS[currentQuestion].question}
            </h3>

            <div className="space-y-3 mb-6">
              {QUESTIONS[currentQuestion].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.gift)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-body text-sm md:text-base leading-relaxed ${
                    selectedOption === opt.gift
                      ? "border-secondary bg-secondary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-secondary/40 hover:bg-cream"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-heading font-bold mr-3 flex-shrink-0 ${
                    selectedOption === opt.gift
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-border text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className={`flex items-center gap-1 font-heading text-sm font-semibold transition-colors ${
                  currentQuestion === 0 ? "text-muted-foreground/30 cursor-not-allowed" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <Button variant="hero" size="default" className="px-8" onClick={handleNext} disabled={selectedOption === null}>
                {currentQuestion === QUESTIONS.length - 1 ? "See My Results" : "Next →"}
              </Button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (() => {
          const { primary, scores } = calculateResults();
          const maxScore = Math.max(...Object.values(scores));
          const profile = GIFT_PROFILES[primary];

          return (
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <p className="font-heading text-xs font-bold tracking-widest uppercase text-secondary mb-3">Your Five-Fold Calling</p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-1">{profile.title.toUpperCase()}</h2>
                <p className="font-heading text-lg text-secondary font-semibold mb-4">- {profile.subtitle}</p>
                <p className="font-body text-sm text-muted-foreground mb-2">
                  You are a{["Apostle", "Evangelist"].includes(profile.title) ? "n" : ""} <span className="font-semibold text-foreground">{profile.title}</span>.
                </p>
                <p className="font-body text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">{profile.description}</p>
              </div>

              <div className="bg-cream rounded-lg p-5 mb-4">
                <p className="font-heading text-xs font-bold tracking-widest uppercase text-secondary mb-3">How It Shows Up in Daily Life</p>
                <ul className="space-y-2">
                  {profile.howItShows.map((item, i) => (
                    <li key={i} className="flex gap-2 font-body text-sm text-muted-foreground leading-relaxed">
                      <span className="text-secondary flex-shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-cream rounded-lg p-5 mb-4">
                <p className="font-heading text-xs font-bold tracking-widest uppercase text-secondary mb-3">Your Growth Edge</p>
                <ul className="space-y-2">
                  {profile.growthEdge.map((item, i) => (
                    <li key={i} className="flex gap-2 font-body text-sm text-muted-foreground leading-relaxed">
                      <span className="text-secondary flex-shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-cream rounded-lg p-5 mb-6">
                <p className="font-heading text-xs font-bold tracking-widest uppercase text-secondary mb-3">Activation Steps & Roadmap</p>
                <ol className="space-y-2">
                  {profile.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 font-body text-sm text-muted-foreground leading-relaxed">
                      <span className="font-heading font-bold text-secondary flex-shrink-0">{i + 1}.</span>{s}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-cream rounded-lg p-6 mb-8">
                <p className="font-heading text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Score Breakdown</p>
                <div className="space-y-3">
                  {(Object.entries(scores) as [Gift, number][])
                    .sort((a, b) => b[1] - a[1])
                    .map(([gift, score]) => (
                      <div key={gift} className="flex items-center gap-3">
                        <span className={`font-heading text-sm font-bold w-24 ${gift === primary ? "text-secondary" : "text-muted-foreground"}`}>
                          {GIFT_NAMES[gift]}
                        </span>
                        <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${gift === primary ? "bg-secondary" : "bg-muted-foreground/30"}`}
                            style={{ width: `${maxScore > 0 ? (score / maxScore) * 100 : 0}%` }}
                          />
                        </div>
                        <span className={`font-heading text-sm font-bold w-8 text-right ${gift === primary ? "text-secondary" : "text-muted-foreground"}`}>
                          {score}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="text-center">
                <p className="font-heading text-lg font-bold text-foreground mb-2">Your Five-Fold Identity Certificate is ready.</p>
                <p className="font-body text-sm text-muted-foreground mb-6">Click below to download your personalized certificate and full gift profile.</p>
                <Button variant="hero" size="lg" className="w-full h-14 text-base mb-4" onClick={async () => {
                  const { primary } = calculateResults();
                  const giftName = GIFT_NAMES[primary];
                  const fullName = `${firstName} ${lastName}`.trim();
                  const profileForPdf = GIFT_PROFILES[primary];
                  try {
                    const pdfBytes = await generateCertificatePDF(fullName, giftName, profileForPdf);
                    downloadPDF(pdfBytes, `Five-Fold-Certificate-${fullName.replace(/\s+/g, "-")}.pdf`);
                  } catch (e) {
                    console.error("Certificate generation failed:", e);
                  }
                  setStep("thankyou");
                }}>
                  Download Your Five-Fold Identity Certificate and Profile
                </Button>
                <p className="font-body text-xs text-muted-foreground">Your complete gift profile and activation roadmap are ready.</p>
              </div>
            </div>
          );
        })()}

        {/* THANK YOU */}
        {step === "thankyou" && (() => {
          const { primary } = calculateResults();
          const giftName = GIFT_NAMES[primary];

          return (
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">🎉</span>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Congratulations - You Are a{["Apostle", "Evangelist"].includes(giftName) ? "n" : ""} {giftName}!
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  Your Five-Fold Identity Certificate and full gift profile are downloaded now.
                </p>
              </div>

              {/* Hidden for now
              <div className="bg-cream rounded-lg p-6 mb-6">
                <p className="font-heading text-xs font-bold tracking-widest uppercase text-secondary mb-4">A Personal Message from Pastor Mike</p>
                <div className="aspect-video bg-primary/90 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <span className="text-4xl block mb-2">▶️</span>
                    <p className="font-heading text-sm text-primary-foreground/80">Video Coming Soon</p>
                  </div>
                </div>
              </div>
              */}

            </div>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
};

export default FFQuizModal;
