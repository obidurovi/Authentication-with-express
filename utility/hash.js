import bcrypt from 'bcryptjs';

/**
 * make hash
 */

export const makeHash = (password) => {
    const genSalt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, genSalt);
    return hash;
}