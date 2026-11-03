import { describe, expect, it } from "vitest";
import { validateGenerated } from "./validate-generated";

const validQuestion = {
  question: "¿Capital de Francia?",
  options: ["París", "Roma", "Madrid"],
  correctAnswer: "París",
};

const validContent = {
  title: "Geografía de Europa",
  summary: { overview: "Un repaso.", keyPoints: ["Punto 1", "Punto 2"] },
  studyRoute: ["Paso 1", "Paso 2"],
  quizQuestions: [validQuestion],
};

describe("validateGenerated", () => {
  it("acepta un contenido válido y lo devuelve limpio", () => {
    const result = validateGenerated(validContent);

    expect(result).not.toBeNull();
    expect(result?.title).toBe("Geografía de Europa");
    expect(result?.quizQuestions).toHaveLength(1);
  });

  it("rechaza lo que no es un objeto", () => {
    expect(validateGenerated(null)).toBeNull();
    expect(validateGenerated("texto")).toBeNull();
    expect(validateGenerated(42)).toBeNull();
  });

  it("rechaza si falta el título", () => {
    expect(validateGenerated({ ...validContent, title: "  " })).toBeNull();
  });

  it("rechaza si falta el resumen", () => {
    expect(
      validateGenerated({ ...validContent, summary: undefined }),
    ).toBeNull();
    expect(
      validateGenerated({
        ...validContent,
        summary: { overview: "", keyPoints: [] },
      }),
    ).toBeNull();
  });

  it("rechaza si no queda ninguna pregunta utilizable", () => {
    expect(
      validateGenerated({ ...validContent, quizQuestions: [] }),
    ).toBeNull();
    expect(
      validateGenerated({ ...validContent, quizQuestions: "nada" }),
    ).toBeNull();
  });

  it("normaliza correctAnswer cuando difiere solo en mayúsculas o espacios", () => {
    const result = validateGenerated({
      ...validContent,
      quizQuestions: [{ ...validQuestion, correctAnswer: "  PARÍS " }],
    });

    // Debe quedar exactamente igual que la opción, para que el servidor pueda compararla
    expect(result?.quizQuestions[0].correctAnswer).toBe("París");
  });

  it("descarta la pregunta cuya respuesta correcta no está en las opciones", () => {
    const result = validateGenerated({
      ...validContent,
      quizQuestions: [
        { ...validQuestion, correctAnswer: "Berlín" },
        {
          question: "¿Capital de Italia?",
          options: ["Roma", "Milán"],
          correctAnswer: "Roma",
        },
      ],
    });

    expect(result?.quizQuestions).toHaveLength(1);
    expect(result?.quizQuestions[0].question).toBe("¿Capital de Italia?");
  });

  it("rechaza todo el contenido si todas las preguntas son inválidas", () => {
    const result = validateGenerated({
      ...validContent,
      quizQuestions: [{ ...validQuestion, correctAnswer: "Berlín" }],
    });

    expect(result).toBeNull();
  });

  it("descarta preguntas con menos de dos opciones distintas", () => {
    const result = validateGenerated({
      ...validContent,
      quizQuestions: [
        {
          question: "¿Pregunta?",
          options: ["Única", "Única"],
          correctAnswer: "Única",
        },
        validQuestion,
      ],
    });

    expect(result?.quizQuestions).toHaveLength(1);
    expect(result?.quizQuestions[0].question).toBe("¿Capital de Francia?");
  });

  it("elimina opciones duplicadas y textos vacíos de las listas", () => {
    const result = validateGenerated({
      ...validContent,
      summary: { overview: "Un repaso.", keyPoints: ["Punto 1", "", "  ", 3] },
      quizQuestions: [
        { ...validQuestion, options: ["París", "París", "Roma", ""] },
      ],
    });

    expect(result?.summary.keyPoints).toEqual(["Punto 1"]);
    expect(result?.quizQuestions[0].options).toEqual(["París", "Roma"]);
  });
});
