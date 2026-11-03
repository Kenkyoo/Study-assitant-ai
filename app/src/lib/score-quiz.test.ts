import { describe, expect, it } from "vitest";
import { parseAnswers, scoreQuiz } from "./score-quiz";

const questions = [
  { question: "P1", options: ["A", "B"], correctAnswer: "A" },
  { question: "P2", options: ["C", "D"], correctAnswer: "D" },
  { question: "P3", options: ["E", "F"], correctAnswer: "E" },
];

describe("scoreQuiz", () => {
  it("cuenta todos los aciertos", () => {
    expect(scoreQuiz(questions, ["A", "D", "E"])).toBe(3);
  });

  it("devuelve 0 si no acierta ninguna", () => {
    expect(scoreQuiz(questions, ["B", "C", "F"])).toBe(0);
  });

  it("cuenta solo las correctas en un resultado parcial", () => {
    expect(scoreQuiz(questions, ["A", "C", "E"])).toBe(2);
  });

  it("trata una pregunta sin contestar (null) como fallo", () => {
    expect(scoreQuiz(questions, ["A", null, null])).toBe(1);
  });

  it("compara de forma exacta, sin ignorar mayúsculas", () => {
    expect(scoreQuiz(questions, ["a", "d", "e"])).toBe(0);
  });
});

describe("parseAnswers", () => {
  it("acepta strings y null con la longitud esperada", () => {
    expect(parseAnswers(["A", null, "E"], 3)).toEqual(["A", null, "E"]);
  });

  it("rechaza lo que no es un array", () => {
    expect(parseAnswers(undefined, 3)).toBeNull();
    expect(parseAnswers("A,D,E", 3)).toBeNull();
    expect(parseAnswers({ 0: "A" }, 3)).toBeNull();
  });

  it("rechaza si la longitud no coincide con la cantidad de preguntas", () => {
    expect(parseAnswers(["A", "D"], 3)).toBeNull();
    expect(parseAnswers(["A", "D", "E", "F"], 3)).toBeNull();
  });

  it("rechaza elementos que no son string ni null", () => {
    expect(parseAnswers(["A", 2, "E"], 3)).toBeNull();
    expect(parseAnswers(["A", undefined, "E"], 3)).toBeNull();
    expect(parseAnswers(["A", {}, "E"], 3)).toBeNull();
  });
});
