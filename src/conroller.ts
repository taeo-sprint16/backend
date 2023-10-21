import { Context, Next } from 'koa';
import {
  createAnswer,
  getConfirmAnswer,
  getShareAnswer,
  insertAnswer
} from './model';
import { responseData } from './util';
import { UserQuestion } from './type';
import { answerAnalyze } from './ai_service';


export async function createAnsweCtr (ctx: Context, next: Next) {
  const { nickname, question } = ctx.request.body || {};

  if (nickname === undefined || question === undefined) {
    ctx.status = 200;
    ctx.response.body = responseData(false, '닉네임과 질문을 모두 입력해주세요.');
    return next();
  }

  const {
    confirmCode,
    shareCode
  } = await createAnswer(nickname, question) as unknown as {
    confirmCode: string,
    shareCode: string
  };

  ctx.statue = 200;
  ctx.response.body = responseData(true, '질문지 생성 성공', {
    confirmCode,
    shareCode,
  });
  await next();
}

export async function getShareAnswerCtr (ctx: Context, next: Next) {
  const { shareCode } = ctx.request.body || {};

  if (shareCode === undefined) {
    ctx.status = 200;
    ctx.response.body = responseData(false, '공유받은 코드를 확인해주세요.');
    return next();
  }

  const data = await getShareAnswer(shareCode) as UserQuestion;

  if (!data) {
    ctx.status = 200;
    ctx.response.body = responseData(false, '해당하는 질문지가 없습니다.');
    return next();
  }

  ctx.status = 200;
  ctx.response.body = responseData(true, '질문 가져오기 성공.', {
    nickname: data.nickname,
    question: data.question,
  })

  await next();
}

export async function insertAnswerCtr(ctx: Context, next: Next) {
  const { shareCode, answer } = ctx.request.body || {};

  if (shareCode === undefined || answer === undefined) {
    ctx.status = 200;
    ctx.response.body = responseData(false, '공유받은 코드와 답변을 모두 입력해주세요.');
    return next();
  }

  await insertAnswer(shareCode, answer);

  ctx.status = 201;
  await next();
}

export async function getConfirmAnswerCtr(ctx: Context, next: Next) {
  const { confirmCode } = ctx.request.body || {};

  if (confirmCode === undefined) {
    ctx.status = 200;
    ctx.response.body = responseData(false, '확인코드를 입력해주세요.');
    return next();
  }

  const data = await getConfirmAnswer(confirmCode) as UserQuestion;


  if (!data) {
    ctx.status = 200;
    ctx.response.body = responseData(false, '해당하는 질문지가 없습니다.');
    return next();
  }

  if (data.answers.length === 0) {
    ctx.status = 200;
    ctx.response.body = responseData(true, '질문 가져오기 성공.', {
      nickname: data.nickname,
      question: data.question,
      answers: data.answers,
    });
    return next();
  }

  const text = await answerAnalyze(data);

  ctx.status = 200;
  ctx.response.body = responseData(true, '질문 가져오기 성공.', {
    nickname: data.nickname,
    question: data.question,
    aiAnalyzeText: text,
    answers: data.answers,
  });

  await next();
}
