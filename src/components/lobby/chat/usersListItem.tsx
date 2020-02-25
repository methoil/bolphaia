import React, { useState, useEffect } from 'react';
import { Grid, List, Comment, Form, Input, Icon } from 'semantic-ui-react';
import { IUser } from '../lobby';
import { IRoom } from '../rooms';

export default function UsersListItems(props: any) {
  return props.users
    .filter(user => user.id !== props.user.id)
    .map(user => {
      const statusIcon =
        user.presence.state === 'online' ? (
          <Icon title="online" name="circle" color="green"></Icon>
        ) : (
          <Icon title="offline" name="circle outline"></Icon>
        );
      return (
        <List.Item key={user.id}>
          <List.Content floated="right">
            <a
              onClick={() => challengePlayer(props.user, user, props.room)}
              title="The player must be online to see and accept your challenge"
            >
              Challenge
            </a>
          </List.Content>
          <List.Content>
            {statusIcon} {user.name}
          </List.Content>
        </List.Item>
      );
    });
}

function challengePlayer(user: IUser, opponent: IUser, room: IRoom) {
  user.sendMessage({
    text: `I challenge ${opponent.name} to a game`,
    roomId: room.id,
    attachment: {
      link: `urn:player:${opponent.id}`,
      type: 'file',
      fetchRequired: false,
    },
  });
}
