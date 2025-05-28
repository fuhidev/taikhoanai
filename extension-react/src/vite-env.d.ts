/// <reference types="vite/client" />

interface ImportMetaEnv {
 readonly VITE_API_BASE_URL: string;
 // thêm các env vars khác nếu cần
}

interface ImportMeta {
 readonly env: ImportMetaEnv;
}
