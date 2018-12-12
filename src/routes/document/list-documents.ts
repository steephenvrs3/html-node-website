/* tslint:disable:no-console */
import { RequestHandler } from 'express';
import {
  RequestError,
  RequestErrorType,
} from '../../error-handler/RequestError';
import { Promise as BluePromise } from 'bluebird';

import { Document } from '../../models/Document';
import { User } from '../../models/User';
import { DocType } from '../../models/DocType';

export const listDocsFolders: RequestHandler = async (req, res, next) => {
  try {
    const groupedDocs = await Document.aggregate([
      { $match: { isDelete: false } },
      { $unwind: '$accessRights' },
      {
        $group: {
          _id: '$docType',
          ar: { $addToSet: '$accessRights' },
        },
      },
    ]).exec();

    const details: any = [];

    if (groupedDocs.length) {
      await BluePromise.map(groupedDocs, async (docs: any) => {
        const dc = await DocType.findOne(docs._id)
          .select('docType')
          .exec();
        details.push(dc);
        const records = await User.find({ _id: { $in: docs.ar } })
          .select('firstName lastName')
          .exec();
        details.push(records);
      });
      console.log(details);
    }

    return res.send({ success: true, data: details });
  } catch (err) {
    console.log(err);
    return next(new RequestError(RequestErrorType.BAD_REQUEST, err));
  }
};
