import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User already exists!" });
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
