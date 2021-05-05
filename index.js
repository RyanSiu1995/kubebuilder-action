const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const os = require('os');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const supportedCombination = ["darwin-amd64", "linux-amd64", "linux-arm64", "linux-ppc64le"];
const installedBinary = ["kubectl", "kube-apiserver", "kubebuilder", "etcd"];

async function run() {
  try {
    const version = core.getInput('version');
    const kubebuilderOnly = core.getInput('kubebuilderOnly') || false;
    const osPlat = os.platform();
    var osArch = os.arch();
    if (osArch === "x64") {
      osArch = "amd64";
    }
    if (!supportedCombination.includes(`${osPlat}-${osArch}`)) {
      throw `${osPlat}-${osArch} is not supported by this action now`;
    }
  
    core.info(`Going to install kubebuilder ${version} for ${osPlat}-${osArch}`);
  
    const downloadUrl = `https://go.kubebuilder.io/dl/${version}/${osPlat}/${osArch}`;
    const majorVersion = version.split(".")[0]
    if (majorVersion > 2) {
      child_process.execSync(`sudo mkdir -p /usr/local/kubebuilder/bin`, { shell: '/bin/bash'})
      child_process.execSync(`sudo curl -L ${downloadUrl} -o /usr/local/kubebuilder/bin/kubebuilder`, { shell: '/bin/bash'})
      child_process.execSync(`sudo chmod +x /usr/local/kubebuilder/bin/kubebuilder`, { shell: '/bin/bash'})
    } else {
      child_process.execSync(`curl -L ${downloadUrl} | tar -xz -C /tmp/`, { shell: '/bin/bash'})
      child_process.execSync(`sudo mv /tmp/kubebuilder_${version}_${osPlat}_${osArch}/ /usr/local/kubebuilder/`, { shell: '/bin/bash'})
      child_process.execSync(`ls -la /usr/local/kubebuilder/bin`, { shell: '/bin/bash'})
      if (kubebuilderOnly) {
        installedBinary
          .filter(x => x !== "kubebuilder")
          .map(x => child_process.execSync(`sudo rm /usr/local/kubebuilder/bin/${x}`, { shell: '/bin/bash'}))
      }
    }

    const cachedPath = await tc.cacheDir('/usr/local/kubebuilder', 'kubebuilder', version);
    core.addPath(cachedPath);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
