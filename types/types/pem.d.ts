declare module "pem" {
  export type Pkcs12ReadResult = {
    key: string;
    cert?: string;
    ca?: string[];
  };

  const pem: {
    readPkcs12(
      buffer: Buffer,
      options: { p12Password?: string | undefined },
      callback: (err: Error | null, cert: Pkcs12ReadResult) => void
    ): void;
  };

  export default pem;
}

