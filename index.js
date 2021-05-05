const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const os = require('os');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const supportedCombination = ["darwin-amd64", "linux-amd64", "linux-arm64", "linux-ppc64le"];
const installedBinary = ["kubectl", "kube-apiserver", "kubebuilder", "etcd"];

function execSync(command) {
  child_process.execSync(command, {shell: '/bin/bash'})
}

async function run() {
  try {
    const version = core.getInput('version');
    const kubebuilderOnly = core.getInput('kubebuilderOnly') === 'true';
    const etcdVersion = core.getInput('etcdVersion') || 'v3.2.32';
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
      core.debug(`MajorVersion is greater than 2`)
      execSync(`sudo mkdir -p /usr/local/kubebuilder/bin`)
      execSync(`sudo curl -L ${downloadUrl} -o /usr/local/kubebuilder/bin/kubebuilder`)
      execSync(`sudo chmod +x /usr/local/kubebuilder/bin/kubebuilder`)
      if (!kubebuilderOnly) {
        // Install kubectl and kube-apiserver
        ["kubectl", "kube-apiserver"].map((binary) => {
          core.info(`Going to install ${binary}`)
          execSync(`curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/${binary}"`)
          execSync(`chmod +x ${binary}`)
          execSync(`sudo mv ${binary} /usr/local/kubebuilder/bin`)
        })
        // Install etcd
        core.info(`Going to install etcd ${etcdVersion}`)
        execSync(`curl -L https://github.com/etcd-io/etcd/releases/download/${etcdVersion}/etcd-${etcdVersion}-linux-amd64.tar.gz | tar -xz --strip-components=1 -C /tmp/`)
        execSync(`sudo mv /tmp/etcd /usr/local/kubebuilder/bin`)
      } else {
        core.debug(`No extra binary will be installed.`)
      }
    } else {
      execSync(`curl -L ${downloadUrl} | tar -xz -C /tmp/`)
      execSync(`sudo mv /tmp/kubebuilder_${version}_${osPlat}_${osArch}/ /usr/local/kubebuilder/`)
      execSync(`ls -la /usr/local/kubebuilder/bin`)
      if (kubebuilderOnly) {
        installedBinary
          .filter(x => x !== "kubebuilder")
          .map(x => {
            core.info(`Going to remove ${x}`)
            execSync(`sudo rm /usr/local/kubebuilder/bin/${x}`)
          })
      } else {
        core.debug(`No extra binary will be deleted.`)
      }
    }

    const cachedPath = await tc.cacheDir('/usr/local/kubebuilder', 'kubebuilder', version);
    core.addPath(cachedPath);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
