# Kubebuilder installation docker action

This action provides a sugar syntax to install the kubebuilder in the ubuntu machine. The installation process is based on kubebuilder v2.3.1.

## Inputs

### `version`

**Required** The version going to be installed. Default `"2.3.1"`.

## Example usage

```yaml
uses: RyanSiu1995/kubebuilder-action@v1
with:
  version: 2.3.1
```
