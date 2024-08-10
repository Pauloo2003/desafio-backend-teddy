import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { jwtConfig } from '../config/jwtConfig';
import bcrypt from 'bcrypt';
const generateTokens = (userId: number) => {
    const accessToken = jwt.sign({ userId}, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    const refreshToken = jwt.sign({ userId }, jwtConfig.refreshTokenSecret, { expiresIn: jwtConfig.refreshTokenExpiresIn });
    return { accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error('Credenciais Invalidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('E-mail ou senha inválidos');
    }
    return generateTokens(user.id);
};

export const refreshTokenService = (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, jwtConfig.refreshTokenSecret);
        return generateTokens((decoded as any).userId);
    } catch (error) {
        throw new Error('Invalido refresh token');
    }
};
