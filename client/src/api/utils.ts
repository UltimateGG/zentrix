export const formatTime = (time: number) => {
  const date = new Date(time);
  const diff = Date.now() - time;
  const day = 1000 * 60 * 60 * 24;
  const week = day * 7;
  const year = day * 365;

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 

  if (diff < day) {
    return `Today at ${timeStr}`;
  } else if (diff < day * 2) {
    return `Yesterday at ${timeStr}`;
  } else if (diff < week) {
    return `${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${timeStr}`;
  } else if (diff < year) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
