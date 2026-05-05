import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: {
            target: './openapi/swagger.json',
        },
        output: {
            mode: 'tags-split',
            target: './src/api/endpoints',
            schemas: './src/api/models',
            client: 'react-query',
            httpClient: "axios",
            tsconfig: "tsconfig.json",
            override: {
                mutator: {
                    path: './src/api/axiosInstance.ts',
                    name: 'axiosInstance',
                },
            },
        },
    },
});
