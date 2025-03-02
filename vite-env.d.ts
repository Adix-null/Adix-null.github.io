/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

import "vite/client";

interface ImportMetaEnv {
	readonly VITE_SECRET_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
