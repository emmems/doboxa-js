import { defineConfig } from 'tsup';

import { name, version } from './package.json';

export default defineConfig(overrideOptions => {
  const isWatch = !!overrideOptions.watch;
  const shouldPublish = !!overrideOptions.env?.publish;

  return {
    entry: {
      index: 'src/index.ts',
    },
    dts: true,
    onSuccess: shouldPublish ? 'pnpm publish' : undefined,
    format: ['cjs', 'esm'],
    bundle: true,
    clean: true,
    minify: false,
    sourcemap: true,
    define: {
      PACKAGE_NAME: `"${name}"`,
      PACKAGE_VERSION: `"${version}"`,
      JS_PACKAGE_VERSION: `"${version}"`,
      __DEV__: `${isWatch}`,
    },
  };
});
