declare interface MysqlConfig {
  host: string;
  port: string | number;
  user: string;
  password: string;
  database: string;
  ssl?: string | {
    /**
     * A string or buffer holding the PFX or PKCS12 encoded private key, certificate and CA certificates
     */
    pfx?: string;

    /**
     * A string holding the PEM encoded private key
     */
    key?: string;

    /**
     * A string of passphrase for the private key or pfx
     */
    passphrase?: string;

    /**
     * A string holding the PEM encoded certificate
     */
    cert?: string;

    /**
     * Either a string or list of strings of PEM encoded CA certificates to trust.
     */
    ca?: string | string[];

    /**
     * Either a string or list of strings of PEM encoded CRLs (Certificate Revocation List)
     */
    crl?: string | string[];

    /**
     * A string describing the ciphers to use or exclude
     */
    ciphers?: string;
  };
}

export = MysqlConfig