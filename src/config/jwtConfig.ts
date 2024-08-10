export const jwtConfig = {
    secret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    expiresIn: process.env.EXPIRE_TIME as string,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME as string
};
