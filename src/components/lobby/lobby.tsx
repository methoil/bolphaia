import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import axios from "axios";
import Rooms, { IRoom } from "./rooms";
import Chat from "./chat/chat";
import { playerIds } from "../game/game.model";
import { BACKEND_URL } from "../../app-constants";

export const LOBBY_NAME = "Lobby";

export interface IUser {
  id: string;
  name: string;
  rooms: IRoom[];
  presence: { state: "online" | "offline" };
  sendMessage: (payload: {
    text: string;
    roomId: string;
    attachment?: any;
  }) => void;
  createRoom: (paylod: {
    name: string;
    addUserIds: string[];
  }) => Promise<IRoom>;
  deleteRoom: any;
  joinRoom: any;
  leaveRoom: any;
  getJoinableRooms: any;
  subscribeToRoomMultipart: any;
  roomSubscriptions: any[];
}

interface ILobbyState {
  joined: IRoom[];
  joinable: IRoom[];
  chatManager?: any;
  lobbyId?: string;
  activeRoom?: string;
  currentUser?: IUser;
}

interface ILobbyProps {
  username: string;
}

export default function Lobby(props: ILobbyProps) {
  const [joined, setJoined] = useState([]);
  const [joinable, setJoinable] = useState([]);
  const [lobbyId, setLobbyId] = useState("");
  const [activeRoom, setActiveRoom] = useState("");
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    rooms: [],
    presence: { state: "offline" },
  } as any);

  // TODO: Chatkit discontinued... replace this with another service, maybe Pusher Channels
  // useEffect(() => {
  //   const chatManager = new ChatManager({
  //     instanceLocator: "v1:us1:f3854d62-ebf2-4ee2-8a48-c62ed279fa8f",
  //     tokenProvider: new TokenProvider({
  //       url: `${BACKEND_URL}/auth`,
  //     }),
  //     userId: props.username,
  //   });

  //   chatManager
  //     .connect()
  //     .then((currentUserRes) => {
  //       setCurrentUser(currentUserRes);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to connect to Chatkit", err);
  //     });
  // }, []);

  useEffect(() => {
    if (!currentUser.name) {
      return;
    }
    currentUser.getJoinableRooms?.().then((rooms) => {
      const lobby = findLobby(rooms) || findLobby(currentUser.rooms);
      if (lobby) {
        setLobbyId(lobby.id);
        setActiveRoom(lobby.id);
      }
    });
    // setInterval(pollRooms, 5000);
    pollRooms();
  }, [currentUser]);

  function pollRooms() {
    // const rooms = await currentUser.getJoinableRooms?.();
    currentUser.getJoinableRooms?.().then((rooms) => {
      setJoined(currentUser.rooms);
      setJoinable(
        rooms.filter(
          (room) =>
            room.name.includes(currentUser.name) || room.name === "Lobby"
        )
      );
    });
  }

  function enterRoom(id) {
    currentUser
      ?.joinRoom({ roomId: id })
      .then(() => {
        setActiveRoom(id);
        pollRooms();
      })
      .catch(() => {
        console.log("Failed to enter room");
      });
  }

  // TODO: useRef hook here
  function leaveRoom(id) {}
  //   // TODO: temp disable toom deletion so I can see if games persist over time
  //   if (chat) {
  //     const playersInRoom = chat.getPlayersInRoom();
  //     if (playersInRoom.length === 1 && playersInRoom[0].id === currentUser?.id) {
  //       // TODO: when to delete?
  //       currentUser?.deleteRoom({ roomId: id });
  //     }
  //   }
  //   currentUser
  //     ?.leaveRoom({ roomId: id })
  //     .then(() => {
  //       pollRooms();
  //     })
  //     .catch(() => {
  //       console.log('Failed to leave room');
  //     });
  // }

  function startedGame(roomId, white, black): Promise<any> {
    return axios
      .request({
        url: `${BACKEND_URL}/games`,
        method: "POST",
        data: {
          room: roomId,
          whitePlayer: white,
          blackPlayer: black,
        },
      })
      .then((response) => {
        setActiveRoom(roomId);
        pollRooms();
        return {
          [white]: playerIds.phrygians,
          [black]: playerIds.hittites,
        };
      });
  }

  function findLobby(rooms: IRoom[]): IRoom | null {
    return rooms.filter((room) => room.name === LOBBY_NAME)?.[0] ?? null;
  }

  let chat;
  if (currentUser.id) {
    const room = currentUser.rooms.find((room) => room.id == activeRoom);
    if (room) {
      const gameGameRoomId =
        activeRoom && activeRoom !== lobbyId ? activeRoom : "";
      chat = (
        <Chat
          user={currentUser}
          room={room}
          key={room.id}
          startedGame={startedGame}
          gameGameRoomId={gameGameRoomId}
          // ref={child => {
          //   chat = child;
          // }}
        />
      );
    }
  }

  return (
    <div className={"segment-grid-container"}>
      <div className="lobby-grid">
        <Grid>
          <Grid.Column width={2}>
            <Rooms
              joined={joined}
              joinable={joinable}
              activeRoom={activeRoom}
              enterRoom={enterRoom}
              leaveRoom={leaveRoom}
            />
          </Grid.Column>
          <Grid.Column width={12}>{chat}</Grid.Column>
        </Grid>
      </div>
    </div>
  );
}
