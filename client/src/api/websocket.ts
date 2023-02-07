import User from './apiTypes';


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
  
    ws.onerror = () => {
      reject();
    }
  });
}

interface EventSubscriber {
  id: string;
  event: SocketEvent;
  callback: (payload: any) => void;
}

const subscribers: EventSubscriber[] = [];

const onEvent = (event: SocketEvent, payload: any) => {
  subscribers.forEach(subscriber => {
    try {
      if (subscriber.event === event) subscriber.callback(payload);
    } catch (e) {
      console.error('Error calling event subscriber for ' + event, e);
    }
  });
}

export const subscribe = (event: SocketEvent, callback: (payload: any) => void) => {
  const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
  subscribers.push({ id, event, callback });

  return () => {
    const index = subscribers.findIndex(subscriber => subscriber.id === id);
    if (index !== -1) subscribers.splice(index, 1);
  }
}

export const emit = (event: SocketEvent, payload: any) => {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ event, payload }));
}

export const emitWithRes = async (event: SocketEvent, payload: any) => {
  return new Promise<any>((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return reject();

    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    let resolved = false;
    const listener = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.payload && data.payload.replyTo === id) {
        ws?.removeEventListener('message', listener);
        data.payload.replyTo = undefined;
        resolve(data.payload);
        resolved = true;
      }
    }

    ws.addEventListener('message', listener);
    setTimeout(() => {
      if (resolved) return;
      ws?.removeEventListener('message', listener);
      reject();
    }, 5000);

    ws.send(JSON.stringify({ event, payload, replyTo: id }));
  });
}

export const isConnected = () => {
  return ws && ws.readyState === WebSocket.OPEN;
}



export enum SocketEvent {
  CONNECT = 'connect',
  SET_LAST_SCREEN = 'setLastScreen',
  SET_DISPLAY_NAME = 'setDisplayName',
  CREATE_CHAT = 'createChat',
  POPULATE_CACHE = 'populateCache',
  UPDATE_CACHE = 'updateCache',
  SET_LAST_CHAT = 'setLastChat',
}

interface SocketData {
  event: SocketEvent;
  payload: any;
  replyTo?: string;
}
