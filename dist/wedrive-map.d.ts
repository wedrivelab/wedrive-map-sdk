// 위드라이브 지도 SDK 타입. 원본은 web/sdk/*.js — 메서드를 더하거나 바꾸면 여기도 같이 고친다.
// 검사: web/sdk/types.check.ts 를 tsc --noEmit --strict 로 (README · 운영 문서 참고).
// 설명은 문서 사이트의 레퍼런스(/#docs/생성옵션 · 메서드 · 오버레이)와 같다.

/** 좌표. 세 꼴 모두 받는다: [경도, 위도] · { lat, lng } · "위도,경도" */
export type Coord = [number, number] | { lat: number; lng: number } | { lat: number; lon: number } | string;
/** [서경도, 남위도, 동경도, 북위도] */
export type BBox = [number, number, number, number];
export type LngLat = [number, number];
export type LatLng = { lat: number; lng: number };
export type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";
/** 화면 방식. auto = 지도 폭 1024px부터 web · web = 데스크탑(왼쪽 패널) · app = 휴대폰 앱(아래에서 올라오는 판) */
export type UIMode = "auto" | "web" | "app";
export type ControlName = "search" | "directions" | "zoom" | "compass" | "view" | "theme" | "places" | "locate" | "north" | "scale";
export type LocateMode = "off" | "show" | "follow" | "compass";
export type RoutePrefer = "fast" | "major" | "highway" | "short";
export type RouteAvoid = "motorway";
/** 카카오와 같은 장소 카테고리 코드 */
export type CategoryCode = "MT1" | "CS2" | "PS3" | "SC4" | "AC5" | "PK6" | "OL7" | "SW8" | "BK9"
  | "CT1" | "AG2" | "PO3" | "AT4" | "AD5" | "FD6" | "CE7" | "HP8" | "PM9";

export interface DebugSwitches { radius?: boolean; collision?: boolean; tiles?: boolean; events?: boolean }
export interface PlaceFilter {
  /** food · cafe · shop · stay · medical · transit · other 중 하나 또는 배열 (/api/meta의 poi_groups) */ group?: string | string[];
  src?: string; cat?: string;
}
export interface PlaceOptions {
  placeRadius?: number; research?: boolean; placeList?: boolean; placeCard?: boolean; autoFold?: boolean;
  placeDensity?: number; labelZoom?: number; pinSize?: number;
}
export interface Interaction { draggable?: boolean; scrollwheel?: boolean; doubleClickZoom?: boolean; keyboard?: boolean }

export interface PathOptions {
  /** 완주에 걸리는 시간(ms). 기본 7000 */ duration?: number;
  color?: string; width?: number; carSize?: number; fit?: boolean;
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
  loop?: boolean;
  /** 맵매칭 주소. /로 시작하면 지도 서버 기준이고 키가 붙는다. null이면 받은 좌표 그대로 */ match?: string | null;
  matchKey?: string;
}
export interface AppPathOptions { handler?: string; requestKey?: string; event?: string; clearEvent?: string; dataKey?: string; optionKey?: string }

export interface MapOptions extends PlaceOptions, Interaction {
  /** 지도를 그릴 엘리먼트 또는 그 id */ container: string | HTMLElement;
  /** 지도 서버 주소. 내 사이트에서 쓸 때는 꼭 */ server?: string;
  /** JavaScript 키 (앱 WebView면 네이티브 앱 키) */ key?: string;
  /** 네이티브 앱 키와 같이 쓰는 패키지명 · 번들 ID */ app?: string;
  /** 지도 색상. "auto"는 기기(앱)의 다크 · 라이트를 따라가고, 바뀌면 같이 바뀐다. 기본 "dark" */
  theme?: "dark" | "light" | "auto";
  /** 화면 방식. 기본 "auto" */
  ui?: UIMode;
  view?: "2d" | "3d";
  center?: Coord;
  zoom?: number; pitch?: number; bearing?: number;
  locate?: boolean;
  locateMode?: LocateMode;
  locationSource?: "auto" | "app" | "browser";
  bridge?: { send(payload: unknown): void };
  lastKnown?: boolean;
  region?: string;
  buildings?: string | null;
  controls?: ControlName[] | false;
  controlSize?: number;
  controlPosition?: Position;
  attributionPosition?: Position;
  navigation?: boolean;
  routePrefer?: RoutePrefer;
  places?: boolean;
  placeFilter?: PlaceFilter | null;
  debug?: boolean | DebugSwitches;
  /** 서버에 적용한 지도 모양을 받아 따를지. 기본 true */ live?: boolean;
  /** 기본값으로만 쓸 옵션 (지도 모양이 덮어쓴다) */ defaults?: Partial<MapOptions>;
  path?: PathOptions;
  appPath?: AppPathOptions | false;
  onError?: (err: Error) => void;
}

/** 장소 하나 (검색 · 상세 응답). 값이 없으면 빈 문자열 */
export interface Place {
  poi_id: string; src: "store" | "osm" | "bldg" | string; name: string; name_en: string; cat: string; kind: string;
  lon: number; lat: number; addr: string; admin: string; hdong: string; phone: string; opening_hours: string; website: string;
  /** near를 줬을 때만 */ dist_m?: number;
}
export interface Road { road_id: number; name: string; kind: string | null; lon: number; lat: number; ways: number }
export interface SearchOptions {
  page?: number; size?: number; limit?: number; near?: Coord; category?: CategoryCode; radius?: number;
  sort?: "accuracy" | "distance";
  /** true면 총 개수(total)도 센다. 서버가 한 번 더 훑어 느려지니 "총 N건"을 보여 줄 때만 */ count?: boolean;
}
export interface SearchResult {
  places: Place[]; roads: Road[]; coord: { lat: number; lon: number } | null; page: number;
  /** 마지막 쪽인지 */ isEnd: boolean;
  /** count: true일 때만 숫자, 아니면 null */ total: number | null;
  category?: { id: CategoryCode; label: string };
}

export interface RouteStep { text: string; sign: number; street: string | null; distance_m: number; time_s: number; at: number }
export interface Route {
  distance_m: number; time_s: number; bbox: BBox; geometry: LngLat[]; steps: RouteStep[];
  /** 터널 · 지하차도 구간 [시작, 끝] (geometry 인덱스) */ tunnels: [number, number][];
  /** alternatives: true일 때만. 다른 경로들 */ alternatives?: Route[];
}
export interface RouteOptions {
  via?: Coord[]; heading?: number; prefer?: RoutePrefer;
  /** 피할 길. ["motorway"]면 자동차전용도로를 아예 안 탄다 */ avoid?: RouteAvoid | RouteAvoid[];
  /** 다른 경로를 최대 2개 함께. 경유지가 없을 때만 */ alternatives?: boolean;
  /** "foot"이면 걷는 길. 걷는 길에는 heading · prefer · avoid · alternatives를 쓸 수 없다 */ profile?: "car" | "foot";
}
/** routeOrder()의 들를 곳 */
export interface OrderStop { id: string; at: Coord }
export interface RouteOrderOptions {
  /** [앞 id, 뒤 id] — 앞을 뒤보다 먼저 (태우기 → 내리기) */ pairs?: [string, string][];
  /** free 아무 데서나 끝(기본) · last 마지막 곳이 도착지 · return 출발지로 돌아옴 */ end?: "free" | "last" | "return";
  /** distance 거리(기본) · time 시간 */ by?: "distance" | "time";
}
export interface RouteOrderLeg { /** null이면 출발지 */ from: string | null; /** null이면 출발지(return) */ to: string | null; distance_m: number; time_s: number; geometry: LngLat[] }
export interface RouteOrder {
  /** 들를 순서 (id) */ order: string[]; legs: RouteOrderLeg[]; distance_m: number; time_s: number;
  by: "distance" | "time"; /** exact 정확한 계산(16곳까지) · quick 빠른 계산 */ method: "exact" | "quick"; ms: number;
}
/** [i][j] = i → j. 같은 곳 0, 길 없으면 null */
export interface RouteMatrix { time_s: (number | null)[][]; distance_m: (number | null)[][] }

// ── 오버레이 ───────────────────────────────────────────────────────────────
export type OverlayEvent = "click" | "dblclick" | "rightclick" | "mouseover" | "mouseout";
export type MarkerEvent = OverlayEvent | "dragstart" | "drag" | "dragend";
export interface MarkerImage { url: string; width?: number; height?: number; offset?: [number, number]; spriteOrigin?: [number, number]; spriteSize?: [number, number] }
export interface MarkerOptions {
  color?: string; image?: string | MarkerImage; title?: string; popup?: string; draggable?: boolean; clickable?: boolean;
  zIndex?: number; opacity?: number; anchor?: string; offset?: [number, number];
}
/** marker() · overlay()가 돌려준다 (MapLibre Marker를 물려받아 getLngLat() 등도 된다) */
export interface MapMarker {
  getPosition(): LatLng; setPosition(where: Coord): this;
  setVisible(on: boolean): this; getVisible(): boolean;
  setZIndex(n: number): this; getZIndex(): number; setOpacity(v: number): this;
  setImage(image: string | MarkerImage): this;
  setTitle(t: string): this; getTitle(): string;
  setClickable(on: boolean): this; getClickable(): boolean;
  setDraggable(on: boolean): this; getDraggable(): boolean;
  setContent(html: string | HTMLElement): this;
  on(type: MarkerEvent, fn: (at: LatLng, raw: unknown) => void): this;
  off(type: MarkerEvent, fn: (at: LatLng, raw: unknown) => void): this;
  remove(): this;
  getLngLat(): { lng: number; lat: number };
}
export interface InfoWindowOptions { content?: string | HTMLElement; position?: Coord; removable?: boolean; closeButton?: boolean; closeOnClick?: boolean; maxWidth?: string; zIndex?: number }
export interface InfoWindow {
  open(target: MapMarker | Coord): this; close(): this; isOpen(): boolean;
  setZIndex(n: number): this; getZIndex(): number;
  setContent(c: string | HTMLElement): this; setPosition(where: Coord): this; getPosition(): LatLng | null;
}
export interface ShapeStyle {
  strokeColor?: string; strokeWeight?: number; strokeOpacity?: number;
  strokeStyle?: "solid" | "dash" | "shortdash" | "longdash" | "dot";
  fillColor?: string; fillOpacity?: number; zIndex?: number; endArrow?: boolean;
}
export interface Shape {
  setOptions(style: ShapeStyle): this; setZIndex(n: number): this; getZIndex(): number;
  setVisible(on: boolean): this; getVisible(): boolean;
  /** 길이(m). 다각형 · 원 · 사각형은 둘레 */ length(): number;
  /** 넓이(m²). 구멍은 뺀다. 선은 0 */ area(): number;
  bounds(): BBox;
  on(type: OverlayEvent, fn: (at: LatLng, raw: unknown) => void): this;
  off(type: OverlayEvent, fn: (at: LatLng, raw: unknown) => void): this;
  remove(): this;
}
export interface Polyline extends Shape { setPath(p: Coord[]): this; getPath(): LngLat[] }
export interface Polygon extends Shape { setPath(p: Coord[] | Coord[][]): this; getPath(): LngLat[][] }
export interface Circle extends Shape { setPosition(c: Coord): this; getPosition(): LatLng; setRadius(m: number): this; getRadius(): number }
export interface Ellipse extends Shape { setPosition(c: Coord): this; getPosition(): LatLng; setRadius(rx: number, ry: number): this; getRadiusX(): number; getRadiusY(): number }
export interface Rectangle extends Shape { setBounds(b: BBox): this; getBounds(): BBox }

export interface Cluster { center: LatLng; size: number; markers: MapMarker[]; bounds: BBox }
export interface ClustererOptions { markers?: MapMarker[]; gridSize?: number; minClusterSize?: number; maxZoom?: number; disableClickZoom?: boolean; render?: (size: number, cluster: Cluster) => string }
export interface MarkerClusterer {
  addMarker(m: MapMarker): this; addMarkers(list: MapMarker[]): this; removeMarker(m: MapMarker): this; removeMarkers(list: MapMarker[]): this;
  getMarkers(): MapMarker[]; clear(): this; redraw(): this;
  setGridSize(px: number): this; getGridSize(): number; setMinClusterSize(n: number): this; getMinClusterSize(): number;
  setMaxZoom(z: number): this; getMaxZoom(): number; setRender(fn: (size: number, cluster: Cluster) => string): this;
  on(type: "clusterclick" | "clusterover" | "clusterout" | "clusterrightclick", fn: (c: Cluster) => void): this;
  on(type: "clustered", fn: (list: { id: string; size: number; center: LatLng }[]) => void): this;
  off(type: string, fn: (...args: any[]) => void): this;
  remove(): void;
}

export type DrawMode = "marker" | "polyline" | "polygon" | "circle" | "ellipse" | "rectangle";
export interface DrawingData {
  marker: LatLng[]; polyline: LngLat[][]; polygon: LngLat[][][]; circle: { center: LatLng; radius: number }[];
  ellipse: { center: LatLng; rx: number; ry: number }[]; rectangle: BBox[];
}
export interface DrawingManager {
  readonly mode: DrawMode | null;
  select(mode: DrawMode): this; cancel(): this; toolbox(o?: { position?: Position }): this;
  undo(): this; redo(): this; undoable(): boolean; redoable(): boolean;
  getData(): DrawingData; getOverlays(): Record<DrawMode, (MapMarker | Shape)[]>;
  remove(overlay: MapMarker | Shape): this; clear(): this;
  on(type: "drawstart" | "drawnext" | "drawend" | "cancel" | "remove" | "state_changed", fn: (e: any) => void): this;
  off(type: string, fn: (...args: any[]) => void): this;
  destroy(): void;
}

// ── 길 안내 ────────────────────────────────────────────────────────────────
export interface Fix { lat: number; lng: number; heading?: number; speed?: number; accuracy?: number }
export interface NavProgress {
  step: RouteStep | null; next_m: number; remaining_m: number; remaining_s: number;
  onRoute: boolean; off_m: number; at: LngLat; bearing: number;
  /** 터널에서 위치가 끊겨 경로를 따라 추정 중인지 */ estimated: boolean;
  /** 그다음 안내(다음 안내 뒤의 것)와 다음 안내에서 그것까지 거리. 경로로 가는 중이면 올라탄 뒤 첫 안내와 지금 자리에서 그것까지 */
  then: RouteStep | null; then_m: number | null;
  /** 다음 경유지까지 남은 거리(m) · 시간(초). 경유지가 안 남았으면 null. via_left = 남은 경유지 수 */
  via_m: number | null; via_s: number | null; via_left: number;
  /** 출발 전 경로선까지 가는 중인지. toward = 경로선 가장 가까운 곳 방향(도, 북 = 0) */
  approach: boolean; toward?: number;
  /** 역주행 중인지 */ wrongWay: boolean;
  /** 속도(m/s). 모르면 null */ speed: number | null;
  /** 받은 위치 그대로 [경도, 위도] (at은 경로선 위로 붙인 점). 터널 추정 중이면 null */ raw: LngLat | null;
  /** 지금 달리는 도로 이름. 이름 없는 길이면 null */ road: string | null;
}
/** 안내 화면의 도착 시각. true(기본) 경로로 계산 · false 안 보임(거리만) · 시각 = 서버가 정한 도착 예정을 그대로 (epoch 초 · 밀리초 · ISO 문자열 · Date) */
export type ArrivalTime = boolean | number | string | Date;
/** 정류장 하나의 서버 도착 예정. eta: UTC ISO 문자열(null = 미정), estimated: true면 "(추정)" */
export interface StopEta { eta: string | null; estimated?: boolean }
export interface NavigateOptions extends Pick<RouteOptions, "via" | "prefer" | "avoid"> {
  from?: Coord; speak?: (text: string) => void; follow?: boolean; watch?: boolean; color?: string;
  arrivalTime?: ArrivalTime;
  /** [경유 1, …, 목적지] 방문 순서의 서버 도착 예정. 주면 안내 화면은 이 시각만 보인다(걸리는 시간 · 웹맵 계산 시각 없음). 개수가 경유지 + 1과 다르면 전부 미정 */
  stopEtas?: StopEta[];
}
export interface Navigation {
  readonly route: Route;
  readonly lost: boolean;
  on(event: "route" | "reroute", fn: (r: Route) => void): this;
  on(event: "progress" | "arrive", fn: (p: NavProgress) => void): this;
  on(event: "speak", fn: (text: string) => void): this;
  on(event: "follow", fn: (on: boolean) => void): this;
  on(event: "signal", fn: (s: { lost: boolean }) => void): this;
  on(event: "stop", fn: () => void): this;
  off(event: string, fn: (...args: any[]) => void): this;
  update(fix: Fix): void;
  recenter(): void;
  /** 지금 자리에서 경로를 다시 찾는다 (재탐색 사이 5초 간격은 지킨다) */
  reroute(): this;
  /** 안내 화면의 도착 시각만 바꾼다 (서버 도착 예정이 바뀌었을 때). 안내는 다시 걸지 않는다 */
  setArrivalTime(v: ArrivalTime): this;
  readonly arrivalTime: ArrivalTime;
  /** 정류장별 서버 도착 예정을 바꾼다 (지금 남은 경유지 + 목적지 순서) */
  setStopEtas(list: StopEta[]): this;
  readonly stopEtas: StopEta[] | null;
  stop(): void;
}
export type DirectionsPoint = Coord | { name: string; lon: number; lat: number };
export interface Directions {
  readonly isOpen: boolean; readonly navigating: boolean;
  close(): this; toggle(): this; addVia(pt: { name: string; lon: number; lat: number }): this;
}

export interface AppBridge {
  available(): boolean;
  /** wait(ms) 동안 앱이 좌표 없이 답하면 1초마다 다시 묻는다 (기본 0 = 한 번) */
  location(o?: { wait?: number }): Promise<LatLng & { accuracy_m?: number }>;
  permission(link: "PUSH" | "LOCATION" | "CAMERA" | "LOCATION_ALWAYS"): Promise<boolean>;
  call(request: string, extra?: Record<string, unknown>): Promise<unknown>;
}

export type MapEvent = "click" | "dblclick" | "rightclick" | "mousemove" | "idle" | "zoom_start" | "zoom_changed"
  | "center_changed" | "bounds_changed" | "dragstart" | "drag" | "dragend" | "tilesloaded" | "placeopen";

// ── 지도 ───────────────────────────────────────────────────────────────────
export class WeDriveMap {
  constructor(options: MapOptions);
  /** SDK 버전 */ static readonly version: string;
  readonly server: string; readonly key: string; readonly app: string;
  /** 지금 그리는 색 (auto면 기기 모드) */ readonly theme: "dark" | "light";
  /** 고른 테마. auto면 기기를 따라간다 */ readonly themeMode: "dark" | "light" | "auto";
  readonly view: "2d" | "3d"; readonly region: string;
  readonly locateMode: LocateMode; readonly debug: Required<DebugSwitches>;
  readonly bridge: AppBridge;
  /** 내부 MapLibre Map 객체. SDK에 없는 것은 여기서 (타입은 maplibre-gl의 Map) */
  readonly raw: any;

  /** 지도가 처음 그려질 때까지 기다린다 */
  ready(): Promise<void>;
  remove(): void;
  on(event: "click" | "dblclick" | "rightclick" | "mousemove", fn: (at: LatLng, raw: unknown) => void): this;
  on(event: "placeopen", fn: (e: { place: Place }) => void): this;
  on(event: MapEvent | string, fn: (...args: any[]) => void): this;
  off(event: string, fn: (...args: any[]) => void): this;

  // 카메라
  moveTo(where: Coord, o?: { zoom?: number; animate?: boolean }): this;
  flyTo(where: Coord, o?: { zoom?: number; speed?: number }): this;
  reveal(where: Coord, o?: { minZoom?: number; padding?: number }): this;
  fitBounds(bbox: BBox, o?: { padding?: number; animate?: boolean }): this;
  fitMarkers(o?: { padding?: number }): this;
  setZoom(z: number, o?: { anchor?: Coord; animate?: boolean }): this;
  zoomIn(): this; zoomOut(): this;
  panBy(x: number, y: number, o?: { animate?: boolean }): this;
  project(where: Coord): { x: number; y: number };
  unproject(p: { x: number; y: number }): LatLng;
  setZoomRange(min: number, max: number): this;
  setMaxBounds(bbox: BBox | null): this;
  setPitch(deg: number): this; setBearing(deg: number): this; resetNorth(): this;
  setView(view: "2d" | "3d"): this;
  center(): LatLng; zoom(): number; pitch(): number; bearing(): number; bounds(): BBox;
  resize(): this;

  // 표시
  marker(where: Coord, opts?: MarkerOptions): MapMarker;
  overlay(where: Coord, content: string | HTMLElement, opts?: { anchor?: string; offset?: [number, number]; zIndex?: number }): MapMarker;
  infoWindow(opts?: InfoWindowOptions): InfoWindow;
  polyline(path: Coord[], style?: ShapeStyle): Polyline;
  polygon(path: Coord[] | Coord[][], style?: ShapeStyle): Polygon;
  circle(center: Coord, radiusM: number, style?: ShapeStyle): Circle;
  ellipse(center: Coord, rx: number, ry: number, style?: ShapeStyle): Ellipse;
  rectangle(bbox: BBox, style?: ShapeStyle): Rectangle;
  shapes(): Shape[]; clearShapes(): this; clearMarkers(): this;
  clusterer(opts?: ClustererOptions): MarkerClusterer;
  drawing(opts?: { modes?: DrawMode[]; style?: ShapeStyle; markerOptions?: MarkerOptions }): DrawingManager;
  showRadius(where: Coord, radiusM: number, o?: { color?: string; opacity?: number; fit?: boolean }): this;
  hideRadius(): this;
  /** "auto"는 기기의 다크 · 라이트를 따라간다 */
  setTheme(theme: "dark" | "light" | "auto"): this;
  /** 화면 방식을 바꾼다 */
  setUI(mode: UIMode): this;
  /** 지금 실제로 쓰는 화면 방식 (auto면 폭에 따라 정해진 쪽) */
  uiMode(): "web" | "app";
  setRegion(name: string, buildings?: string | null, o?: { move?: boolean }): this;
  setBuildings(on: boolean | string): this;

  // 장소
  search(q: string, opts?: SearchOptions): Promise<SearchResult>;
  categorySearch(code: CategoryCode, opts?: SearchOptions): Promise<SearchResult>;
  openPlace(place: Partial<Place> & { name: string; lon: number; lat: number }, o?: { move?: boolean }): Promise<unknown>;
  closePlace(): this;
  showPlaces(on?: boolean): this;
  filterPlaces(f: PlaceFilter | null): this;
  placeFilter(): PlaceFilter | null;
  setPlaceOptions(o: PlaceOptions): this;
  placeOptions(): Required<PlaceOptions>;

  // 내 위치
  locate(o?: { move?: boolean; zoom?: number; marker?: boolean }): Promise<LatLng & { accuracy_m: number }>;
  toggleLocate(): Promise<unknown>;
  setLocateMode(mode: LocateMode): Promise<void>;
  lastKnown(): (LatLng & { age_ms: number }) | null;

  // 길 안내
  route(from: Coord, to: Coord, o?: RouteOptions): Promise<Route>;
  /** 여러 곳 방문 순서 (자동차, 최대 30곳). 못 가면 err.data.code(unreachable | no_order) · err.data.stops */
  routeOrder(from: Coord, stops: OrderStop[], o?: RouteOrderOptions): Promise<RouteOrder>;
  /** 이동 시간 · 거리 표 (자동차, 2~31곳) */
  routeMatrix(points: Coord[]): Promise<RouteMatrix>;
  navigate(to: Coord, o?: NavigateOptions): Promise<Navigation>;
  directions(): Directions;
  openDirections(o?: { from?: DirectionsPoint | "me"; to?: DirectionsPoint; via?: DirectionsPoint[]; arrivalTime?: ArrivalTime; stopEtas?: StopEta[] }): Directions;
  setNavigation(on: boolean): this;
  navigationEnabled(): boolean;

  // 주행 기록
  drawPath(input: string | Coord[] | Record<string, unknown>, opts?: PathOptions): Promise<unknown>;
  playPath(opts?: PathOptions): this;
  clearPath(): this;

  // 그 밖에
  setDebug(d: boolean | DebugSwitches): this;
  setControlSize(px: number): this;
  setControlPosition(pos: Position): this;
  setAttributionPosition(pos: Position): this;
  setInteraction(o: Interaction): this; getInteraction(): Required<Interaction>;
  setDraggable(on: boolean): this; getDraggable(): boolean;
  setZoomable(on: boolean): this; getZoomable(): boolean;
  setKeyboardShortcuts(on: boolean): this; getKeyboardShortcuts(): boolean;
  setCursor(css?: string): this;
  applyPreset(preset: Record<string, unknown>): this;
}
export default WeDriveMap;

// ── 유틸 ───────────────────────────────────────────────────────────────────
export const VERSION: string;
export function distanceM(a: LngLat, b: LngLat): number;
export function boundsOf(coords: LngLat[]): BBox;
export function boxAround(center: LngLat, radiusM: number): BBox;
export function toLngLat(v: Coord): LngLat | null;
/** 반경 원을 GeoJSON Feature(Polygon)로 돌려준다. properties.radius_m에 반지름 */
export function circlePolygon(center: LngLat, radiusM: number, steps?: number):
  { type: "Feature"; properties: { radius_m: number }; geometry: { type: "Polygon"; coordinates: LngLat[][] } };
export function lengthM(path: LngLat[]): number;
export function areaM2(rings: LngLat[][]): number;
export type CoordSystem = "WGS84" | "UTMK" | "WTM" | "EPSG:5186" | "TM" | "EPSG:5174" | "KTM" | "WCONGNAMUL" | "CONGNAMUL" | string;
export function transCoord(coord: [number, number] | { x: number; y: number } | LatLng, from: CoordSystem, to: CoordSystem): { x: number; y: number };
export const COORD_SYSTEMS: string[];
export const PATH_DEFAULTS: Required<Omit<PathOptions, "match">> & { match: string | null };
export const INBOUND: Required<AppPathOptions>;
export const INTERACTIONS: ("draggable" | "scrollwheel" | "doubleClickZoom" | "keyboard")[];
export const POSITIONS: Position[];
export const DEBUG_KEYS: (keyof DebugSwitches)[];
