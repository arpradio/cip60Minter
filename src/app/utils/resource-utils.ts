import Arweave from 'arweave';
import { CID } from 'multiformats/cid';
import { base58btc } from 'multiformats/bases/base58';

type ContentResponse = {
  content: ArrayBuffer | SharedArrayBuffer | Uint8Array | string;
  contentType?: string;
};

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

const bufferToDataUrl = (
  buffer: ArrayBuffer | SharedArrayBuffer | Uint8Array, 
  mimeType: string
): string => {
  const uint8Array = buffer instanceof Uint8Array 
    ? buffer 
    : new Uint8Array(buffer);
    
  const base64 = btoa(
    uint8Array.reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );
  
  return `data:${mimeType};base64,${base64}`;
};

const isBrowser = typeof window !== 'undefined';

const createHeliaInstance = async () => {
  if (isBrowser) {
    // Dynamically import Helia only on client-side
    const { createHelia } = await import('helia');
    const helia = await createHelia();
    const { unixfs } = await import('@helia/unixfs');
    const fs = unixfs(helia);
    return { helia, fs };
  }
  return null;
};

const fetchFromIPFS = async (cid: string): Promise<Uint8Array> => {
  if (!isBrowser) {
    throw new Error('IPFS content fetching is only available in browser environments');
  }

  try {
    const heliaInstance = await createHeliaInstance();
    if (!heliaInstance) {
      throw new Error('Failed to create Helia instance');
    }
    
    const { fs } = heliaInstance;
    const parsedCid = CID.parse(cid);
    
    const chunks: Uint8Array[] = [];
    for await (const chunk of fs.cat(parsedCid)) {
      chunks.push(chunk);
    }
    
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    return result;
  } catch (error) {
    throw new Error(`IPFS fetch error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const fetchFromArweave = async (txId: string): Promise<ContentResponse> => {
  try {
    const transaction = await arweave.transactions.get(txId);
    const data = await arweave.transactions.getData(txId, {
      decode: true,
      string: false
    });
    
    let contentType = 'application/octet-stream';
    const tags = transaction.tags as unknown as Array<{ name: string, value: string }>;
    
    for (const tag of tags) {
      const decodedName = arweave.utils.b64UrlToString(tag.name);
      if (decodedName.toLowerCase() === 'content-type') {
        contentType = arweave.utils.b64UrlToString(tag.value);
        break;
      }
    }
    
    let content: ArrayBuffer | SharedArrayBuffer | Uint8Array | string;
    
    if (data instanceof Uint8Array) {
      content = data;
    } else if (typeof data === 'string') {
      content = data;
    } else {
      content = data;
    }
    
    return { content, contentType };
  } catch (error) {
    throw new Error(`Arweave fetch error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const getIpfsGatewayUrl = (cid: string): string => {
  return `https://ipfs.io/ipfs/${cid}`;
};

export const getResourceUrl = async (uri: string): Promise<string> => {
  if (!uri || typeof uri !== 'string') return '';
  
  // Handle IPFS URIs
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    
    if (isBrowser) {
      try {
        const content = await fetchFromIPFS(cid);
        return bufferToDataUrl(content, 'application/octet-stream');
      } catch (err) {
        console.error('IPFS direct fetch failed:', err instanceof Error ? err.message : String(err));
      }
    }
    
    // Fallback to gateway
    return getIpfsGatewayUrl(cid);
  }
  
  // Handle CID format
  if (/^Qm[1-9A-HJ-NP-Za-km-z]{44,}/.test(uri) || 
      /^bafy[a-zA-Z0-9]{44,}/.test(uri)) {
        
    if (isBrowser) {
      try {
        const content = await fetchFromIPFS(uri);
        return bufferToDataUrl(content, 'application/octet-stream');
      } catch (err) {
        console.error('IPFS CID direct fetch failed:', err instanceof Error ? err.message : String(err));
      }
    }
    
    // Fallback to gateway
    return getIpfsGatewayUrl(uri);
  }
  
  // Handle Arweave URIs
  if (uri.startsWith('ar://')) {
    const txId = uri.replace('ar://', '');
    
    try {
      const { content, contentType } = await fetchFromArweave(txId);
      
      if (typeof content === 'string') {
        return content; 
      }
      
      return bufferToDataUrl(
        content as ArrayBuffer | SharedArrayBuffer | Uint8Array,
        contentType || 'application/octet-stream'
      );
    } catch (err) {
      console.error('Arweave direct fetch failed:', err instanceof Error ? err.message : String(err));
      // Fallback to gateway
      return `https://arweave.net/${txId}`;
    }
  }
  
  return uri;
};