import { Model, Schema as MongooSchema } from 'mongoose';


const sendPushNotification = async (
  expoPushToken: string,
  title: string,
  description: string,
  userId?: MongooSchema.Types.ObjectId,
) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body: description,
    data: {userId: userId},
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export const sendFollowNotification = async (
  expoPushToken: string,
  name: string,
  userId?: MongooSchema.Types.ObjectId,
) => {
  sendPushNotification(
    expoPushToken,
    `${name} is watching you`,
    'Make their life harder!',
    userId
  );
};

export const sendCreateJokeNotification = async (
  expoPushToken: string,
  name: string,
  userId?: MongooSchema.Types.ObjectId,
) => {
  sendPushNotification(
    expoPushToken,
    `${name}`,
    'Is boiling something!',
    userId
  );
};
