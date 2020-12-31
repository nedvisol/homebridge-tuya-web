import { TuyaWebPlatform, HomebridgeAccessory} from '../platform';
import { API, Logger, Service, CharacteristicGetCallback, CharacteristicSetCallback, Categories } from 'homebridge';
import {PLATFORM_NAME, PLUGIN_NAME, TUYA_DISCOVERY_TIMEOUT} from '../settings';

const hueValues = [3, 30, 54, 93, 184, 237, 261, 282, 301, 322, 339, 359];

export class RotationSwitch {
  private service?: Service;  
  private lightAccesories: HomebridgeAccessory[] = [];
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

    //find RGB lights
    this.loadRGBLights();
  }

  private loadRGBLights(): void {
    for(const accessoryKV of this.platform.accessories) {
      const accessory = accessoryKV[1];
      if (accessory.category == Categories.LIGHTBULB) {
        this.log.info(`Found light accessories ${accessory.displayName}`);
        this.lightAccesories.push(accessory);        
      }
    }
  }

  public isOn: boolean = false;
  private currentHueIndex: number = 0;

  private handleOnGet(callback: CharacteristicGetCallback) {
    callback(null, this.isOn);
  }

  private handleOnSet(value: any, callback: CharacteristicSetCallback) {    
    if (!this.isOn && value) {
      // start the loop
      this.log.info("Starting color rotation loop");
      this.currentHueIndex = 0;
      this.maxSaturation();
      this.maxBrightness();
      setTimeout(()=>{
        rotationLoop(this);
      }, 0);      
    }
    this.isOn = value;
    callback(null);
  }

  private maxSaturation(): void {
    for(const accessory of this.lightAccesories) {      
      setTimeout(()=>{
        this.log.info(`Max Saturation for [${accessory.displayName}] ${accessory.controller == null} ${accessory.controller?.service == null}`);
        accessory.controller?.service?.setCharacteristic(this.api.hap.Characteristic.Saturation, 100);
      }, Math.round((Math.random()*200)+300));      
    }
  }

  private maxBrightness(): void {
    for(const accessory of this.lightAccesories) {      
      setTimeout(()=>{
        this.log.info(`Max Saturation for [${accessory.displayName}] ${accessory.controller == null} ${accessory.controller?.service == null}`);
        accessory.controller?.service?.setCharacteristic(this.api.hap.Characteristic.Brightness, 100);
      }, Math.round((Math.random()*200)+300));      
    }
  }

  public rotate(): void {
    const hueValue = hueValues[this.currentHueIndex];
    this.log.info(`Switching color to [${hueValue}]`);
    for(const accessory of this.lightAccesories) {      
      setTimeout(()=>{
        //accessory.controller?.setCharacteristic(this.api.hap.Characteristic.Hue, this.currentHue);
        this.log.info(`Switching color to [${hueValue}] for [${accessory.displayName}] ${accessory.controller == null} ${accessory.controller?.service == null}`);
        accessory.controller?.service?.setCharacteristic(this.api.hap.Characteristic.Hue, hueValue);
      }, Math.round((Math.random()*200)+300));      
    }
    this.currentHueIndex++;
    if (this.currentHueIndex > hueValues.length) {
      this.currentHueIndex = 0;
    }
  }
}

const rotationLoop = (rotationSwitch: RotationSwitch) => {
  rotationSwitch.rotate();
  if (rotationSwitch.isOn) {
    setTimeout(()=>{
      rotationLoop(rotationSwitch);
    }, Math.round(Math.random()*1000)+2000);  
  }
}
