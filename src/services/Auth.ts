import jwt from 'jsonwebtoken';
import {Users} from '../repositories/User';
import { jwtConfig } from '../config/jwtConfig';
import bcrypt from 'bcrypt';
import {logger} from "sequelize/types/utils/logger";
const userRepository = new Users();
const generateTokens = (userId: number) => {
    const accessToken = jwt.sign({ userId}, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    const refreshToken = jwt.sign({ userId }, jwtConfig.refreshTokenSecret, { expiresIn: jwtConfig.refreshTokenExpiresIn });
    return { accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
    const user : any = await userRepository.findOne({ where: { email , deletedAt : null } });
    if (!user) {
        throw new Error('Credenciais Invalidas');
    }
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
        throw new Error('E-mail ou senha inválidos');
    }
    return generateTokens(user[0].id);
};

export const refreshTokenService = (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, jwtConfig.refreshTokenSecret);
        return generateTokens((decoded as any).userId);
    } catch (error) {
        throw new Error('Invalido refresh token');
    }
};
