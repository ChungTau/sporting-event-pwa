export interface MarkerData {
  id?: string; // Make id optional
  name?: string; // Make name optional
  services?: string[]; // Make services optional
  distance?: number | 0; // Make distance required
  elevationGain?: number | 0; // Make elevationGain required
  elevation?: number | 0; // Make elevation required
  distanceInter?: number | 0; // Make distanceInter required
  position?: any| null; // Make position required
  removable?: boolean; 
}
  
  // Augment the Marker type from mapbox-gl module
  declare module 'mapbox-gl' {
    interface Marker {
      data?: MarkerData|null;
    }
  }