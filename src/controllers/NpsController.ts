import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  async execute (req: Request, res: Response) {
    const { survey_id } = req.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveyUser = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });
    const detractor = surveyUser.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;
    const promoters = surveyUser.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;
    const passive = surveyUser.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;
    const totalAnswers = surveyUser.length;
    const calculate = ((promoters - detractor) / totalAnswers) * 100;

    return res.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: calculate
    });
  }
}

export { NpsController };
