import { Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  algorithm = 'aes-256-cbc';
  key: Buffer;
  iv: Buffer;

  constructor(private configService: ConfigService) {
    const env_key = configService.get('CRYPTO_KEY');
    const env_iv = configService.get('CRYPTO_IV');
    this.key = Buffer.from(env_key, 'base64');
    this.iv = Buffer.from(env_iv, 'base64');
  }
  
  /**
   * Encrypts a plain text password using AES-256-CBC.
   *
   * @param password - The plain text password to be encrypted.
   * @returns The encrypted password in hexadecimal format.
   */
  encryptPassword(password: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Decrypts an encrypted password using AES-256-CBC.
   *
   * @param encryptedData - The encrypted password in hexadecimal format.
   * @returns The decrypted plain text password.
   */
  decryptPassword(encryptedData: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * This method is used to convert plain password string to hashed string
   *
   * @param password
   */
  getPasswordHash(password: string): string {
    return hashSync(password, 10);
  }

  /**
   * This method is used to match the plain password string (entered by user) with hashed password string (stored in database)
   *
   * @param password
   * @param hash
   */
  validatePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  /**
   * This method is used to generate the new uuid
   */
  getUUID(): string {
    return uuid();
  }
}
