declare module 'globe.gl' {
  export default class Globe {
    constructor(element: HTMLElement);
    globeImageUrl(url: string): Globe;
    bumpImageUrl(url: string): Globe;
    backgroundImageUrl(url: string): Globe;
    pathsData(data: any[]): Globe;
    pathPoints(accessor: string): Globe;
    pathPointLat(accessor: (point: any) => number): Globe;
    pathPointLng(accessor: (point: any) => number): Globe;
    pathColor(accessor: (path: any) => string): Globe;
    pathLabel(accessor: (path: any) => string): Globe;
    pathDashLength(length: number): Globe;
    pathDashGap(gap: number): Globe;
    pathDashAnimateTime(time: number): Globe;
    pointsData(data: any[]): Globe;
    pointLat(accessor: string | ((point: any) => number)): Globe;
    pointLng(accessor: string | ((point: any) => number)): Globe;
    pointColor(accessor: string | ((point: any) => string)): Globe;
    pointAltitude(accessor: string | ((point: any) => number)): Globe;
    pointRadius(accessor: string | ((point: any) => number)): Globe;
    pointLabel(accessor: string | ((point: any) => string)): Globe;
    arcsData(data: any[]): Globe;
    arcStartLat(accessor: string | ((arc: any) => number)): Globe;
    arcStartLng(accessor: string | ((arc: any) => number)): Globe;
    arcEndLat(accessor: string | ((arc: any) => number)): Globe;
    arcEndLng(accessor: string | ((arc: any) => number)): Globe;
    arcColor(accessor: string | ((arc: any) => string)): Globe;
    arcAltitude(accessor: string | ((arc: any) => number)): Globe;
    arcStroke(accessor: string | ((arc: any) => number)): Globe;
    arcLabel(accessor: string | ((arc: any) => string)): Globe;
    width(width?: number): Globe | number;
    height(height?: number): Globe | number;
    controls(): any;
    camera(): any;
    scene(): any;
    renderer(): any;
  }
}