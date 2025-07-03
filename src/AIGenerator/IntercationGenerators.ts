import { AIChat } from './OpenAI';

const ActorRoles = {
  darkHumorWriter:
    "You're a creative, twisted, witty dark comedy writer for adults. Be sharp, edgy, dirty, weird, and surprising. Use userInfo if available.",
  //—but still readable and usable in a social app context.
};

interface UserKeyDesc {
  key: string;
  description: string;
}

type UserInfo = UserKeyDesc[];

export const AIgeneratesInteraction = async (prompt: string) => {
  const generatedPrompt = `Generate unique joke: ${prompt} Make it ideally under 10 words.`;

  const generated = await AIChat.chat(
    generatedPrompt,
    ActorRoles.darkHumorWriter,
    undefined,
  );
  return {
    generated,
    prompt: generatedPrompt,
  };
};

export const UserSpecificGenerator = async (
  prompt: string,
  userInfo: UserInfo,
) => {
  const aboutUser = userInfo
    .map((info) => {
      return `${info.key}: ${info.description}`;
    })
    .join('\n');

  return await AIgeneratesInteraction(
    `${prompt}, UserInformation:\n${aboutUser}\n`,
  );
};

// when one user interacts another
export const U2Ugenerator = async (
  prompt: string,
  IuserInfo: UserInfo,
  IIuserInfo: UserInfo,
) => {
  const aboutUser1 = IuserInfo.map((info) => {
    return `${info.key}: ${info.description}`;
  }).join('\n');

  const aboutUser2 = IIuserInfo.map((info) => {
    return `${info.key}: ${info.description}`;
  }).join('\n');

  return await AIgeneratesInteraction(
    `${prompt}, User 1 Information:\n${aboutUser1}\nUser 2 Information:\n${aboutUser2}\n`,
  );
};

export const followJokeGenerator = async (
  IuserInfo?: UserInfo,
  IIuserInfo?: UserInfo,
) => {
  return await U2Ugenerator(
    'User just follewed another user, generate a joke about it',
    IuserInfo || [],
    IIuserInfo || [],
  );
};

export const followJokeGeneratorGeneral = async (action: 'followed' | 'unfollowed') => {
  return await AIgeneratesInteraction(
    `User just ${action} another user. don't always use general words like Congrats, Stalking...`,
  );
};
