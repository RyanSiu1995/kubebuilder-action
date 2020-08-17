#!/bin/bash

VERSION=${1:-"2.3.1"}

OS=$(go env GOOS)
ARCH=$(go env GOARCH)

# download kubebuilder and extract it to tmp
curl -L https://go.kubebuilder.io/dl/${VERSION}/${OS}/${ARCH} | tar -xz -C /tmp/

# move to a long-term location and put it on your path
# (you'll need to set the KUBEBUILDER_ASSETS env var if you put it somewhere else)
sudo mv /tmp/kubebuilder_${VERSION}_${OS}_${ARCH} /usr/local/kubebuilder
