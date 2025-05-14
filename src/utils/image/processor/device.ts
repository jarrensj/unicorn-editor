
// Device detection utilities
export const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const isIOSSafari = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && 
         !/Chrome/i.test(navigator.userAgent) && 
         /Safari/i.test(navigator.userAgent);
};

