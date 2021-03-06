import { RequestHandler } from 'express';
/* tslint:disable:no-console */
import { User } from '../../models/User';
import { Jwt } from '../auth/utils/Jwt';
import { messages } from '../../config/app/messages';
import {
  RequestError,
  RequestErrorType,
} from '../../error-handler/RequestError';

export const login: RequestHandler = async (req, res, next) => {
  try {
    req.body.username = (req.body.username as string).toLowerCase();
    const user: any = await User.findOne({ email: req.body.username })
      .populate('role')
      .exec();
    if (!user) {
      return next(
        new RequestError(RequestErrorType.LOGIN_FAILED, messages.noUser.ENG),
      );
    }

    const compare = await user.comparePassword(req.body.password);
    if (!compare) {
      return next(
        new RequestError(RequestErrorType.LOGIN_FAILED, messages.noUser.ENG),
      );
    }

    if (!user.role) {
      user.role = { role: 'User' };
    }

    const accessToken = await Jwt.sign({
      userId: user._id,
      role: user.role.role,
      userFullName:
        user.firstName + ' ' + user.middleName + ' ' + user.lastName,
    });

    return res.status(200).send({
      success: true,
      data: user,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return next(new RequestError(RequestErrorType.INTERNAL_SERVER_ERROR, err));
  }
};
