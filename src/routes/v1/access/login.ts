import express, { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../../utils/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError, AuthFailureError, InternalError } from '../../../utils/ApiError';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import { createTokens } from '../../../auth/AuthUtils';
import validator from '../../../helpers/validator';
import { userCredentialSchema } from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';

const router = express.Router();

router.post('/basic', validator(userCredentialSchema), asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {

		const user = await UserRepo.findByEmail(req.body.email);
		if (!user) throw new BadRequestError('User not registered');
		if (!user.password) throw new BadRequestError('Credential not set');

		const match = await bcrypt.compare(req.body.password, user.password);
		if (!match) throw new AuthFailureError('Authentication failure');

		const accessTokenKey = crypto.randomBytes(64).toString('hex');
		const refreshTokenKey = crypto.randomBytes(64).toString('hex');

		await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
		const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

		new SuccessResponse('Login Success', {
			user: _.pick(user, ['name', 'email']),
			tokens: tokens
		}).send(res);
	}));

module.exports = router;