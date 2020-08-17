const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const os = require('os');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const supportedCombination = ["darwin-amd64", "linux-amd64", "linux-arm64", "linux-ppc64le"];
const installedBinary = ["kubectl", "kube-apisever", "kubebuilder", "etcd"];

async function run() {
  try {
    const version = core.getInput('version');
    const osPlat = os.platform();
    var osArch = os.arch();
    if (osArch === "x64") {
      osArch = "amd64";
    }
    if (!supportedCombination.includes(`${osPlat}-${osArch}`)) {
      throw `${osPlat}-${osArch} is not supported by this action now`;
    }
  
    core.info(`Going to install kubebuilder ${version} for ${osPlat}-${osArch}`);
  
    await child_process.exec('sudo mkdir -p /usr/local/kubebuilder/bin/')

    const downloadUrl = `https://go.kubebuilder.io/dl/${version}/${osPlat}/${osArch}`;
    const downloadPath = await tc.downloadTool(downloadUrl, undefined, undefined);
    
    const extPath = await tc.extractTar(downloadPath);
  
    await child_process.exec(`sudo cp ${extPath}/bin/ /usr/local/kubebuilder/bin/`)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
