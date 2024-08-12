import jwt from 'jsonwebtoken';
import { Users } from '../repositories/User';
import { jwtConfig } from '../config/jwtConfig';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';  // Importando o logger

const userRepository = new Users();

const generateTokens = (userId: number) => {
    const accessToken = jwt.sign({ userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    const refreshToken = jwt.sign({ userId }, jwtConfig.refreshTokenSecret, { expiresIn: jwtConfig.refreshTokenExpiresIn });
    return { accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
    try {
        const user: any = await userRepository.findOne({ where: { email, deletedAt: null } });
        if (!user || user.length === 0) {
            logger.warn(`Login falhou: Credenciais inválidas para ${email}`);
            throw new Error('Credenciais Inválidas');
        }
        console.log(user[0].password)
        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
            logger.warn(`Login falhou: Senha inválida para ${email}`);
            throw new Error('E-mail ou senha inválidos');
        }
        return generateTokens(user[0].id);
    } catch (error: any) {
        logger.error(`Erro ao tentar login para ${email}: ${error.message}`);
        throw new Error(error.message);
    }
};

export const refreshTokenService = (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, jwtConfig.refreshTokenSecret);
        logger.info('Refresh token validado com sucesso');
        return generateTokens((decoded as any).userId);
    } catch (error: any) {
        logger.error(`Falha ao validar refresh token: ${error.message}`);
        throw new Error('Token de refresh inválido');
    }
};
