// chess-ui/src/Rooms.js
import React from 'react';
import {cloneDeep} from 'lodash';
import { List, Icon, Header } from 'semantic-ui-react';
import { LOBBY_NAME } from './lobby';
import { remove } from 'lodash';

export interface IRoom {
  id: string;
  name: string;
  users: any[]; // todo: IUser[]
}

type IEnterRoom = (roomId: string) => void;
type ILeaveRoom = (roomId: string) => void;

interface IRoomsProps {
  joined: IRoom[];
  joinable: IRoom[];
  activeRoom?: string;
  enterRoom: IEnterRoom;
  leaveRoom: ILeaveRoom;
}

export default function Rooms(props: IRoomsProps) {
  const { joined, joinable } = cloneDeep(props);
  const inLobby = !!joined.filter(room => room.name === LOBBY_NAME).length;
  const lobby = remove(inLobby ? joined : joinable, room => room.name === LOBBY_NAME);

  const lobbyListItem = inLobby ? joinedListItems(lobby, props) : joinableListItems(lobby, props);
  const joinedRoomsListItems = joinedListItems(joined, props);
  const joinableRoomsListItems = joinableListItems(joinable, props);

  return (
    <div>
      <Header as="h4">Matchmaking Lobby</Header>
      <List divided relaxed>
        {lobbyListItem}
      </List>
      <Header as="h4">Your Games</Header>
      <List divided relaxed>
        {[...joinedRoomsListItems, ...joinableRoomsListItems]}
      </List>
      {/* <Header as="h4">Joinable Rooms</Header>
      <List divided relaxed>
        {joinableRooms}
      </List> */}
    </div>
  );
}

function joinableListItems(rooms: IRoom[], props) {
  return rooms.map(room => (
    <List.Item key={room.id}>
      <Icon name={undefined} />
      <List.Content>
        <a onClick={() => props.enterRoom(room.id)}>{room.name}</a>
      </List.Content>
    </List.Item>
  ));
}

function joinedListItems(rooms: IRoom[], props) {
  return rooms.map(room => (
    <List.Item key={room.id}>
      {room.id === props.activeRoom && room.name !== 'Lobby' && false && (
        <List.Content floated="right">
          <a onClick={() => props.leaveRoom(room.id)}>Leave</a>
        </List.Content>
      )}
      <Icon name={room.id === props.activeRoom ? 'angle double right' : undefined} />
      <List.Content>
        <a onClick={() => props.enterRoom(room.id)}>{room.name}</a>
      </List.Content>
    </List.Item>
  ));
}
