import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
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

  const plugin_terser_es6 = terser({ ecma: 6, format: terser_format });
  
  return [
    {
      input: "src/index.ts",
      plugins: [
        typescript( { tsconfig: './tsconfig.json' })
      ],
      output: [
        // index.mjs
        // for rollup/webpack to compile together with other
        // or use in <script type="module">
        {
          file: "dist/index.mjs",
          format: "es",
          exports: "default",
          sourcemap: true,
          plugins: [
            { 
              // index.esm.js
              // for rollup/webpack to compile together with other, target browser
              // same as mjs, webpack 4 don't know mjs, so current we still set esm.js as package.json->browser

              // https://rollupjs.org/guide/en/#writebundle
              async writeBundle(options, bundle){
                await fs.copyFile('./dist/index.mjs', './dist/index.esm.js')
              }
            },
          ],
        },
        // index.min.mjs
        {
          file: "dist/index.min.mjs",
          format: "es",
          exports: "default",
          sourcemap: true,
          plugins: [
            plugin_terser_es6,
            { 
              // index.esm.js
              // for rollup/webpack to compile together with other, target browser
              // same as mjs, webpack 4 don't know mjs, so current we still set esm.js as package.json->browser

              // https://rollupjs.org/guide/en/#writebundle
              async writeBundle(options, bundle){
                await fs.copyFile('./dist/index.min.mjs', './dist/index.esm.min.js')
              }
            },
          ],
        },
        // index.js
        // usage
        // <script src="index.js"
        {
          file: "dist/index.js",
          format: "umd",
          name: "MutablePromise",
          exports: "default",
          sourcemap: true,
        },
        // index.min.js
        {
          file: "dist/index.min.js",
          format: "umd",
          name: "MutablePromise",
          exports: "default",
          sourcemap: true,
          plugins: [
            plugin_terser_es6,
          ],
        },
      ],
    },
  ]
};