import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;
    const schema = yup.object().shape({
      name: yup.string().required("Nome é obrigatório"),
      email: yup.string().email().required("Email incorreto")
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error);
    }

    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findOne({ email });

    if (user) {
      throw new AppError("User already exists!");
    }
    
    const save = usersRepository.create({
      name,
      email
    });

    await usersRepository.save(save);

    return res.status(201).json(save);
  }
}

export { UserController };
