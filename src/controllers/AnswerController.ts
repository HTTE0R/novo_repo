import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
  // http://localhost:3333/answers/10?u=a3be6c77-8d99-45dc-a985-9e33eab22d26
  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { u } = req.query;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u)
    });

    if (!surveyUser) {
      return res.status(400).json({
        error: "Survey user does not exist"
      });
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return res.json(surveyUser);
  }
}

export { AnswerController };
