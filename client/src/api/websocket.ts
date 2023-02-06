import User from './User';


let ws: WebSocket | null = null;
const reconnectDelay = 1500;
let reconnectTimeout: NodeJS.Timeout | null = null;


const getWSUrl = (path: string) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host.replace(':3000', ':5000')}${path}`;
}

export const connect = async () => {
  return new Promise<User>(async (resolve, reject) => {
    if (ws && ws.readyState !== WebSocket.CLOSED) return reject();
    ws = new WebSocket(getWSUrl('/socket'));
  
    ws.onclose = () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(connect, reconnectDelay);
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === SocketEvent.CONNECT) return resolve(data.payload as User);

      onEvent(data.event as SocketEvent, data.payload);
    }
  
    ws.onerror = (event) => {
      // console.error(event);
      reject();
    }
  });
}

const onEvent = (event: SocketEvent, payload: any) => {

}

export const emit = (event: SocketEvent, payload: any) => {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ event, payload }));
}


export enum SocketEvent {
  CONNECT = 'connect',
  SET_LAST_SCREEN = 'setLastScreen',
}
