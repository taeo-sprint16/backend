import OpenAI from 'openai';
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import { UserQuestion } from './type';
import openai from '../config/openai_config';

export async function answerAnalyze (data: UserQuestion) {
  try {
    const answers = data.answers;

    const prompts = answers.map((ans) => {
      return {
        role : 'user',
        content : `어느 친구의 대답: ${ans.answer}`,
      } as unknown as ChatCompletionMessageParam;
    }).slice(0, 10);

    prompts.push({
      role : 'system',
      content : `${data.nickname}의 질문에 대한 여러 친구들의 대답을 종합했을때 ${data.nickname}는 어떤 친구들을 갖고 있는지 센스있고 재치있게 30자 내로 무조건 반말로 설명해줘. 만약 친구들의 대답 중 대다수의 질문이 의미없는 내용일 경우 정상적인 대답이 많이 없어서 분석이 어렵다고만 반말로 말해줘.`
    } as unknown as ChatCompletionMessageParam);
    const response = await openai.chat.completions.create({
      model : 'gpt-4',
      messages : prompts,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return 'OpenAI의 요청 불안정으로 분석할 수 없습니다.';
  }
}
