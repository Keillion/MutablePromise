import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs/promises';

// https://rollupjs.org/guide/en/#configuration-files
export default async(commandLineArgs)=>{

  await fs.rm('./dist', { recursive: true, force: true });

  const terser_format = { 
    comments: function(node, comment){
      const text = comment.value;
      const type = comment.type;
      if (type == "comment2") {
        // multiline comment
        return false;
      }
    },  
  };
  // https://stackoverflow.com/questions/57360588/how-to-use-terser-with-webpack
  const plugin_terser_esnext = terser({ ecma: 6, format: terser_format }); // 8
  
  return [
    {
      input: "src/index.ts",
      plugins: [
        typescript( { tsconfig: './tsconfig.json' })
      ],
      output: [
        // mutable-promise.mjs
        // for rollup/webpack to compile together with other
        // or use in <script type="module">
        {
          file: "dist/mutable-promise.mjs",
          format: "es",
          exports: "default",
          sourcemap: true,
          plugins: [
            { 
              // mutable-promise.esm.js
              // for rollup/webpack to compile together with other, target browser
              // same as mjs, webpack 4 don't know mjs, so current we still set esm.js as package.json->browser

              // https://rollupjs.org/guide/en/#writebundle
              async writeBundle(options, bundle){
                await fs.copyFile('./dist/mutable-promise.mjs', './dist/mutable-promise.esm.js')
              }
            },
          ],
        },
        // mutable-promise.min.mjs
        {
          file: "dist/mutable-promise.min.mjs",
          format: "es",
          exports: "default",
          sourcemap: true,
          plugins: [
            plugin_terser_esnext,
            { 
              // mutable-promise.esm.js
              // for rollup/webpack to compile together with other, target browser
              // same as mjs, webpack 4 don't know mjs, so current we still set esm.js as package.json->browser

              // https://rollupjs.org/guide/en/#writebundle
              async writeBundle(options, bundle){
                await fs.copyFile('./dist/mutable-promise.min.mjs', './dist/mutable-promise.esm.min.js')
              }
            },
          ],
        },
        // mutable-promise.js
        // usage
        // <script src="mutable-promise.js"
        {
          file: "dist/mutable-promise.js",
          format: "umd",
          name: "MutablePromise",
          exports: "default",
          sourcemap: true,
        },
        // mutable-promise.min.js
        {
          file: "dist/mutable-promise.min.js",
          format: "umd",
          name: "MutablePromise",
          exports: "default",
          sourcemap: true,
          plugins: [
            plugin_terser_esnext,
          ],
        },
      ],
    },
  ]
};