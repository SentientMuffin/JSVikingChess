class EscapeZone {
  constructor(locationId) {
    this.locationId = locationId;
  }

  static className = 'escapeZone';

  static isEscapeZone(locationId) {
    for (let zone of gameState.EscapeZones) {
      if (zone.locationId === locationId) return true;
    }
    return false;
  }
}

