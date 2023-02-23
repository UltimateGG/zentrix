import { API_URL, DEV } from './api';
import { SocketEvent, User } from './apiTypes';


let ws: WebSocket | null = null;
const reconnectDelay = 1500;
let reconnectTimeout: NodeJS.Timeout | null = null;
let connecting = false;


const getWSUrl = (path: string) => {
  return `ws${DEV ? '' : 's'}://${API_URL}${path}?n=${localStorage.getItem('zxtoken')}`;
}

export const connect = async () => {
  return new Promise<User>(async (resolve, reject) => {
    if ((ws && ws.readyState !== WebSocket.CLOSED) || connecting || !localStorage.getItem('zxtoken')) return reject();
    connecting = true;
    ws = new WebSocket(getWSUrl('/socket'));

    const connectionTimeout = setTimeout(() => {
      if (!ws || ws.readyState !== WebSocket.CONNECTING) return;
      ws.close();
      reject();
    }, 10_000);
  
    ws.onopen = () => {
      connecting = false;
      clearTimeout(connectionTimeout);
    }

    ws.onclose = () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        connecting = false;
        connect();
      }, reconnectDelay);
      clearTimeout(connectionTimeout);
      reject();
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === SocketEvent.CONNECT) return resolve(data.payload as User);

      onEvent(data.event as SocketEvent, data.payload);
    }
  
    ws.onerror = () => {
      clearTimeout(connectionTimeout);
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
      if (subscriber.event === event || subscriber.event === SocketEvent._ALL) subscriber.callback(payload);
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
    const unsubscribe = subscribe(SocketEvent._ALL, payload => {
      if (payload.replyTo !== id) return;
      unsubscribe();
      
      delete payload.replyTo;
      if (payload.error) reject(payload);
      else resolve(payload);
      resolved = true;
    });

    setTimeout(() => {
      if (resolved) return;

      unsubscribe();
      reject({
        error: true,
        message: 'Request timed out',
      });
    }, 5000);

    ws.send(JSON.stringify({ event, payload: { ...payload, replyTo: id } }));
  });
}

export const isConnected = () => {
  return ws && ws.readyState === WebSocket.OPEN;
}

export const isConnecting = () => {
  return connecting;
}

