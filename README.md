# Kubebuilder installation docker action

This action provides a sugar syntax to install the kubebuilder
 in the ubuntu machine. The installation process is based on kubebuilder v2.3.1.

## Inputs

### `version`

**Required** The version going to be installed. Default `"2.3.1"`.

### `kubebuilderOnly`

**Optional** a flag to install kubebuilder binary only.
 Default as `false`, which is default behavor in 2.x.x.

### `etcdVersion`

**Optional** The etcd version going to be installed.
 Respected if kubebuilderOnly is `false` and
 major version of kubebuilder is greater than or equal to 3. Default `"v3.2.32"`

### `kubernetesVersion`

**Optional** The kubectl and kube-apiserver version going to be installed.
 Respected if kubebuilderOnly is `false` and
major version of kubebuilder is greater than or equal to 3.
 Default to use latest version.

## Example usage

```yaml
uses: RyanSiu1995/kubebuilder-action@v1.2
with:
  version: 3.0.0
```

## How to run E2E test locally

Install [act](https://github.com/nektos/act). Then,
 run `act` directly under the working repository.

If you encounter the following error,

```
[main.yml/test-workflow-4 ] ⭐  Run Test the workflow
| internal/modules/cjs/loader.js:818
|   throw err;
|   ^
|
| Error: Cannot find module '/kubebuilder-action/kubebuilder-action/index.js'
|     at Function.Module._resolveFilename (internal/modules/cjs/loader.js:815:15)
|     at Function.Module._load (internal/modules/cjs/loader.js:667:27)
|     at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:60:12)
|     at internal/main/run_main_module.js:17:47 {
|   code: 'MODULE_NOT_FOUND',
|   requireStack: []
| }
```

please add these two lines to [workflow definition](.github/workflows/main.yml)
 under checkout step.

```
with:
  path: ./
```

## License

This software is released under Apache License 2.0. Please refer
 to [LICENSE](LICENSE) file for more details.
