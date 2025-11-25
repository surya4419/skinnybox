export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const hashCommitment = async (
  targetId: string,
  expiry: number,
  salt: string
): Promise<string> => {
  const data = `${targetId}:${expiry}:${salt}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const verifyCommitment = async (
  commitmentHash: string,
  targetId: string,
  expiry: number,
  salt: string
): Promise<boolean> => {
  const reHash = await hashCommitment(targetId, expiry, salt);
  return reHash === commitmentHash;
};
