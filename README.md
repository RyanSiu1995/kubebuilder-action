# Kubebuilder installation docker action

This action provides a sugar syntax to install the kubebuilder in the ubuntu machine. The installation process is based on kubebuilder v2.3.1.

## Inputs

### `version`

**Required** The version going to be installed. Default `"2.3.1"`.

### `kubebuilderOnly`

**Optional** a flag to install kubebuilder binary only. Default as `false`, which is default behavor in 2.x.x.

### `etcdVersion`

**Optional** The etcd version going to be installed. Respected if kubebuilderOnly is `false` 
and major version of kubebuilder is greater than or equal to 3. Default `"v3.2.32"`

### `kubernetesVersion`

**Optional** The kubectl and kube-apiserver version going to be installed. Respected if kubebuilderOnly is `false` 
and major version of kubebuilder is greater than or equal to 3. Default to use latest version.

## Example usage

```yaml
uses: RyanSiu1995/kubebuilder-action@v1.2
with:
  version: 3.0.0
```

## License
This software is released under Apache License 2.0. Please refer to [LICENSE](LICENSE) file for more details.
