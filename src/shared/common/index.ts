export function readFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = function() {
      resolve(fileReader.result as ArrayBuffer);
    };
    fileReader.onerror = function(error) {
      reject(error);
    };
  });
}

function formatTime(time: number) {
  let result: string = time > 0 ? (time >= 10 ? `${time}` : "0" + time) : "00";
  return result;
}

export function durationToTime(duration: number) {
  let hour = 0;
  let minute = 0;
  let second: string | number = duration;
  if (duration >= 60) {
    minute = duration / 60;
    second = duration % 60;
    if (minute >= 60) {
      hour = minute / 60;
      minute = minute % 60;
    }
  }
  return `${hour > 0 ? hour + ":" : ""}${formatTime(
    Math.floor(minute)
  )}:${formatTime(Math.floor(second))}`;
}
