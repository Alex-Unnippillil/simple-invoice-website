export interface FeatureFlags {
  email: boolean;
  sms: boolean;
  pdf: boolean;
  telemetry: boolean;
}

const flags: FeatureFlags = {
  email: true,
  sms: true,
  pdf: true,
  telemetry: true,
};

let emergencyOverride = false;

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return !emergencyOverride && flags[flag];
}

export function setFeatureFlag(flag: keyof FeatureFlags, value: boolean): void {
  flags[flag] = value;
}

export function setEmergencyOverride(disabled: boolean): void {
  emergencyOverride = disabled;
}

export function getEmergencyOverride(): boolean {
  return emergencyOverride;
}

export default flags;
