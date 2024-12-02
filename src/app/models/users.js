import bcrypt from 'bcrypt';
import sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: sequelize.STRING,
        email: sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: sequelize.STRING,
        admin: sequelize.BOOLEAN,
      },
      {
        sequelize,
      },
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });

    return this;
  }
}

export default User;
