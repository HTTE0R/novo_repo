import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const user = await usersRepository.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User does not exists"
      });
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      return res.status(400).json({
        error: "Survey does not exists!"
      });
    }

    const newSurveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id: survey.id
    });

    await surveysUsersRepository.save(newSurveyUser);

    return res.json(newSurveyUser);
  }
}

export { SendMailController };
