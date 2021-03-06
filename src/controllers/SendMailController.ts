import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      throw new AppError("Survey does not exists!");
    }

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    };
    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMails.hbs');
    const surveyUser = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id, value: null }],
      relations: ["user", "survey"]
    });

    if (surveyUser) {
      variables.id = surveyUser.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return res.json(surveyUser);
    }

    const newSurveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id: survey.id
    });

    await surveysUsersRepository.save(newSurveyUser);
    variables.id = newSurveyUser.id;

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return res.json(newSurveyUser);
  }
}

export { SendMailController };
