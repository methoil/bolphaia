import axios from 'axios';
import { BACKEND_URL } from '../../../app-constants';

interface IGameRequestsSvc {
  setupGame: any;
  updateGame: any;
  sendMove: any;
}

class gameRequestsSvc implements IGameRequestsSvc {
  // constructor(roomId: string) {} should this have roomId as state?
  // TODO: Yes - this whole thing should be an 'OnlineGame' type HOC that has access to game state
  // separating this out made me realize how poorly this logic has been handled

  public setupGame(roomId: string = '', setStateCb: any, startGameCb: any) {
    // try to load game, if it exists
    axios
      .request({
        url: this.urlToGameServer(roomId),
      })
      .then(res => {
        setStateCb(res);
      })
      .catch(err => {
        console.info('Error fetching board data from server, creating new game', err);
        startGameCb().then(() => {
          return axios
            .request({
              url: this.urlToGameServer(roomId),
            })
            .then(res => {
              setStateCb(res);
            });
        });
      });
  }

  public async updateGame(roomId: string = '', updateGameCb: any): Promise<void> {
    const res = await axios.request({ url: this.urlToGameServer(roomId) });
    updateGameCb(res);
  }

  public sendMove(roomId: string = '', payload: any) {
    return axios.request({
      method: 'POST',
      url: this.urlToGameServer(roomId),
      data: payload,
    });
  }

  private urlToGameServer(roomId: string) {
    return `${BACKEND_URL}/games/${roomId}`;
  }
}

const GameReqSingleton = new gameRequestsSvc();
export default GameReqSingleton;
