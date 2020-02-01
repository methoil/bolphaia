// chess-ui/src/Rooms.js
import React from 'react';
import { List, Icon, Header } from 'semantic-ui-react';

export interface IRoom {
  id: string;
  name: string;
}

type IEnterRoom = (roomId: string) => void;
type ILeaveRoom = (roomId: string) => void;

export default function Rooms(props: {
  joined: IRoom[];
  joinable: IRoom[];
  activeRoom?: string;
  enterRoom: IEnterRoom;
  leaveRoom: ILeaveRoom;
}) {
  const joinedRooms = props.joined.map(room => (
    <List.Item key={room.id}>
      <List.Content floated="right">
        <a onClick={() => props.leaveRoom(room.id)}>Leave</a>
      </List.Content>
      <Icon name={room.id === props.activeRoom ? 'angle double right' : undefined} />
      <List.Content>
        <a onClick={() => props.enterRoom(room.id)}>{room.name}</a>
      </List.Content>
    </List.Item>
  ));
  const joinableRooms = props.joinable.map(room => (
    <List.Item key={room.id}>
      <Icon name={undefined} />
      <List.Content>
        <a onClick={() => props.enterRoom(room.id)}>{room.name}</a>
      </List.Content>
    </List.Item>
  ));
  return (
    <div>
      <Header as='h4'>Active Rooms</Header>
      <List divided relaxed>
        {joinedRooms}
      </List>
      <Header as='h4'>Joinable Rooms</Header>
      <List divided relaxed>
        {joinableRooms}
      </List>
    </div>
  );
}
