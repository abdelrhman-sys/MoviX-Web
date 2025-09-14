export default function base64ToBlob(base64, contentType = "image/jpg") {
  const byteCharacters = atob(base64.split(",")[1]); // strip the `data:image/...;base64,`
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}
