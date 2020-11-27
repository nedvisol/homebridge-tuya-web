import { TuyaWebPlatform} from '../platform';
import { API, Logger  } from 'homebridge';
import {RotationSwitch} from './RotationSwitch';
import {PLATFORM_NAME, PLUGIN_NAME, TUYA_DISCOVERY_TIMEOUT} from '../settings';

var colorRotationSwitch: RotationSwitch;

export const bootstrapExtension = (platform: TuyaWebPlatform, api: API, log: Logger) => {
  colorRotationSwitch = new RotationSwitch(platform, api, log);
}