import { SocketEvent, User } from './apiTypes';


let ws: WebSocket | null = null;
const reconnectDelay = 1500;
let reconnectTimeout: NodeJS.Timeout | null = null;
let connecting = false;


const getWSUrl = (path: string) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host.replace(':3000', ':5000')}${path}`;
}

export const connect = async () => {
  return new Promise<User>(async (resolve, reject) => {
    if ((ws && ws.readyState !== WebSocket.CLOSED) || connecting) return reject();
    connecting = true;
    ws = new WebSocket(getWSUrl('/socket'));
  
    ws.onopen = () => {
      connecting = false;
    }

    ws.onclose = () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(connect, reconnectDelay);
      connecting = false;
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
      if (!data.payload || data.payload.replyTo !== id) return;
      ws?.removeEventListener('message', listener);

      if (data.payload.error) reject(data.payload);
      else resolve(data.payload);
      resolved = true;
    }

    ws.addEventListener('message', listener);
    setTimeout(() => {
      if (resolved) return;
      ws?.removeEventListener('message', listener);
      reject({
        error: true,
        message: 'Request timed out',
      });
    }, 5000);

    ws.send(JSON.stringify({ event, payload, replyTo: id }));
  });
}

export const isConnected = () => {
  return ws && ws.readyState === WebSocket.OPEN;
}

export const isConnecting = () => {
  return connecting;
}

