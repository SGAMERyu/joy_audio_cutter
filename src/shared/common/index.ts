export function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = function() {
      resolve(fileReader.result);
    };
    fileReader.onerror = function(error) {
      reject(error);
    };
  });
}
