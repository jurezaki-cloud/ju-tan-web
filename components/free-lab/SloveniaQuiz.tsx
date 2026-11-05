"use client";

import { useEffect, useReducer, useRef } from "react";
import { Trophy, ArrowRight, RotateCcw } from "lucide-react";
import {
  createQuizRound,
  initialQuiz,
  quizReducer,
  quizScore,
  ROUND_LENGTH,
} from "@/lib/free-lab/quiz";
import styles from "./slovenia-quiz.module.css";

export default function SloveniaQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialQuiz);
  const heading = useRef<HTMLHeadingElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const hasPlayed = useRef(false);
  const answer = state.answers[state.index];
  const question = state.round[state.index];
  const score = quizScore(state);
  useEffect(() => {
    if (state.phase !== "intro") {
      hasPlayed.current = true;
      heading.current?.focus();
    } else if (hasPlayed.current) startButton.current?.focus();
  }, [state.phase, state.index]);
  return (
    <section className={styles.quiz} aria-label="Kviz o Sloveniji">
      {state.phase === "intro" ? (
        <div className={styles.intro}>
          <Trophy size={48} aria-hidden="true" />
          <p className={styles.kicker}>SOLO IZZIV · BREZ ČASOVNE OMEJITVE</p>
          <h2>Koliko Slovenije poznaš?</h2>
          <p>
            Deset vprašanj. Štiri možnosti. Za vsak pravilen odgovor dobiš 100
            točk. Po odgovoru odkriješ razlago in vir.
          </p>
          <div className={styles.stats}>
            <span>
              <strong>{ROUND_LENGTH}</strong> vprašanj
            </span>
            <span>
              <strong>1000</strong> možnih točk
            </span>
            <span>
              <strong>0 €</strong> za igro
            </span>
          </div>
          <button
            ref={startButton}
            className={styles.primary}
            onClick={() =>
              dispatch({ type: "start", round: createQuizRound() })
            }
          >
            Začni kviz <ArrowRight size={18} aria-hidden="true" />
          </button>
          <p className={styles.note}>
            Prva zbirka vsebuje 12 vprašanj. Vrstni red vprašanj in možnosti se
            premeša ob vsaki igri. Večigralski način še ni na voljo.
          </p>
        </div>
      ) : state.phase === "playing" ? (
        <>
          <div className={styles.top}>
            <span>
              Vprašanje {state.index + 1} / {state.round.length}
            </span>
            <span>{score} točk</span>
          </div>
          <progress
            aria-label="Odgovorjena vprašanja"
            value={state.answers.length}
            max={state.round.length}
          />
          <p className={styles.kicker}>{question.category}</p>
          <h2 tabIndex={-1} ref={heading} className={styles.question}>
            {question.prompt}
          </h2>
          <div
            className={styles.answers}
            role="group"
            aria-label="Izberi en odgovor"
          >
            {question.choices.map((choice, index) => (
              <button
                key={choice}
                disabled={answer !== undefined}
                className={
                  answer === undefined
                    ? undefined
                    : choice === question.correct
                      ? styles.correct
                      : choice === answer
                        ? styles.wrong
                        : undefined
                }
                onClick={() => dispatch({ type: "answer", choice })}
              >
                <span className={styles.letter} aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>
                  {choice}
                  {answer !== undefined && choice === question.correct && (
                    <small>Pravilni odgovor</small>
                  )}
                  {answer === choice && choice !== question.correct && (
                    <small>Tvoj odgovor</small>
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className={styles.feedback} role="status" aria-live="polite">
            {answer !== undefined && (
              <>
                <strong>
                  {answer === question.correct
                    ? "Pravilno! +100 točk."
                    : `Pravilni odgovor: ${question.correct}.`}
                </strong>
                <p>{question.explanation}</p>
              </>
            )}
          </div>
          {answer !== undefined && (
            <div className={styles.next}>
              <a
                href={question.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preberi vir{" "}
                <span className={styles.srOnly}>
                  (odpre se v novem zavihku)
                </span>
              </a>
              <button
                className={styles.primary}
                onClick={() => dispatch({ type: "next" })}
              >
                {state.index === state.round.length - 1
                  ? "Poglej rezultat"
                  : "Naslednje vprašanje"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <p className={styles.kicker}>IZZIV OPRAVLJEN</p>
          <h2 tabIndex={-1} ref={heading} className={styles.question}>
            {score === 1000
              ? "Popolna desetka!"
              : score >= 700
                ? "Odlično poznaš Slovenijo."
                : "Vsaka igra prinese novo znanje."}
          </h2>
          <p className={styles.score}>
            {score}
            <span> / {state.round.length * 100} točk</span>
          </p>
          <p>
            {score / 100} od {state.round.length} pravilnih odgovorov.
          </p>
          <button
            className={styles.primary}
            onClick={() =>
              dispatch({ type: "start", round: createQuizRound() })
            }
          >
            <RotateCcw size={18} aria-hidden="true" /> Igraj znova
          </button>
          <div className={styles.review}>
            <h3>Tvoj pregled odgovorov</h3>
            {state.round.map((item, index) => (
              <details key={item.id}>
                <summary>
                  {index + 1}. {item.prompt}
                  <span>
                    {state.answers[index] === item.correct
                      ? "Pravilno"
                      : "Napačno"}
                  </span>
                </summary>
                <p>
                  Tvoj odgovor: {state.answers[index]}
                  <br />
                  Pravilni odgovor: {item.correct}
                </p>
                <p>{item.explanation}</p>
                <a href={item.source} target="_blank" rel="noopener noreferrer">
                  Preberi vir (nov zavihek)
                </a>
              </details>
            ))}
          </div>
        </>
      )}
      {state.phase !== "intro" && (
        <button
          className={styles.reset}
          onClick={() => dispatch({ type: "reset" })}
        >
          Končaj in izbriši rezultat
        </button>
      )}
      <p className={styles.note}>
        Igra poteka v tem zavihku. Rezultata ne shranjujemo in nimamo javne
        lestvice. Osvežitev strani začne igro znova.
      </p>
    </section>
  );
}
