import assert from "node:assert/strict";
import test from "node:test";
import {
  createQuizRound,
  initialQuiz,
  quizQuestions,
  quizReducer,
  quizScore,
  ROUND_LENGTH,
} from "./quiz";

test("question bank has unique IDs, choices, one answer and primary-source URLs", () => {
  assert.equal(
    new Set(quizQuestions.map((q) => q.id)).size,
    quizQuestions.length,
  );
  for (const q of quizQuestions) {
    assert.equal(q.choices.length, 4);
    assert.equal(new Set(q.choices).size, 4);
    assert.equal(q.choices.filter((c) => c === q.correct).length, 1);
    assert.ok(
      ["www.gov.si", "www.slovenia.info"].includes(new URL(q.source).hostname),
    );
  }
});
test("shuffled rounds preserve answers and never mutate or repeat source questions", () => {
  const before = JSON.stringify(quizQuestions);
  const round = createQuizRound(() => 0.25);
  assert.equal(round.length, ROUND_LENGTH);
  assert.equal(new Set(round.map((q) => q.id)).size, ROUND_LENGTH);
  for (const q of round)
    assert.equal(q.choices.filter((c) => c === q.correct).length, 1);
  assert.equal(JSON.stringify(quizQuestions), before);
  assert.notDeepEqual(
    round.map((q) => q.id),
    createQuizRound(() => 0.9).map((q) => q.id),
  );
});
test("answers cannot be skipped, injected or counted twice", () => {
  const state = quizReducer(initialQuiz, {
    type: "start",
    round: createQuizRound(() => 0.5),
  });
  assert.equal(quizReducer(state, { type: "next" }), state);
  assert.equal(
    quizReducer(state, { type: "answer", choice: "invalid" }),
    state,
  );
  const answered = quizReducer(state, {
    type: "answer",
    choice: state.round[0].correct,
  });
  assert.equal(quizScore(answered), 100);
  assert.equal(
    quizReducer(answered, {
      type: "answer",
      choice: state.round[0].choices[0],
    }),
    answered,
  );
  const next = quizReducer(answered, { type: "next" });
  assert.equal(quizReducer(next, { type: "next" }), next);
});
test("full round calculates mixed score, locks completion and resets all answers", () => {
  let state = quizReducer(initialQuiz, {
    type: "start",
    round: createQuizRound(() => 0.5),
  });
  for (let i = 0; i < ROUND_LENGTH; i++) {
    const q = state.round[i];
    state = quizReducer(state, {
      type: "answer",
      choice: i < 7 ? q.correct : q.choices.find((c) => c !== q.correct)!,
    });
    state = quizReducer(state, { type: "next" });
  }
  assert.equal(state.phase, "result");
  assert.equal(quizScore(state), 700);
  assert.equal(quizReducer(state, { type: "next" }), state);
  assert.equal(
    quizReducer(state, { type: "answer", choice: state.round[0].correct }),
    state,
  );
  assert.deepEqual(quizReducer(state, { type: "reset" }), initialQuiz);
});
