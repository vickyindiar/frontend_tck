export default async function copyTextToClipboard(text) {
    //this navigator api only works over https
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }