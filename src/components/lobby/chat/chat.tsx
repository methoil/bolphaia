import React, { useState, useEffect } from 'react';
import { Grid, List, Comment, Form, Input, Icon } from 'semantic-ui-react';
import { IRoom } from '../rooms';
import { IUser } from '../lobby';
import GameBoard from '../../game/game';
import { playerIds } from '../../game/game.model';
import UsersListItems from './usersListItem';
import MessageElements from './messageElements';

let playerSide = playerIds.phrygians;
let opponentId = '';

interface IMessage {
  id: string;
  user: string;
  message: string;
  opponent?: string;
}

interface IChatProps {
  user: IUser;
  room: IRoom;
  gameGameRoomId: string;
  startedGame: (roomId: string, white: string, black: string) => Promise<any>;
}

interface IChatState {
  users: IUser[];
  messages: IMessage[];
  newMessage: string;
}

interface IChatComponent {
  // messagesEnd: any;
  gameBoard: HTMLElement | undefined;
  // playerSide: any; // TODO: get this working instead of global var
}

export default function Chat(props: IChatProps) {
  // private messagesEnd;

  const [users, setUsers] = useState([] as IUser[]); // props.room.users
  const [messages, setMessages] = useState([] as IMessage[]);
  const [newMessage, setNewMessage] = useState('');
  // const [gameBoard, setGameBoard] = useState(undefined as any); // TODO: should not be on state

  useEffect(() => {
    props.user
      .subscribeToRoomMultipart({
        roomId: props.room.id,
        messageLimit: 100,
        hooks: {
          // onUserJoined: user => {
          //   setState({
          //     users: props.room.users,
          //   });
          // },
          // onUserLeft: user => {
          //   setState({
          //     users: props.room.users,
          //   });
          // },
          onMessage: message => {
            let opponent;
            if (message?.parts?.[1]?.payload?.url?.startsWith('urn:player:')) {
              opponent = message?.parts?.[1]?.payload?.url?.substring(11);
              if (opponent !== props.user.id) {
                opponent = undefined;
              }
            }
            messages.push({
              id: message.id,
              user: message.senderId,
              opponent,
              message: message?.parts?.[0]?.payload?.content ?? '',
            });

            setMessages([...messages]);
          },
        },
      })
      .then(() => {
        setUsers(props.room.users);
      });

    return () => {
      props.user.roomSubscriptions[props.room.id].cancel();
    };
  }, [props.user]);

  if (props.gameGameRoomId && playerSide) {
    return (
      <GameBoard
        roomId={props.gameGameRoomId}
        offlineMode={false}
        userId={props.user.id}
        // ref={child => {
        //   setGameBoard(child);
        // }}
        startGameCallback={() => startGameCallback(props.gameGameRoomId, opponentId)}
      />
    );
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={12}>
          <Comment.Group style={{ height: '20em', overflow: 'auto' }}>
            <MessageElements
              messages={messages}
              startGameCallback={startGameCallback}
            ></MessageElements>
            >
          </Comment.Group>
          <div
            style={{ float: 'left', clear: 'both' }}
            // ref={el => {
            //   messagesEnd = el;
            // }}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <List style={{ maxHeight: '20em', overflow: 'auto' }}>
            <List.Item>
              <strong>You are logged in as:</strong>
            </List.Item>
            <List.Item>
              <Icon title="online" name="circle" color="green"></Icon>
              &nbsp;{props.user.name}
            </List.Item>
            <List.Item>
              <hr></hr>
            </List.Item>
            <List.Item>
              <strong>Other players:</strong>
            </List.Item>
            <UsersListItems users={users} user={props.user} room={props.room}></UsersListItems>
          </List>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form onSubmit={handleSubmit}>
            <Input
              action="Post"
              placeholder="New Message..."
              value={newMessage}
              fluid
              autoFocus
              onChange={handleNewMessageChange}
            />
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );

  function handleNewMessageChange(e) {
    setNewMessage(e.target.value);
  }

  function handleSubmit() {
    const { user, room } = props;
    user.sendMessage({
      text: newMessage,
      roomId: room.id,
    });
    setNewMessage('');
  }

  async function startGameCallback(roomId: string, opponent?: string): Promise<void> {
    if (!opponent) {
      const playersInRoom = props.room?.name.split('vs');
      opponent =
        playersInRoom[0].trim() === props.user.name
          ? playersInRoom[1].trim()
          : playersInRoom[0].trim();
    }
    const res = await props.startedGame(roomId, props.user.id, opponent);
    playerSide = res[props.user.id];
    // opponentSide = res[opponent];
  }

  // function getPlayersInRoom() {
  //   const players = gameBoard ? gameBoard?.getPlayers() : [];
  //   const playersInRoom = users.filter(user => players.includes(user.id));
  //   return playersInRoom;
  // }
}
