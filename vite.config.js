import { defineConfig } from "vite";
import {resolve} from 'path'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname,'dist')

export default defineConfig({
    root,
    build:{
        outDir,
        emptyOutDir:true,
        rollupOptions:{
            input:{
                main: resolve(root, 'index.html'),
                about:resolve(root,'about.html'),
                contact:resolve(root,'contact.html'),
                details:resolve(root,'details.html'),
                store:resolve(root,'posts.html'),
                
            }
        }
    }
})