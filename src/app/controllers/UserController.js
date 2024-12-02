import { v4 } from 'uuid';

import User from '../models/users';

class UserController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = resquest.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password_hash,
      admin,
    });

    return response.status(201).json({
      id: user.id,
      name,
      email,
    });
  }
}

export default new UserController();