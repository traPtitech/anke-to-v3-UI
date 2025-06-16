export const useRouteQuestionnaireId = () => {
  const route = useRoute();
  const questionnaireID = Number(route.params.questionnaireId);
  if (isNaN(questionnaireID)) {
    throw new Error("Invalid questionnaire ID");
  }
  return questionnaireID;
};

export const useRouteResponseId = () => {
  const route = useRoute();
  const responseID = Number(route.params.responseId);
  if (isNaN(responseID)) {
    throw new Error("Invalid response ID");
  }
  return responseID;
};
