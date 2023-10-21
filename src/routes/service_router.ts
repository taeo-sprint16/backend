import Router from '@koa/router';
import {
  createAnsweCtr, getConfirmAnswerCtr,
  getShareAnswerCtr,
  insertAnswerCtr
} from '../conroller';

const router = new Router();

export const serviceRouter = router
  .post('질문 작성하기', '/create', createAnsweCtr)
  .post('[공유링크접근] 질문 가져오기', '/share', getShareAnswerCtr)
  .post('답변 작성하기', '/answer', insertAnswerCtr)
  .post('내 질문지 가져오기', '/confirm', getConfirmAnswerCtr);
