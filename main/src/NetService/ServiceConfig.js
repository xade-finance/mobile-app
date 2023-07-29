import {ParticleInfo} from './ParticleInfo';

export function ServiceConfig(projectId, clientKey) {
  ParticleInfo.projectId = projectId;
  ParticleInfo.clientKey = clientKey;
}
