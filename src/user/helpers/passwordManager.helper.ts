import { Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcrypt';
@Injectable()
export class PasswordManagerHelperClass {
  async encryptPassword(password: string): Promise<string> {
    return hashSync(password, 10);
  }

  async comparePassword({
    password,
    user,
  }: {
    password: string;
    user: any;
  }): Promise<boolean> {
    const { password: currentPassword } = user;
    if (!currentPassword) {
      return false;
    }
    return compareSync(password, currentPassword);
  }
}
