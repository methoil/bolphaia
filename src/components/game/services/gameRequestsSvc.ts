import axios from 'axios';
import { BACKEND_URL } from '../../app-constants';

export default class gameRequestsSvc {

}

export function setupGame() {
    axios
      .request({
        url: this.urlToGameServer,
      })
      .then(res => {
        this.setState({
          players: res.data.players || this.state.players,
          playerSide: res.data.players[this.props.userId ?? ''] || this.state.playerSide,
          boardState: this.buildBoardState(res.data.board),
          turn: res.data.nextTurn || this.state.playerSide,
          fallenPieces: res.data.fallenPieces || this.state.fallenPieces,
        });
      })
      .catch(err => {
        console.error('Error fetching board data from server, creating new game', err);
        // TODO: use TS argument types: https://stackoverflow.com/questions/52771626/typescript-react-conditionally-optional-props-based-on-the-type-of-another-prop
        this.props.startGameCallback &&
          this.props.startGameCallback().then(() => {
            return axios
              .request({
                url: this.urlToGameServer,
              })
              .then(res => {
                this.setState({
                  players: res.data.players || this.state.players,
                  playerSide: res.data.players[this.props.userId ?? ''] || this.state.playerSide,
                  boardState: this.buildBoardState(res.data.board),
                  turn: res.data.nextTurn || this.state.playerSide,
                  fallenPieces: res.data.fallenPieces || this.state.fallenPieces,
                });
              });
          });
      });
  }

  export function updateGame() {
    axios
      .request({
        url: this.urlToGameServer,
      })
      .then(res => {
        if ((res.data.players && !this.state.players) || !this.state.playerSide) {
          this.setState({ players: res.data.players });
          this.setState({ playerSide: res.data.players[this.props.userId ?? ''] });
        }
        // using same format as the sent payload and just update the changed squares for now
        if (res.data.player === this.props.userId) {
          return;
        }

        this.setState({
          boardState: this.buildBoardState(res.data.board),
          turn: res.data.nextTurn || this.state.playerSide,
          fallenPieces: res.data.fallenPieces || this.state.fallenPieces,
        });
      });
  }

  urlToGameServer() {
    return `${BACKEND_URL}/games/${this.props.roomId}`;
  }