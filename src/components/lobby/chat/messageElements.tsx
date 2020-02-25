import React from 'react';
import { Comment } from 'semantic-ui-react';

export default function MessageElements(props: any) {
  return props.messages
    .map(message => {
      let acceptGame;
      if (message.opponent) {
        acceptGame = (
          <Comment.Actions>
            <Comment.Action onClick={() => acceptChallenge(message.user)}>
              Accept Challenge
            </Comment.Action>
          </Comment.Actions>
        );
      }
      return (
        <Comment key={message.id}>
          <Comment.Content>
            <Comment.Author>{message.user}</Comment.Author>
            <Comment.Text>{message.message}</Comment.Text>
            {acceptGame}
          </Comment.Content>
        </Comment>
      );
    })
    .reverse();

  async function acceptChallenge(opponent: string) {
    const { user } = props;
    const room = await user.createRoom({
      name: `${user.id} vs ${opponent}`,
      addUserIds: [opponent],
    });
    return props.startGameCallback(user, room, opponent);
  }
}
