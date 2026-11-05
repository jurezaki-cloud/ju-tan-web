export type QuizQuestion = {
  id: string;
  category: string;
  prompt: string;
  choices: readonly string[];
  correct: string;
  explanation: string;
  source: string;
};
const gov = "https://www.gov.si/podrocja/drzava-in-druzba/o-sloveniji/";
export const quizQuestions: readonly QuizQuestion[] = [
  {
    id: "capital",
    category: "Kraji",
    prompt: "Katero je glavno mesto Slovenije?",
    choices: ["Ljubljana", "Maribor", "Celje", "Koper"],
    correct: "Ljubljana",
    explanation: "Glavno mesto Republike Slovenije je Ljubljana.",
    source: gov,
  },
  {
    id: "peak",
    category: "Narava",
    prompt: "Kateri je najvišji slovenski vrh?",
    choices: ["Triglav", "Stol", "Grintovec", "Mangart"],
    correct: "Triglav",
    explanation: "Triglav doseže 2864 metrov nadmorske višine.",
    source: gov,
  },
  {
    id: "alps",
    category: "Narava",
    prompt: "V katerem gorstvu stoji Triglav?",
    choices: [
      "Julijske Alpe",
      "Karavanke",
      "Kamniško-Savinjske Alpe",
      "Pohorje",
    ],
    correct: "Julijske Alpe",
    explanation: "Triglav je del Julijskih Alp.",
    source: gov,
  },
  {
    id: "borders",
    category: "Geografija",
    prompt: "S katero od teh držav Slovenija nima kopenske meje?",
    choices: ["Slovaška", "Avstrija", "Madžarska", "Italija"],
    correct: "Slovaška",
    explanation: "Sosednje države so Italija, Avstrija, Madžarska in Hrvaška.",
    source: gov,
  },
  {
    id: "independence",
    category: "Zgodovina",
    prompt: "Katerega leta je Slovenija postala samostojna država?",
    choices: ["1991", "1981", "2001", "2004"],
    correct: "1991",
    explanation: "Slovenija je postala samostojna 25. junija 1991.",
    source: gov,
  },
  {
    id: "eu",
    category: "Zgodovina",
    prompt: "Katerega leta je Slovenija vstopila v Evropsko unijo?",
    choices: ["2004", "1991", "1999", "2007"],
    correct: "2004",
    explanation: "Slovenija se je Evropski uniji pridružila leta 2004.",
    source: gov,
  },
  {
    id: "euro",
    category: "Zgodovina",
    prompt: "Katerega leta je Slovenija uvedla evro?",
    choices: ["2007", "2004", "1991", "2010"],
    correct: "2007",
    explanation: "Evro je v Sloveniji v uporabi od leta 2007.",
    source: gov,
  },
  {
    id: "un",
    category: "Zgodovina",
    prompt: "Katerega leta je bila Slovenija sprejeta v Združene narode?",
    choices: ["1992", "1991", "1995", "2004"],
    correct: "1992",
    explanation: "Članica Združenih narodov je postala 22. maja 1992.",
    source: gov,
  },
  {
    id: "bee",
    category: "Narava",
    prompt: "Katera žival je kranjska sivka?",
    choices: ["Čebela", "Metulj", "Ptica", "Riba"],
    correct: "Čebela",
    explanation: "Kranjska sivka je medonosna čebela Apis mellifera carnica.",
    source: gov,
  },
  {
    id: "beeday",
    category: "Narava",
    prompt:
      "Kdaj praznujemo svetovni dan čebel, razglašen na pobudo Slovenije?",
    choices: ["20. maja", "22. aprila", "25. junija", "8. februarja"],
    correct: "20. maja",
    explanation: "Svetovni dan čebel je 20. maja.",
    source: gov,
  },
  {
    id: "horse",
    category: "Dediščina",
    prompt: "Katera pasma konj izvira iz Slovenije?",
    choices: ["Lipicanec", "Arabski konj", "Mustang", "Šetlandski poni"],
    correct: "Lipicanec",
    explanation: "Slovenija je domovina lipicancev.",
    source: gov,
  },
  {
    id: "olm",
    category: "Narava",
    prompt: "Kako imenujemo jamsko dvoživko Proteus anguinus?",
    choices: [
      "Človeška ribica",
      "Zelena rega",
      "Planinski močerad",
      "Navadni pupek",
    ],
    correct: "Človeška ribica",
    explanation: "Človeška ribica je značilna prebivalka kraških jam.",
    source:
      "https://www.slovenia.info/en/places-to-go/attractions/postojna-cave",
  },
];
export const ROUND_LENGTH = 10;
function shuffled<T>(items: readonly T[], random: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}
export function createQuizRound(random: () => number = Math.random) {
  return shuffled(quizQuestions, random)
    .slice(0, ROUND_LENGTH)
    .map((question) => ({
      ...question,
      choices: shuffled(question.choices, random),
    }));
}
export type QuizState = {
  phase: "intro" | "playing" | "result";
  round: QuizQuestion[];
  index: number;
  answers: string[];
};
export const initialQuiz: QuizState = {
  phase: "intro",
  round: [],
  index: 0,
  answers: [],
};
export type QuizAction =
  | { type: "start"; round: QuizQuestion[] }
  | { type: "answer"; choice: string }
  | { type: "next" }
  | { type: "reset" };
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  if (action.type === "reset") return initialQuiz;
  if (action.type === "start")
    return action.round.length
      ? { phase: "playing", round: action.round, index: 0, answers: [] }
      : state;
  if (state.phase !== "playing") return state;
  if (action.type === "answer") {
    if (
      state.answers.length > state.index ||
      !state.round[state.index].choices.includes(action.choice)
    )
      return state;
    return { ...state, answers: [...state.answers, action.choice] };
  }
  if (state.answers.length <= state.index) return state;
  return state.index === state.round.length - 1
    ? { ...state, phase: "result" }
    : { ...state, index: state.index + 1 };
}
export function quizScore(state: QuizState) {
  return state.answers.reduce(
    (score, answer, index) =>
      score + (answer === state.round[index]?.correct ? 100 : 0),
    0,
  );
}
