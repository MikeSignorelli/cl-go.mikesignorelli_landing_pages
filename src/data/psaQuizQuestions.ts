export interface QuizOption {
  label: string;
  value: number;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface QuizSection {
  title: string;
  questions: QuizQuestion[];
}

export const quizSections: QuizSection[] = [
  {
    title: "Guest Experience System",
    questions: [
      {
        question: "Do you have a system to identify first-time guests every Sunday?",
        options: [
          { label: "Yes - we have a clear process (welcome card, digital check-in, greeter identification)", value: 1.5 },
          { label: "Sometimes - it depends on who's volunteering that day", value: 0.5 },
          { label: "No - we don't consistently know who's new", value: 0 },
        ],
      },
      {
        question: "When a first-time guest visits, do they receive personal follow-up within 24 hours?",
        options: [
          { label: "Yes - automated text/email + personal call/message within 24 hours", value: 1.5 },
          { label: "We try, but it's inconsistent (depends on the week)", value: 0.5 },
          { label: "No - we don't have a follow-up process", value: 0 },
        ],
      },
      {
        question: "Do you have a defined \"second-visit trigger\" - something that specifically invites first-timers to return?",
        options: [
          { label: "Yes - specific invitation to a next step (event, class, group) given at first visit", value: 1.5 },
          { label: "We verbally invite them back but nothing specific", value: 0.5 },
          { label: "No - we just hope they come back", value: 0 },
        ],
      },
      {
        question: "Is there a clear pathway from \"guest\" to \"regular attender\" to \"member\"?",
        options: [
          { label: "Yes - documented with specific steps and timeline", value: 1.5 },
          { label: "We have a membership class but no defined pathway to it", value: 0.5 },
          { label: "No - people just kind of become \"regulars\" over time", value: 0 },
        ],
      },
      {
        question: "Do you track guest return rate (what percentage come back a second time)?",
        options: [
          { label: "Yes - we track it monthly and aim for 40%+", value: 1.5 },
          { label: "We have a general sense but don't track precisely", value: 0.5 },
          { label: "No - we don't measure this", value: 0 },
        ],
      },
      {
        question: "Is there a designated team (not just you) responsible for guest experience?",
        options: [
          { label: "Yes - a trained team with a leader who owns this", value: 1.5 },
          { label: "We have greeters but no one \"owns\" the full guest journey", value: 0.5 },
          { label: "No - I handle most of it myself", value: 0 },
        ],
      },
      {
        question: "Do you have a welcome packet or gift for first-time guests?",
        options: [
          { label: "Yes - intentional, branded, includes next-step information", value: 1.5 },
          { label: "Sometimes - depends on supplies and who remembers", value: 0.5 },
          { label: "No", value: 0 },
        ],
      },
      {
        question: "Is your facility clean, signage clear, and parking accessible for first-time visitors?",
        options: [
          { label: "Yes - we regularly audit from a guest's perspective", value: 1.5 },
          { label: "It's adequate but we haven't done a formal audit", value: 0.5 },
          { label: "Honestly, it could use significant improvement", value: 0 },
        ],
      },
      {
        question: "Do you have a process for connecting guests with small groups or serving teams within their first 30 days?",
        options: [
          { label: "Yes - structured connection process with personal invitation", value: 1.5 },
          { label: "We mention groups from stage but don't have a direct connection process", value: 0.5 },
          { label: "No - guests find groups on their own if they're interested", value: 0 },
        ],
      },
      {
        question: "Can you describe your complete guest journey (from parking lot to 90-day integration) in one document?",
        options: [
          { label: "Yes - it's written down and the team is trained on it", value: 1.5 },
          { label: "I could describe it verbally but it's not documented", value: 0.5 },
          { label: "No - there isn't a defined journey", value: 0 },
        ],
      },
    ],
  },
  {
    title: "Volunteer Pipeline",
    questions: [
      {
        question: "Do you have a clear, documented process for recruiting new volunteers?",
        options: [
          { label: "Yes - regular recruitment with specific roles, descriptions, and ask process", value: 1.5 },
          { label: "We recruit when we're desperate but no ongoing process", value: 0.5 },
          { label: "No - I beg from the stage when we're short-handed", value: 0 },
        ],
      },
      {
        question: "When someone volunteers, do they receive structured onboarding/training?",
        options: [
          { label: "Yes - formal training process (2-4 weeks) before they serve independently", value: 1.5 },
          { label: "We show them the basics and let them figure it out", value: 0.5 },
          { label: "No - they jump in and learn as they go", value: 0 },
        ],
      },
      {
        question: "Does every volunteer role have a written description with clear expectations?",
        options: [
          { label: "Yes - role descriptions for every position", value: 1.5 },
          { label: "Some roles have descriptions, most don't", value: 0.5 },
          { label: "No - people just \"help out\" with whatever's needed", value: 0 },
        ],
      },
      {
        question: "Do you have a volunteer retention rate above 70% (year-over-year)?",
        options: [
          { label: "Yes - 70%+ of volunteers serve for 12+ months", value: 1.5 },
          { label: "I'm not sure / we don't track this", value: 0.5 },
          { label: "No - most volunteers burn out within 3-6 months", value: 0 },
        ],
      },
      {
        question: "Is there a recognition program for volunteers (monthly, quarterly, or annual)?",
        options: [
          { label: "Yes - structured recognition (events, shout-outs, gifts, appreciation)", value: 1.5 },
          { label: "We say thank you informally but nothing structured", value: 0.5 },
          { label: "No - volunteers rarely feel appreciated", value: 0 },
        ],
      },
      {
        question: "Do you have a development pathway for volunteers (growth beyond their current role)?",
        options: [
          { label: "Yes - volunteers can grow from serving to team leading to ministry leading", value: 1.5 },
          { label: "Some volunteers advance but there's no formal pathway", value: 0.5 },
          { label: "No - volunteers stay in the same role until they quit", value: 0 },
        ],
      },
      {
        question: "Is there a volunteer coordinator or team leader (not you) who manages the volunteer program?",
        options: [
          { label: "Yes - someone owns volunteer recruitment, scheduling, and development", value: 1.5 },
          { label: "I share this responsibility with 1-2 people informally", value: 0.5 },
          { label: "No - I manage all volunteers myself", value: 0 },
        ],
      },
      {
        question: "Do you have enough volunteers to run Sunday services without YOU being essential to operations?",
        options: [
          { label: "Yes - services can run smoothly if I'm absent", value: 1.5 },
          { label: "Mostly, but certain things fall apart without me", value: 0.5 },
          { label: "No - if I'm not there, things don't function", value: 0 },
        ],
      },
      {
        question: "Can you fill a volunteer vacancy within 2 weeks?",
        options: [
          { label: "Yes - we have a bench of trained people ready to step in", value: 1.5 },
          { label: "It takes a month or more to fill roles", value: 0.5 },
          { label: "No - vacancies stay open until I do it myself", value: 0 },
        ],
      },
      {
        question: "Do you survey volunteers annually about their experience and satisfaction?",
        options: [
          { label: "Yes - annual survey with action items based on feedback", value: 1.5 },
          { label: "We get informal feedback but no structured survey", value: 0.5 },
          { label: "No - we don't ask volunteers how they're doing", value: 0 },
        ],
      },
    ],
  },
  {
    title: "Leadership Pathway",
    questions: [
      {
        question: "Do you have a clear, documented pathway from attendee to volunteer to team leader to ministry leader to staff?",
        options: [
          { label: "Yes - written, communicated, and actively used", value: 1.5 },
          { label: "We have an informal understanding but nothing documented", value: 0.5 },
          { label: "No - leadership happens accidentally", value: 0 },
        ],
      },
      {
        question: "How many people in your church could lead a ministry area without your direct oversight?",
        options: [
          { label: "5+ people lead independently and effectively", value: 1.5 },
          { label: "2-4 people, but they need frequent guidance", value: 0.5 },
          { label: "0-1 - everything requires my involvement", value: 0 },
        ],
      },
      {
        question: "Do you have a leadership development curriculum (classes, mentoring, or training program)?",
        options: [
          { label: "Yes - structured development with regular training", value: 1.5 },
          { label: "I mentor a few people informally", value: 0.5 },
          { label: "No - there's no leadership development process", value: 0 },
        ],
      },
      {
        question: "Is there a succession plan for key roles (what happens if your worship leader, youth pastor, or key volunteer leaves)?",
        options: [
          { label: "Yes - backup plans and development of successors for every key role", value: 1.5 },
          { label: "For some roles, but not comprehensively", value: 0.5 },
          { label: "No - if a key person leaves, we scramble", value: 0 },
        ],
      },
      {
        question: "Do you delegate decision-making authority to other leaders (or do all decisions flow through you)?",
        options: [
          { label: "Leaders make decisions in their areas autonomously", value: 1.5 },
          { label: "Some delegation, but important decisions come to me", value: 0.5 },
          { label: "Nearly all decisions require my approval", value: 0 },
        ],
      },
      {
        question: "Do you have regular staff/leadership meetings with clear agendas and action items?",
        options: [
          { label: "Yes - weekly or bi-weekly with structured format", value: 1.5 },
          { label: "We meet sometimes, but it's informal", value: 0.5 },
          { label: "No - we communicate ad hoc, usually when there's a problem", value: 0 },
        ],
      },
      {
        question: "Can your church operate effectively if you take a 2-week vacation with no phone access?",
        options: [
          { label: "Yes - the team handles everything; I've tested this", value: 1.5 },
          { label: "Probably, but I'd worry and check in", value: 0.5 },
          { label: "No - things would fall apart without me", value: 0 },
        ],
      },
    ],
  },
  {
    title: "Marriage Health Quick-Check",
    questions: [
      {
        question: "How would your spouse rate your presence at home (mentally and emotionally, not just physically)?",
        options: [
          { label: "Fully present - I leave work at work; boundaries are strong", value: 1.5 },
          { label: "Mostly present, but ministry creeps in regularly", value: 0.5 },
          { label: "My spouse would say I'm rarely fully present", value: 0 },
        ],
      },
      {
        question: "How many date nights have you had in the last month (just you and your spouse, no ministry talk)?",
        options: [
          { label: "3-4+ (weekly or near-weekly)", value: 1.5 },
          { label: "1-2", value: 0.5 },
          { label: "0", value: 0 },
        ],
      },
      {
        question: "Has your spouse ever said (or implied) that the church feels like competition for your attention?",
        options: [
          { label: "No - my spouse feels prioritized and valued", value: 1.5 },
          { label: "Occasionally, but we manage it", value: 0.5 },
          { label: "Yes - this is an active tension in our marriage", value: 0 },
        ],
      },
    ],
  },
];
