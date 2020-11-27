import { TuyaWebPlatform} from '../platform';
import { API, Logger, Service, CharacteristicGetCallback, CharacteristicSetCallback } from 'homebridge';
import {PLATFORM_NAME, PLUGIN_NAME, TUYA_DISCOVERY_TIMEOUT} from '../settings';


export class RotationSwitch {
  private service?: Service;  
  constructor(private platform: TuyaWebPlatform, private api: API, private log: Logger) {
    const colorRotationUuid = api.hap.uuid.generate('color-rotation-switch');
    var colorRotationAccessory = platform.accessories.get(colorRotationUuid);
  
    if (!colorRotationAccessory) {
      log.info('Creating a color rotation switch');
      // create a new accessory
      colorRotationAccessory = new api.platformAccessory('Color Rotation', colorRotationUuid);
  
      // register the accessory
      api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [colorRotationAccessory]);
    }
  
    // get the LightBulb service if it exists
    this.service = colorRotationAccessory.getService(api.hap.Service.Lightbulb);
    
  
    // otherwise create a new LightBulb service
    if (!this.service) {
      this.service = colorRotationAccessory.addService(api.hap.Service.Lightbulb);
    }

    this.service.getCharacteristic(this.api.hap.Characteristic.On)
        .on('get', this.handleOnGet.bind(this))
        .on('set', this.handleOnSet.bind(this));
  }

  private isOn: boolean = false;

  private handleOnGet(callback: CharacteristicGetCallback) {
    callback(null, this.isOn);
  }

  private handleOnSet(value: any, callback: CharacteristicSetCallback) {
    this.isOn = value;
    callback(null);
  }
}

